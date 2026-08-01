/* ============================================================
   storage.js —— 存档层
   三种后端，按优先级自动选，选不上就往下降：

     ① cloud   云端存档（GitHub Pages + Cloudflare Worker）
               任何设备、任何地方打开都是同一份进度。
               需要 data/cloud.js 填了 Worker 网址，
               而且这台设备输入过配对码。

     ② server  本地文件（双击 start.bat）
               记录写成 save/润润.json，配合云盘同步用。

     ③ local   只存在这个浏览器里（直接双击 index.html）
               换设备带不走，页面会明确提示。

   不管哪种模式，localStorage 都会同时写一份：
   既当热缓存，也是断网时的缓冲区 —— 网一恢复就自动补传。
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'runrun.grade3.v1';
  var DEV_KEY = 'runrun.deviceId';
  var PAIR_KEY = 'runrun.pairKey';
  var SCHEMA = 2;

  var mode = 'local';           // 'cloud' | 'server' | 'local'
  var profile = 'default';
  var deviceId = null;
  var baseSavedAt = 0;          // 我这份是基于服务端哪个版本改的
  var pending = null;
  var timer = null;
  var listeners = [];
  var offlineQueued = false;

  var status = {
    mode: 'local', lastSave: 0, saving: false,
    error: null, conflict: false, offline: false, needPair: false
  };

  /* ---------------- 基础 ---------------- */

  function device() {
    if (deviceId) return deviceId;
    try {
      deviceId = localStorage.getItem(DEV_KEY);
      if (!deviceId) {
        deviceId = 'dev-' + Math.random().toString(36).slice(2, 8) + '-' + Date.now().toString(36);
        localStorage.setItem(DEV_KEY, deviceId);
      }
    } catch (e) { deviceId = 'dev-temp'; }
    return deviceId;
  }

  function pairKey() {
    try { return localStorage.getItem(PAIR_KEY) || ''; } catch (e) { return ''; }
  }
  function setPairKey(k) {
    try {
      if (k) localStorage.setItem(PAIR_KEY, k);
      else localStorage.removeItem(PAIR_KEY);
    } catch (e) {}
  }

  function cloudURL() {
    var c = window.CLOUD;
    if (!c || !c.url) return '';
    return String(c.url).replace(/\/+$/, '');
  }

  function onChange(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(function (f) { try { f(status); } catch (e) {} }); }

  /* ---------------- localStorage ---------------- */

  function readLocal() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeLocal(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); return true; }
    catch (e) { status.error = '浏览器存储写入失败：' + e.name; emit(); return false; }
  }

  /* ---------------- 后端请求 ---------------- */

  function endpoint(path) {
    return mode === 'cloud' ? cloudURL() + path : path;
  }

  /* HTTP 请求头只允许 ISO-8859-1 字符，配对码用中文会让 fetch 直接抛错。
     统一转成 base64（UTF-8 字节）再放进头里，Worker 那边解回来比对。 */
  function encodeKey(k) {
    if (!k) return '';
    try {
      var bytes = new TextEncoder().encode(k);
      var s = '';
      for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
      return btoa(s);
    } catch (e) { return ''; }
  }

  function headers(extra, key) {
    var h = Object.assign({}, extra || {});
    if (mode === 'cloud' || key !== undefined) {
      h['X-Camp-Key'] = encodeKey(key !== undefined ? key : pairKey());
    }
    return h;
  }

  function timeoutFetch(url, opt, ms) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 9000);
    return fetch(url, Object.assign({ cache: 'no-store' }, opt || {},
      ctrl ? { signal: ctrl.signal } : {}))
      .finally(function () { clearTimeout(t); });
  }

  /* ---------------- 选后端 ---------------- */

  function probeCloud() {
    var base = cloudURL();
    if (!base) return Promise.resolve(false);
    if (!pairKey()) { status.needPair = true; return Promise.resolve(false); }
    return timeoutFetch(base + '/api/ping', { headers: { 'X-Camp-Key': encodeKey(pairKey()) } }, 8000)
      .then(function (r) {
        if (r.status === 401) { status.needPair = true; status.error = '配对码不对，请重新输入'; return false; }
        return r.ok;
      })
      .catch(function () { return false; });
  }

  function probeServer() {
    if (location.protocol === 'file:') return Promise.resolve(false);
    return timeoutFetch('/api/ping', {}, 4000)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return !!(j && j.ok); })
      .catch(function () { return false; });
  }

  function detect() {
    return probeCloud().then(function (ok) {
      if (ok) return 'cloud';
      return probeServer().then(function (ok2) { return ok2 ? 'server' : 'local'; });
    });
  }

  /* ---------------- 读写 ---------------- */

  function remoteLoad() {
    return timeoutFetch(endpoint('/api/save?profile=' + encodeURIComponent(profile)),
      { headers: headers() }, 9000)
      .then(function (r) { return r.json(); })
      .then(function (j) { return (j && j.ok) ? j.data : null; })
      .catch(function () { return null; });
  }

  function remoteSave(data, force) {
    var body = Object.assign({}, data, { baseSavedAt: baseSavedAt });
    return timeoutFetch(
      endpoint('/api/save?profile=' + encodeURIComponent(profile) + (force ? '&force=1' : '')),
      {
        method: 'POST',
        headers: headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body)
      }, 12000
    ).then(function (r) {
      return r.json().then(function (j) { return { code: r.status, json: j }; });
    });
  }

  function newer(a, b) {
    return ((a && a.savedAt) || 0) >= ((b && b.savedAt) || 0) ? a : b;
  }

  /* ---------------- 启动 ---------------- */

  function init(profileName) {
    profile = (window.CLOUD && CLOUD.profile) || profileName || 'default';
    device();

    return detect().then(function (m) {
      mode = m;
      status.mode = m;
      if (m === 'cloud') { status.needPair = false; status.error = null; }
      emit();

      var local = readLocal();
      if (m === 'local') {
        baseSavedAt = (local && local.savedAt) || 0;
        return local;
      }

      return remoteLoad().then(function (remote) {
        var win = newer(remote, local);
        baseSavedAt = (remote && remote.savedAt) || 0;

        if (win && win !== local) writeLocal(win);
        // 本地比远端新（比如上次断网时练的），补传上去
        if (win && win === local && local !== remote) save(local, { immediate: true });
        return win;
      });
    }).catch(function (e) {
      mode = 'local';
      status.mode = 'local';
      status.error = String((e && e.message) || e);
      emit();
      return readLocal();
    });
  }

  /* ---------------- 保存 ---------------- */

  function save(data, opt) {
    opt = opt || {};
    data.savedAt = Date.now();
    data.device = device();
    data.schema = SCHEMA;
    data.profile = profile;

    writeLocal(data);                 // 本地永远先写，最快也最保险
    status.lastSave = data.savedAt;

    if (mode === 'local') { emit(); return Promise.resolve(); }

    pending = data;
    clearTimeout(timer);
    if (opt.immediate) return flush();
    timer = setTimeout(flush, 800);
    emit();
    return Promise.resolve();
  }

  function flush() {
    clearTimeout(timer);
    if (mode === 'local' || !pending) return Promise.resolve();
    var data = pending;
    pending = null;
    status.saving = true; emit();

    return remoteSave(data, false).then(function (res) {
      status.saving = false;

      if (res.code === 401) {
        status.needPair = true;
        status.error = '配对码失效了，记录暂时只存在本机';
        mode = 'local'; status.mode = 'local';
        emit();
        return;
      }

      if (res.code === 409 && res.json && res.json.conflict) {
        var disk = res.json.disk;
        var win = newer(disk, data);
        status.conflict = true;
        status.error = (win === disk)
          ? '另一台设备的进度更新，已采用较新的那份'
          : '另一台设备存过档，已用本机较新的记录覆盖';
        emit();
        if (win === disk) {
          writeLocal(disk);
          baseSavedAt = disk.savedAt || 0;
          if (window.Store && Store.adopt) Store.adopt(disk);
        } else {
          baseSavedAt = (disk && disk.savedAt) || 0;
          return remoteSave(data, true).then(function (r2) {
            if (r2.json && r2.json.ok) baseSavedAt = data.savedAt;
          });
        }
        return;
      }

      if (res.json && res.json.ok) {
        baseSavedAt = data.savedAt;
        status.error = null;
        status.conflict = false;
        status.offline = false;
        offlineQueued = false;
      } else {
        status.error = (res.json && res.json.error) || '保存失败';
      }
      emit();
    }).catch(function (e) {
      // 断网／超时：记录还在 localStorage 里，网恢复了自动补传
      status.saving = false;
      status.offline = true;
      offlineQueued = true;
      pending = data;
      status.error = '网络不通，记录先存在本机，联网后会自动补传';
      emit();
      scheduleRetry();
    });
  }

  /* 网络恢复就把攒着的推上去 */
  window.addEventListener('online', function () {
    if (offlineQueued && mode !== 'local') {
      status.offline = false; emit();
      flush();
    }
  });

  /* 光靠 online 事件不够：网还在、只是服务端连不上（或者孩子做完题就不动了），
     online 永远不会触发。所以再挂一个退避重试，30s → 60s → …… 最多 5 分钟。 */
  var retryTimer = null;
  var retryWait = 30000;
  function scheduleRetry() {
    if (retryTimer || mode === 'local') return;
    retryTimer = setTimeout(function () {
      retryTimer = null;
      if (!offlineQueued || !pending) return;
      flush().then(function () {
        if (offlineQueued) { retryWait = Math.min(retryWait * 2, 300000); scheduleRetry(); }
        else { retryWait = 30000; }
      });
    }, retryWait);
  }

  /* 关页面前尽量把没写完的推出去 */
  window.addEventListener('beforeunload', function () {
    if (mode === 'local' || !pending) return;
    try {
      var body = JSON.stringify(Object.assign({}, pending, { baseSavedAt: baseSavedAt }));
      if (mode === 'server') {
        navigator.sendBeacon('/api/save?profile=' + encodeURIComponent(profile) + '&force=1',
          new Blob([body], { type: 'application/json' }));
      } else {
        // sendBeacon 带不了自定义请求头，云端模式改用同步 keepalive
        fetch(endpoint('/api/save?profile=' + encodeURIComponent(profile) + '&force=1'), {
          method: 'POST', keepalive: true,
          headers: headers({ 'Content-Type': 'application/json' }),
          body: body
        });
      }
      pending = null;
    } catch (e) {}
  });

  /* ---------------- 配对码 ---------------- */

  /** 验一下这个配对码对不对，对就存下来并切到云端模式 */
  function pair(key) {
    var base = cloudURL();
    if (!base) return Promise.resolve({ ok: false, error: '还没配置云端存档地址' });
    return timeoutFetch(base + '/api/ping', { headers: { 'X-Camp-Key': encodeKey(key) } }, 9000)
      .then(function (r) {
        if (r.status === 401) return { ok: false, error: '配对码不对' };
        if (!r.ok) return { ok: false, error: '连不上云端存档（HTTP ' + r.status + '）' };
        setPairKey(key);
        status.needPair = false;
        status.error = null;
        return { ok: true };
      })
      .catch(function (e) {
        // 分清「码错了」和「网络到不了」—— 后者在部分地区是 DNS 被污染，
        // 用户改多少次配对码都没用，得直接说清楚
        var abort = e && (e.name === 'AbortError' || /abort/i.test(e.message || ''));
        return {
          ok: false,
          network: true,
          error: abort
            ? '连不上云端存档（超时）。这不是配对码的问题 —— 是这台设备的网络到不了存档服务器。换个网络（比如手机热点）试试，还不行就先用本地存档。'
            : '连不上云端存档：' + ((e && e.message) || e)
        };
      });
  }

  function unpair() {
    setPairKey('');
    status.needPair = true;
    emit();
  }

  window.Storage2 = {
    init: init, save: save, flush: flush, onChange: onChange,
    pair: pair, unpair: unpair,
    get hasPairKey() { return !!pairKey(); },
    get cloudConfigured() { return !!cloudURL(); },
    get mode() { return mode; },
    get status() { return status; },
    device: device,
    LS_KEY: LS_KEY
  };
})();
