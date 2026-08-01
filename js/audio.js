/* ============================================================
   audio.js —— 全部音效用 Web Audio 现场合成。
   零音频文件、零版权问题、零加载等待、断网照样响。
   ============================================================ */
(function () {
  'use strict';

  var ctx = null;
  var master = null;

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function on() {
    return !window.Store || !Store.state || Store.state.settings.sound !== false;
  }

  /* 单个音符 */
  function tone(freq, start, dur, type, vol, slideTo) {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + start;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    // 软起软落，避免爆音
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  /* 噪声（鼓、沙锤） */
  function noise(start, dur, vol, freq, q) {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + start;
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource(); src.buffer = buf;
    var bp = c.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = freq || 1400; bp.Q.value = q || 1;
    var g = c.createGain(); g.gain.value = vol || 0.2;
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0);
  }

  var SFX = {
    /* 答对：清亮的三度上行 */
    right: function () {
      tone(784, 0, 0.13, 'triangle', 0.26);
      tone(1047, 0.08, 0.22, 'triangle', 0.22);
    },
    /* 答错：低沉两声，不刺耳（别吓着孩子） */
    wrong: function () {
      tone(233, 0, 0.16, 'sine', 0.22);
      tone(185, 0.13, 0.26, 'sine', 0.18);
    },
    /* 金币 */
    coin: function () {
      tone(1319, 0, 0.07, 'square', 0.13);
      tone(1976, 0.06, 0.17, 'square', 0.11);
    },
    /* 连击：音高随 combo 上升 */
    combo: function (n) {
      var base = 660 * Math.pow(1.122, Math.min(n, 10));
      tone(base, 0, 0.1, 'triangle', 0.2);
      tone(base * 1.5, 0.07, 0.15, 'triangle', 0.16);
    },
    /* 升级号角：五声音阶上行 + 收尾长音 */
    levelup: function () {
      var seq = [523, 659, 784, 1047, 1319];
      seq.forEach(function (f, i) { tone(f, i * 0.1, 0.24, 'triangle', 0.26); });
      tone(1568, 0.52, 0.75, 'triangle', 0.22);
      tone(1047, 0.52, 0.75, 'sine', 0.14);
      noise(0.52, 0.5, 0.07, 2600, 0.7);
    },
    /* 开宝箱 */
    chest: function () {
      noise(0, 0.09, 0.16, 800, 1.4);
      [659, 784, 988, 1319].forEach(function (f, i) {
        tone(f, 0.1 + i * 0.07, 0.3, 'triangle', 0.2);
      });
    },
    /* 关卡通过 */
    stage: function () {
      [523, 784, 1047].forEach(function (f, i) { tone(f, i * 0.09, 0.3, 'triangle', 0.24); });
    },
    /* Boss 战鼓 */
    boss: function () {
      for (var i = 0; i < 4; i++) {
        tone(70, i * 0.17, 0.16, 'sine', 0.34, 46);
        noise(i * 0.17, 0.09, 0.12, 180, 0.8);
      }
    },
    /* 打中 Boss */
    hit: function () {
      noise(0, 0.11, 0.24, 320, 0.9);
      tone(150, 0, 0.13, 'square', 0.16, 70);
    },
    /* 盖章 */
    stamp: function () {
      noise(0, 0.07, 0.26, 420, 0.7);
      tone(110, 0.01, 0.1, 'sine', 0.2, 66);
    },
    /* 点击 */
    tap: function () { tone(880, 0, 0.045, 'sine', 0.1); },
    /* 全天通关：小段旋律 */
    finish: function () {
      var mel = [[523,0],[659,.13],[784,.26],[1047,.39],[784,.56],[1047,.69],[1319,.82]];
      mel.forEach(function (m) { tone(m[0], m[1], 0.34, 'triangle', 0.24); });
      tone(1568, 1.0, 1.0, 'triangle', 0.2);
      noise(1.0, 0.7, 0.07, 3000, 0.6);
    }
  };

  function play(name, arg) {
    if (!on()) return;
    try { (SFX[name] || function () {})(arg); } catch (e) { /* 静默 */ }
  }

  /* ============ 背景音乐（可选，需自备 music/bgm.mp3） ============ */
  var bgmEl = null;
  var bgmOK = false;

  function initBGM() {
    bgmEl = new Audio('music/bgm.mp3');
    bgmEl.loop = true;
    bgmEl.volume = 0.18;
    bgmEl.addEventListener('canplaythrough', function () { bgmOK = true; });
    bgmEl.addEventListener('error', function () { bgmOK = false; });
  }

  function bgmToggle(want) {
    if (!bgmEl) initBGM();
    var target = (want === undefined) ? !(Store.state.settings.bgm) : want;
    Store.setSetting('bgm', target);
    if (target) {
      bgmEl.play().catch(function () { /* 没有文件或未交互，忽略 */ });
    } else {
      bgmEl.pause();
    }
    return target;
  }

  function bgmAvailable() { return bgmOK; }

  /* 浏览器要求先有用户交互才能出声 */
  function unlock() {
    ac();
    if (Store.state.settings.bgm) bgmToggle(true);
  }

  window.SFX = {
    play: play, unlock: unlock,
    bgmToggle: bgmToggle, bgmAvailable: bgmAvailable
  };
})();
