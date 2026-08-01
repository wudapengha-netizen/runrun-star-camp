/* ============================================================
   hanzi.js —— 汉字笔顺动画 + 描红跟写
   笔顺数据预打包在 vendor/hanzi-data.js（window.HANZI_DATA），
   通过 charDataLoader 从内存拿，所以 file:// 双击打开也能用。
   ============================================================ */
(function () {
  'use strict';

  function has(ch) {
    return !!(window.HANZI_DATA && window.HANZI_DATA[ch]);
  }

  function loader(char, onComplete, onError) {
    var d = window.HANZI_DATA && window.HANZI_DATA[char];
    if (d) onComplete(d);
    else if (onError) onError(new Error('没有「' + char + '」的笔顺数据'));
  }

  var COLORS = {
    stroke: '#2b2621',
    radical: '#c8412f',
    outline: '#ddc9a3',
    highlight: '#c2952f',
    drawing: '#3f8574'
  };

  /**
   * 打开笔顺弹窗
   * @param {string} ch 汉字
   * @param {object} info { py, words } 拼音和组词，用于显示
   */
  function open(ch, info) {
    info = info || {};
    var el = Quiz.el, esc = Quiz.esc;

    if (!window.HanziWriter) { alert('笔顺组件没加载成功'); return; }

    var mask = el('div', 'hz-modal');
    var box = el('div', 'hz-box');

    // 标题
    var head = el('div');
    head.style.cssText = 'margin-bottom:14px';
    head.innerHTML =
      '<div style="font-size:16px;color:var(--cinnabar);font-weight:700;letter-spacing:.1em">' +
      esc(info.py || '') + '</div>' +
      '<div style="font-family:var(--font-brush);font-size:38px;line-height:1.2">' + esc(ch) + '</div>' +
      (info.words ? '<div style="font-size:15px;color:var(--ink-soft)">' + esc(info.words) + '</div>' : '');
    box.appendChild(head);

    var target = el('div', 'hz-target');
    target.id = 'hzTarget_' + Date.now();
    box.appendChild(target);

    var tip = el('div', 'q-sub');
    tip.style.cssText = 'margin:12px 0 4px;min-height:24px';
    box.appendChild(tip);

    var bar = el('div');
    bar.style.cssText = 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:6px';

    var btnPlay = el('button', 'btn btn-sm', '▶ 看笔顺');
    var btnSlow = el('button', 'btn btn-sm btn-ghost', '🐢 慢放');
    var btnWrite = el('button', 'btn btn-sm btn-gold', '✍ 我来写');
    var btnSpeak = el('button', 'btn btn-sm btn-ghost', '🔊 读一读');
    var btnClose = el('button', 'btn btn-sm btn-ghost', '关闭');
    [btnPlay, btnSlow, btnWrite, btnSpeak, btnClose].forEach(function (b) { b.type = 'button'; bar.appendChild(b); });
    box.appendChild(bar);

    mask.appendChild(box);
    document.body.appendChild(mask);

    if (!has(ch)) {
      tip.innerHTML = '⚠️ 这个字暂时没有笔顺数据，先看字形吧。';
      btnPlay.disabled = btnSlow.disabled = btnWrite.disabled = true;
    }

    var writer = null;
    if (has(ch)) {
      writer = window.HanziWriter.create(target.id, ch, {
        width: 240, height: 240, padding: 8,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 240,
        strokeColor: COLORS.stroke,
        outlineColor: COLORS.outline,
        highlightColor: COLORS.highlight,
        drawingColor: COLORS.drawing,
        drawingWidth: 22,
        charDataLoader: loader
      });
      setTimeout(function () { writer.animateCharacter(); }, 260);
    }

    btnPlay.onclick = function () {
      SFX.play('tap');
      tip.textContent = '';
      writer.setOptions({ strokeAnimationSpeed: 1, delayBetweenStrokes: 240 });
      writer.animateCharacter();
    };
    btnSlow.onclick = function () {
      SFX.play('tap');
      tip.textContent = '一笔一画慢慢看，注意起笔的位置';
      writer.setOptions({ strokeAnimationSpeed: 0.35, delayBetweenStrokes: 700 });
      writer.animateCharacter();
    };
    btnSpeak.onclick = function () {
      TTS.speak(ch + '，' + (info.words || '').split(/[、，]/)[0], { lang: 'zh' });
    };
    btnWrite.onclick = function () {
      SFX.play('tap');
      tip.innerHTML = '按住鼠标，沿着笔画描一遍 →';
      var total = 0, done = 0;
      writer.quiz({
        showHintAfterMisses: 2,
        onCorrectStroke: function (d) {
          done = d.strokeNum + 1;
          total = d.totalMistakes !== undefined ? total : total;
          SFX.play('right');
          tip.innerHTML = '✅ 第 ' + done + ' 笔写对了！';
        },
        onMistake: function () {
          SFX.play('wrong');
          tip.innerHTML = '❌ 这一笔起笔的位置不太对，再试试';
        },
        onComplete: function (d) {
          SFX.play('stage');
          FX.burst(innerWidth / 2, innerHeight / 2, 55);
          tip.innerHTML = '🎉 写对了！一共 ' + d.totalMistakes + ' 次小失误';
        }
      });
    };

    function close() {
      TTS.stop();
      mask.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    btnClose.onclick = close;
    mask.onclick = function (e) { if (e.target === mask) close(); };
    document.addEventListener('keydown', onKey);
  }

  /**
   * 渲染一组生字卡（点击弹笔顺）
   * @param {Array} list [{zi, py, words}]
   */
  function cards(list) {
    var el = Quiz.el, esc = Quiz.esc;
    var grid = el('div', 'hanzi-grid');
    list.forEach(function (it) {
      var c = el('div', 'hanzi-card');
      c.innerHTML =
        '<div class="py">' + esc(it.py) + '</div>' +
        '<div class="zi">' + esc(it.zi) + '</div>' +
        '<div class="wd">' + esc(it.words || '') + '</div>';
      c.onclick = function () { SFX.play('tap'); open(it.zi, it); };
      c.title = '点一点看笔顺';
      grid.appendChild(c);
    });
    return grid;
  }

  window.Hanzi = { open: open, cards: cards, has: has };
})();
