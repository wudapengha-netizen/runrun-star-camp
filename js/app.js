/* ============================================================
   app.js —— 启动、顶部 HUD、页面切换
   ============================================================ */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function boot() {
    var view = $('view');
    view.innerHTML = '<div class="wrap"><div class="empty"><div class="ic">📜</div>' +
                     '<h2>正在读取存档…</h2></div></div>';

    Store.boot((window.PROFILE && PROFILE.name) || 'default').then(started);
  }

  function started() {
    // 动效开关
    document.documentElement.dataset.motion =
      Store.state.settings.motion === false ? 'off' : 'on';

    buildHUD();
    refreshHUD();
    if (window.Storage2) {
      Storage2.onChange(paintSaveState);
      paintSaveState(Storage2.status);
    }
    go('map');

    // 配了云端存档、但这台设备还没配对 —— 直接把输入框弹出来，
    // 别让家长自己去猜那个小钥匙图标是干嘛的
    if (window.Storage2 && Storage2.cloudConfigured && Storage2.mode !== 'cloud') {
      setTimeout(showSaveInfo, 600);
    }

    // 第一次点击时解锁音频（浏览器要求）
    document.addEventListener('click', function once() {
      SFX.unlock();
      document.removeEventListener('click', once);
    }, { once: true });

    // 提醒没有中文语音的情况
    setTimeout(function () {
      if (!TTS.available()) {
        console.warn('没有检测到语音包，朗读功能不可用。');
      }
    }, 2500);
  }

  function buildHUD() {
    var hud = $('hud');
    var el = Quiz.el;

    var brand = el('div', 'hud-brand');
    var site = PROFILE.siteName || (PROFILE.name + '的闯关营');
    brand.innerHTML = (PROFILE.avatar || '🐯') + ' ' +
      Quiz.esc(site).replace(Quiz.esc(PROFILE.name), '<b>' + Quiz.esc(PROFILE.name) + '</b>');
    document.title = site + ' · 八月三十一关';
    brand.onclick = function () { go('map'); };
    hud.appendChild(brand);

    var seal = el('div', 'rank-seal');
    seal.id = 'hudRank';
    hud.appendChild(seal);

    var xp = el('div', 'xp-wrap');
    xp.innerHTML =
      '<div class="xp-label"><span id="xpTitle">经验</span><span id="xpNum" class="num"></span></div>' +
      '<div class="xp-bar"><div class="xp-fill" id="xpFill" style="width:0%"></div></div>';
    hud.appendChild(xp);

    var streak = el('div', 'hud-stat');
    streak.innerHTML = '<span class="ic">🔥</span><span id="hudStreak">0</span>';
    streak.title = '连续打卡天数';
    hud.appendChild(streak);

    hud.appendChild(el('div', 'hud-spacer'));

    // 音效
    var bSound = el('button', 'icon-btn');
    bSound.type = 'button'; bSound.id = 'btnSound'; bSound.title = '音效开关';
    bSound.onclick = function () {
      var v = !Store.state.settings.sound;
      Store.setSetting('sound', v);
      SFX.unlock();
      if (v) SFX.play('coin');
      paintToggles();
    };
    hud.appendChild(bSound);

    // 背景音乐
    var bBgm = el('button', 'icon-btn');
    bBgm.type = 'button'; bBgm.id = 'btnBgm'; bBgm.title = '背景音乐（需要把 bgm.mp3 放进 music 文件夹）';
    bBgm.onclick = function () { SFX.bgmToggle(); paintToggles(); };
    hud.appendChild(bBgm);

    // 动效
    var bMotion = el('button', 'icon-btn');
    bMotion.type = 'button'; bMotion.id = 'btnMotion'; bMotion.title = '动画特效开关';
    bMotion.onclick = function () {
      Store.setSetting('motion', !Store.state.settings.motion);
      paintToggles();
    };
    hud.appendChild(bMotion);

    // 存档状态灯
    var bSave = el('button', 'icon-btn');
    bSave.type = 'button'; bSave.id = 'btnSave';
    bSave.onclick = function () { showSaveInfo(); };
    hud.appendChild(bSave);

    // 家长端
    var bParent = el('button', 'icon-btn', '👨‍👩‍👦');
    bParent.type = 'button'; bParent.title = '家长端 · 学习报告';
    bParent.onclick = function () { location.href = 'parent.html'; };
    hud.appendChild(bParent);

    paintToggles();
  }

  /* 存档状态灯：☁️云端 / 🗄️本地文件 / 📌只在这个浏览器 / ⚠️有问题 */
  function paintSaveState(st) {
    var b = $('btnSave');
    if (!b) return;
    if (st.offline) {
      b.textContent = '📴';
      b.title = '网络不通，记录先存在本机，联网后自动补传。点看详情';
      b.style.borderColor = 'var(--gold-deep)';
    } else if (st.error) {
      b.textContent = '⚠️';
      b.title = '存档提醒：' + st.error;
      b.style.borderColor = 'var(--cinnabar)';
    } else if (st.mode === 'cloud') {
      b.textContent = st.saving ? '💾' : '☁️';
      b.title = '记录存在云端，任何设备打开都是最新进度。点看详情';
      b.style.borderColor = 'var(--jade)';
    } else if (st.mode === 'server') {
      b.textContent = st.saving ? '💾' : '🗄️';
      b.title = '记录已存成文件（save/' + PROFILE.name + '.json），换电脑可以带走。点看详情';
      b.style.borderColor = 'var(--grass)';
    } else if (st.needPair) {
      b.textContent = '🔑';
      b.title = '这台设备还没输配对码，连不上云端记录。点这里输入';
      b.style.borderColor = 'var(--cinnabar)';
    } else {
      b.textContent = '📌';
      b.title = '记录只存在这个浏览器里，换设备带不走。点看怎么改';
      b.style.borderColor = 'var(--gold-deep)';
    }
  }

  /* 配对码输入 */
  function pairForm(box, mask) {
    var el2 = Quiz.el;
    var wrap = el2('div');
    wrap.style.cssText = 'margin-top:14px;padding-top:14px;border-top:2px solid var(--paper-edge)';
    wrap.innerHTML = '<b style="font-family:var(--font-brush);font-size:18px">输入配对码</b>' +
      '<div class="q-sub" style="margin:4px 0 10px">' +
      '配对码是你部署云端存档时自己设的那串字。' +
      '一台设备只用输一次，之后就记住了。</div>';

    var row = el2('div');
    row.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;align-items:center';
    var inp = el2('input', 'input');
    inp.type = 'password';
    inp.placeholder = '配对码';
    inp.style.cssText = 'flex:1;min-width:200px;font-family:var(--font-body);font-size:17px';
    var btn = el2('button', 'btn btn-sm btn-primary', '连接');
    btn.type = 'button';
    var msg = el2('div', 'q-sub');
    msg.style.cssText = 'width:100%;margin-top:8px';

    function go() {
      var k = inp.value.trim();
      if (!k) return;
      btn.disabled = true; btn.textContent = '连接中…';
      msg.textContent = '';
      Storage2.pair(k).then(function (r) {
        btn.disabled = false; btn.textContent = '连接';
        if (r.ok) {
          msg.innerHTML = '<b style="color:var(--grass)">✅ 连上了！正在同步进度…</b>';
          SFX.play('stage');
          setTimeout(function () { location.reload(); }, 900);
        } else {
          msg.innerHTML = '<b style="color:var(--cinnabar)">❌ ' + Quiz.esc(r.error) + '</b>';
          SFX.play('wrong');
        }
      });
    }
    btn.onclick = go;
    inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };

    row.appendChild(inp); row.appendChild(btn);
    wrap.appendChild(row); wrap.appendChild(msg);
    box.appendChild(wrap);
    setTimeout(function () { inp.focus(); }, 80);
  }

  function showSaveInfo() {
    var st = window.Storage2 ? Storage2.status : { mode: 'local' };
    var el2 = Quiz.el;
    var mask = el2('div', 'hz-modal');
    var box = el2('div', 'hz-box');
    box.style.cssText += 'max-width:560px;text-align:left';

    var html = '<h2 style="margin-bottom:12px">存档状态</h2>';
    if (st.mode === 'cloud') {
      html +=
        '<p style="color:var(--jade);font-weight:700">☁️ 云端存档已开启</p>' +
        '<p>进度存在云端，<b>任何电脑、平板、手机打开网址都是最新的</b>，不用再拷文件。</p>' +
        '<p style="color:var(--ink-soft);font-size:15px">断网也能继续做题 —— 记录先存在本机，' +
        '联网后自动补传。两台设备同时用的话，系统会比时间戳保留较新的那份并给你提示。</p>';
    } else if (st.mode === 'server') {
      html +=
        '<p style="color:var(--grass);font-weight:700">✅ 文件存档已开启</p>' +
        '<p>学习记录正在写入 <b>save/' + Quiz.esc(PROFILE.name) + '.json</b>，' +
        '每次保存前还会自动备份一份到 save/backup/。</p>' +
        '<p>把整个 <b>study</b> 文件夹放进云盘同步目录（OneDrive／坚果云／百度网盘同步版），' +
        '另一台电脑装同一个云盘、同样双击 <b>start.bat</b>，记录就自动跟过去了。</p>' +
        '<p style="color:var(--ink-soft);font-size:15px">⚠️ 别两台电脑同时用 —— ' +
        '云盘来不及同步会产生冲突副本。系统会比时间戳保留较新的一份，但还是错开用最稳妥。</p>';
    } else {
      html +=
        '<p style="color:var(--gold-deep);font-weight:700">📌 目前只存在这个浏览器里</p>' +
        '<p>你是直接双击 index.html 打开的。这样记录存在 Chrome 的本地存储里：' +
        '<b>换电脑带不走，清理浏览器缓存会丢</b>。</p>' +
        '<p><b>想跨电脑用，改成双击 <span class="key">start.bat</span> 打开</b>就行 —— ' +
        '记录会变成 save/ 文件夹里的真文件，把整个 study 文件夹放进云盘就自动同步了。' +
        '现在的记录不会丢，切过去时会自动带过去。</p>';
    }
    if (st.offline) {
      html += '<p style="color:var(--gold-deep)">📴 现在连不上网。做的题都存在本机，' +
              '等网络恢复会自动补传上去，不会丢。</p>';
    } else if (st.error) {
      html += '<p style="color:var(--cinnabar)">⚠️ ' + Quiz.esc(st.error) + '</p>';
    }
    box.innerHTML = html;

    // 配了云端但这台设备还没配对 → 直接给输入框
    if (window.Storage2 && Storage2.cloudConfigured && st.mode !== 'cloud') {
      pairForm(box, mask);
    }

    var bar = el2('div');
    bar.style.cssText = 'display:flex;gap:10px;margin-top:16px;justify-content:flex-end';
    var toParent = el2('button', 'btn btn-sm btn-ghost', '去家长端备份');
    toParent.type = 'button';
    toParent.onclick = function () { location.href = 'parent.html'; };
    var close = el2('button', 'btn btn-sm', '知道了');
    close.type = 'button';
    close.onclick = function () { mask.remove(); };
    bar.appendChild(toParent); bar.appendChild(close);
    box.appendChild(bar);

    mask.appendChild(box);
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
    document.body.appendChild(mask);
  }

  function paintToggles() {
    var s = Store.state.settings;
    var bs = $('btnSound'), bb = $('btnBgm'), bm = $('btnMotion');
    if (bs) { bs.textContent = s.sound ? '🔊' : '🔇'; bs.classList.toggle('off', !s.sound); }
    if (bb) { bb.textContent = '🎵'; bb.classList.toggle('off', !s.bgm); }
    if (bm) { bm.textContent = '✨'; bm.classList.toggle('off', !s.motion); }
  }

  function refreshHUD() {
    var lv = Store.level();
    var r = $('hudRank'); if (r) r.textContent = lv.title;
    var t = $('xpTitle');
    if (t) t.textContent = lv.next ? '距「' + lv.next.title + '」' : '已满级';
    var n = $('xpNum');
    if (n) n.textContent = lv.next ? (lv.into + ' / ' + lv.span) : Store.state.xp + ' XP';
    var f = $('xpFill'); if (f) f.style.width = lv.pct + '%';
    var s = $('hudStreak'); if (s) s.textContent = Store.state.streak;
    paintToggles();
  }

  function go(where, arg) {
    TTS.stop();
    if (where === 'map') return MapView.render();
    if (where === 'day') return Day.open(arg);
  }

  window.App = { boot: boot, go: go, refreshHUD: refreshHUD, saveInfo: showSaveInfo };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
