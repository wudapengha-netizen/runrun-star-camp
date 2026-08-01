/* ============================================================
   fx.js —— 礼花 / 金币雨 / 飘分。自写 canvas 粒子，不依赖任何库。
   纸屑做成朱砂红 + 泥金的细长纸条，像真的中式礼花。
   ============================================================ */
(function () {
  'use strict';

  var cv = null, cx = null, parts = [], raf = null, dpr = 1;

  var PALETTE = ['#c8412f', '#c2952f', '#e8bc55', '#3f8574', '#35648f', '#cf8228', '#faf3e3'];

  function ensure() {
    if (cv) return;
    cv = document.getElementById('fxCanvas');
    if (!cv) {
      cv = document.createElement('canvas');
      cv.id = 'fxCanvas';
      document.body.appendChild(cv);
    }
    cx = cv.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!cv) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function motionOff() {
    return document.documentElement.dataset.motion === 'off';
  }

  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    var alive = 0;

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.life <= 0) continue;
      alive++;

      p.vy += p.g;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life--;

      var a = Math.min(1, p.life / 34);
      cx.save();
      cx.globalAlpha = a;
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.fillStyle = p.color;

      if (p.kind === 'strip') {
        // 纸条：翻转时宽度收缩，像真纸片
        var w = p.w * Math.abs(Math.cos(p.rot * 1.7));
        cx.fillRect(-w / 2, -p.h / 2, w, p.h);
      } else if (p.kind === 'coin') {
        var rw = p.r * Math.abs(Math.cos(p.rot * 2.2));
        cx.beginPath();
        cx.ellipse(0, 0, Math.max(1.2, rw), p.r, 0, 0, Math.PI * 2);
        cx.fill();
        cx.strokeStyle = '#96701c';
        cx.lineWidth = 1.4;
        cx.stroke();
      } else {
        cx.beginPath();
        cx.arc(0, 0, p.r, 0, Math.PI * 2);
        cx.fill();
      }
      cx.restore();
    }

    if (alive > 0) {
      raf = requestAnimationFrame(loop);
    } else {
      cx.clearRect(0, 0, innerWidth, innerHeight);
      parts = [];
      raf = null;
    }
  }

  function start() {
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* —— 礼花爆炸 —— */
  function burst(x, y, count) {
    ensure();
    if (motionOff()) return;
    count = count || 70;
    if (x === undefined) { x = innerWidth / 2; y = innerHeight * 0.42; }
    for (var i = 0; i < count; i++) {
      var ang = rnd(0, Math.PI * 2);
      var sp = rnd(4, 15);
      parts.push({
        kind: Math.random() < 0.72 ? 'strip' : 'dot',
        x: x, y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - rnd(1, 4),
        g: 0.28, drag: 0.982,
        rot: rnd(0, 6.28), vr: rnd(-0.28, 0.28),
        w: rnd(7, 14), h: rnd(3.5, 6.5), r: rnd(2.5, 4.5),
        color: PALETTE[(Math.random() * PALETTE.length) | 0],
        life: rnd(85, 140)
      });
    }
    start();
  }

  /* —— 全屏礼花（升级 / 通关）：多点连发 —— */
  function celebrate() {
    ensure();
    if (motionOff()) return;
    var shots = [
      [innerWidth * 0.5, innerHeight * 0.38, 110, 0],
      [innerWidth * 0.2, innerHeight * 0.45, 70, 220],
      [innerWidth * 0.8, innerHeight * 0.45, 70, 380],
      [innerWidth * 0.35, innerHeight * 0.3, 60, 620],
      [innerWidth * 0.68, innerHeight * 0.32, 60, 780]
    ];
    shots.forEach(function (s) {
      setTimeout(function () { burst(s[0], s[1], s[2]); }, s[3]);
    });
  }

  /* —— 金币雨 —— */
  function coins(count) {
    ensure();
    if (motionOff()) return;
    count = count || 34;
    for (var i = 0; i < count; i++) {
      parts.push({
        kind: 'coin',
        x: rnd(0, innerWidth),
        y: rnd(-260, -20),
        vx: rnd(-1.1, 1.1),
        vy: rnd(2.5, 6),
        g: 0.17, drag: 0.996,
        rot: rnd(0, 6.28), vr: rnd(0.12, 0.3),
        r: rnd(8, 13),
        color: Math.random() < 0.5 ? '#c2952f' : '#e8bc55',
        life: rnd(150, 230)
      });
    }
    start();
  }

  /* —— 答对飘分 —— */
  function floatScore(text, el) {
    if (motionOff()) return;
    var r = el && el.getBoundingClientRect
      ? el.getBoundingClientRect()
      : { left: innerWidth / 2, width: 0, top: innerHeight / 2 };
    var d = document.createElement('div');
    d.className = 'float-score';
    d.textContent = text;
    d.style.left = (r.left + r.width / 2) + 'px';
    d.style.top = r.top + 'px';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 1200);
  }

  /* —— combo 提示 —— */
  function comboTag(n) {
    if (motionOff()) return;
    var old = document.querySelector('.combo-tag');
    if (old) old.remove();
    var d = document.createElement('div');
    d.className = 'combo-tag';
    d.textContent = '连对 ' + n + ' 题！';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 1300);
  }

  window.FX = {
    burst: burst, celebrate: celebrate, coins: coins,
    floatScore: floatScore, comboTag: comboTag
  };
})();
