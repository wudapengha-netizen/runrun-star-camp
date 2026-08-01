# -*- coding: utf-8 -*-
"""润润的三年级闯关营 —— 本地服务器

既当静态网页服务器，又负责把学习记录存成真正的文件：

    save/润润.json          当前存档（云盘同步的就是这个文件）
    save/backup/*.json      每次保存前自动留一份，最多留 40 份

为什么要有它：浏览器的 localStorage 绑死在"这台电脑的这个浏览器"上，
换电脑带不走、清缓存就没了。存成文件放进云盘同步目录，才能真正跨电脑。

用法：双击 start.bat 就行。
"""
import io
import json
import os
import re
import shutil
import socket
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

if sys.stdout and hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(ROOT, 'save')
BACKUP_DIR = os.path.join(SAVE_DIR, 'backup')
PORT = 8899
MAX_BACKUPS = 40
MAX_BODY = 12 * 1024 * 1024          # 12MB，正常存档 200KB 左右，留足余量


def safe_profile(name):
    """把档案名收敛成安全文件名，挡掉 ../ 之类的路径穿越。"""
    name = unquote(name or '').strip() or 'default'
    name = re.sub(r'[\\/:*?"<>|\x00-\x1f]', '', name)
    name = name.replace('..', '')
    return (name[:40] or 'default')


def save_path(profile):
    return os.path.join(SAVE_DIR, safe_profile(profile) + '.json')


def ensure_dirs():
    os.makedirs(BACKUP_DIR, exist_ok=True)


def rotate_backup(profile):
    """保存前先把旧存档复制一份到 backup/，多了就删最老的。"""
    src = save_path(profile)
    if not os.path.exists(src):
        return
    stamp = time.strftime('%Y%m%d-%H%M%S')
    dst = os.path.join(BACKUP_DIR, '%s-%s.json' % (safe_profile(profile), stamp))
    try:
        shutil.copy2(src, dst)
    except OSError:
        return
    files = sorted(
        f for f in os.listdir(BACKUP_DIR)
        if f.startswith(safe_profile(profile) + '-') and f.endswith('.json')
    )
    for old in files[:-MAX_BACKUPS]:
        try:
            os.remove(os.path.join(BACKUP_DIR, old))
        except OSError:
            pass


def write_atomic(path, text):
    """先写临时文件再改名。云盘同步时最怕写到一半，这样就不会留下半个文件。"""
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


class Handler(SimpleHTTPRequestHandler):

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    # —— 少刷点日志，别把控制台刷满 ——
    def log_message(self, fmt, *args):
        if self.path.startswith('/api/'):
            sys.stderr.write('  %s %s\n' % (self.command, self.path))

    def _json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # 网页文件改了要立刻生效，别让浏览器缓存住
        if not self.path.startswith('/api/'):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    # ------------------------------------------------------------------ GET
    def do_GET(self):
        u = urlparse(self.path)

        if u.path == '/api/ping':
            return self._json({
                'ok': True,
                'mode': 'server',
                'saveDir': SAVE_DIR,
                'time': int(time.time() * 1000)
            })

        if u.path == '/api/save':
            profile = (parse_qs(u.query).get('profile') or ['default'])[0]
            p = save_path(profile)
            if not os.path.exists(p):
                return self._json({'ok': True, 'empty': True, 'data': None})
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                return self._json({'ok': True, 'empty': False, 'data': data,
                                   'mtime': int(os.path.getmtime(p) * 1000)})
            except (OSError, ValueError) as e:
                return self._json({'ok': False, 'error': '存档读取失败：%s' % e}, 500)

        if u.path == '/api/backups':
            profile = (parse_qs(u.query).get('profile') or ['default'])[0]
            ensure_dirs()
            pre = safe_profile(profile) + '-'
            items = []
            for f in sorted(os.listdir(BACKUP_DIR), reverse=True):
                if f.startswith(pre) and f.endswith('.json'):
                    fp = os.path.join(BACKUP_DIR, f)
                    items.append({'file': f,
                                  'size': os.path.getsize(fp),
                                  'mtime': int(os.path.getmtime(fp) * 1000)})
            return self._json({'ok': True, 'items': items})

        return super().do_GET()

    # ----------------------------------------------------------------- POST
    def do_POST(self):
        u = urlparse(self.path)
        if u.path != '/api/save':
            return self._json({'ok': False, 'error': '没有这个接口'}, 404)

        try:
            length = int(self.headers.get('Content-Length') or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            return self._json({'ok': False, 'error': '存档大小不对'}, 400)

        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode('utf-8'))
        except (UnicodeDecodeError, ValueError) as e:
            return self._json({'ok': False, 'error': '存档不是合法 JSON：%s' % e}, 400)

        profile = (parse_qs(u.query).get('profile') or ['default'])[0]
        ensure_dirs()

        # 冲突保护：如果磁盘上的存档比客户端手里的底本还新，
        # 说明别的设备（或云盘）在这中间改过，先不覆盖，让页面去合并。
        p = save_path(profile)
        force = (parse_qs(u.query).get('force') or ['0'])[0] == '1'
        if os.path.exists(p) and not force:
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    disk = json.load(f)
                disk_at = int(disk.get('savedAt') or 0)
                base_at = int(data.get('baseSavedAt') or 0)
                if disk_at > base_at and disk.get('device') != data.get('device'):
                    return self._json({
                        'ok': False, 'conflict': True,
                        'error': '磁盘上的存档更新，可能是另一台电脑刚存过',
                        'disk': disk
                    }, 409)
            except (OSError, ValueError):
                pass    # 旧文件坏了就别拦着，直接覆盖

        data.pop('baseSavedAt', None)
        rotate_backup(profile)
        try:
            write_atomic(p, json.dumps(data, ensure_ascii=False, indent=1))
        except OSError as e:
            return self._json({'ok': False, 'error': '写入失败：%s' % e}, 500)

        return self._json({'ok': True, 'savedAt': data.get('savedAt'), 'path': p})


def lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return None


def main():
    ensure_dirs()
    os.chdir(ROOT)
    srv = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)

    ip = lan_ip()
    print('')
    print('  ┌────────────────────────────────────────────────┐')
    print('  │   润润的三年级闯关营 —— 已启动                  │')
    print('  └────────────────────────────────────────────────┘')
    print('')
    print('   这台电脑：  http://localhost:%d/index.html' % PORT)
    if ip:
        print('   平板/手机：http://%s:%d/index.html' % (ip, PORT))
        print('              （要和这台电脑连同一个 WiFi）')
    print('')
    print('   存档文件：  %s' % os.path.join(SAVE_DIR, '润润.json'))
    print('   自动备份：  %s' % BACKUP_DIR)
    print('')
    print('   关掉这个黑窗口就停止。学习记录已经存成文件，不会丢。')
    print('')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print('\n   已停止。')


if __name__ == '__main__':
    main()
