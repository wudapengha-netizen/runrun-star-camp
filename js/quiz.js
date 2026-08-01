/* ============================================================
   quiz.js —— 题型引擎。所有题型走同一套渲染 + 判分分发。
   题目统一结构：{ id, type, q, sub, options, answer, explain, tags, subject }
   ============================================================ */
(function () {
  'use strict';

  var KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html !== undefined) d.innerHTML = html;
    return d;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* 富文本：先整体转义，再放行一小撮排版标签。
     这样题目文案里可以写 <b> <br> <span class="key"> 来强调重点，又不怕注入。 */
  function rich(s) {
    return esc(s)
      .replace(/&lt;(\/?)(b|i|u|small|sup|sub)&gt;/g, '<$1$2>')
      .replace(/&lt;br\s*\/?&gt;/g, '<br>')
      .replace(/&lt;span class="(key|hl|blank|num)"&gt;/g, '<span class="$1">')
      .replace(/&lt;\/span&gt;/g, '</span>');
  }

  /* 题干里的 ___ 渲染成下划线空格 */
  function qHTML(s) {
    return rich(s).replace(/_{2,}/g, '<span class="blank">　　</span>');
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function normalize(s) {
    return String(s == null ? '' : s)
      .replace(/\s/g, '')
      .replace(/[，。！？；：、""''（）]/g, function (c) {
        return { '，': ',', '。': '.', '！': '!', '？': '?', '；': ';', '：': ':' }[c] || '';
      })
      .toLowerCase();
  }

  /* ============================================================
     渲染：每个 type 返回 { node, getAnswer, showResult }
     ============================================================ */

  var RENDER = {

    /* —— 单选 —— */
    choice: function (q) {
      var wrap = el('div');
      var cols = q.options.every(function (o) { return String(o).length <= 8; }) && q.options.length === 4;
      var box = el('div', 'opts' + (cols ? ' cols-2' : ''));
      var picked = null, locked = false;

      q.options.forEach(function (opt, i) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.appendChild(el('span', 'key', KEYS[i]));
        b.appendChild(el('span', '', rich(opt)));
        b.onclick = function () {
          if (locked) return;
          picked = i;
          box.querySelectorAll('.opt').forEach(function (n) { n.classList.remove('picked'); });
          b.classList.add('picked');
          SFX.play('tap');
          wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
        };
        box.appendChild(b);
      });
      wrap.appendChild(box);

      return {
        node: wrap,
        getAnswer: function () { return picked; },
        isReady: function () { return picked !== null; },
        showResult: function (ok) {
          locked = true;
          var nodes = box.querySelectorAll('.opt');
          nodes.forEach(function (n) { n.classList.add('locked'); });
          if (picked !== null) nodes[picked].classList.add(ok ? 'right' : 'wrong');
          if (!ok) nodes[q.answer].classList.add('right');
        }
      };
    },

    /* —— 多选 —— */
    multi: function (q) {
      var wrap = el('div');
      var box = el('div', 'opts');
      var picked = [], locked = false;

      q.options.forEach(function (opt, i) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.appendChild(el('span', 'key', KEYS[i]));
        b.appendChild(el('span', '', rich(opt)));
        b.onclick = function () {
          if (locked) return;
          var k = picked.indexOf(i);
          if (k >= 0) { picked.splice(k, 1); b.classList.remove('picked'); }
          else { picked.push(i); b.classList.add('picked'); }
          SFX.play('tap');
          wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
        };
        box.appendChild(b);
      });
      wrap.appendChild(box);
      wrap.appendChild(el('div', 'q-sub', '（多选题，可以选好几个）'));

      return {
        node: wrap,
        getAnswer: function () { return picked.slice().sort(); },
        isReady: function () { return picked.length > 0; },
        showResult: function (ok) {
          locked = true;
          var nodes = box.querySelectorAll('.opt');
          nodes.forEach(function (n, i) {
            n.classList.add('locked');
            var should = q.answer.indexOf(i) >= 0;
            var did = picked.indexOf(i) >= 0;
            if (should) n.classList.add('right');
            else if (did) n.classList.add('wrong');
          });
        }
      };
    },

    /* —— 判断对错 —— */
    tf: function (q) {
      var qq = Object.assign({}, q, { options: ['对 ✓', '错 ✗'], answer: q.answer ? 0 : 1 });
      var r = RENDER.choice(qq);
      r._mapped = qq;
      return r;
    },

    /* —— 填空（输入） —— */
    fill: function (q) {
      var wrap = el('div');
      var n = q.blanks || 1;
      var row = el('div');
      row.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;align-items:center';
      var inputs = [];
      for (var i = 0; i < n; i++) {
        var inp = el('input', 'input');
        inp.type = 'text';
        inp.autocomplete = 'off';
        inp.style.width = (q.wide ? 260 : 130) + 'px';
        if (n > 1) {
          var lab = el('span', '', '(' + (i + 1) + ')');
          lab.style.cssText = 'font-weight:700;color:var(--ink-soft)';
          row.appendChild(lab);
        }
        row.appendChild(inp);
        inputs.push(inp);
      }
      wrap.appendChild(row);
      if (q.hint) wrap.appendChild(el('div', 'q-sub', '提示：' + esc(q.hint)));

      inputs.forEach(function (inp) {
        inp.addEventListener('input', function () {
          wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
        });
      });
      setTimeout(function () { inputs[0] && inputs[0].focus(); }, 60);

      return {
        node: wrap,
        getAnswer: function () { return inputs.map(function (i) { return i.value; }); },
        isReady: function () { return inputs.some(function (i) { return i.value.trim(); }); },
        showResult: function (ok, detail) {
          inputs.forEach(function (inp, i) {
            inp.disabled = true;
            var good = detail && detail.each ? detail.each[i] : ok;
            inp.style.borderColor = good ? 'var(--grass)' : 'var(--cinnabar)';
            inp.style.background = good ? 'var(--grass-wash)' : 'var(--cinnabar-wash)';
          });
        }
      };
    },

    /* —— 看拼音写词语（本质是 fill，但用田字格） —— */
    pinyin: function (q) {
      var wrap = el('div');
      var row = el('div');
      row.style.cssText = 'display:flex;flex-wrap:wrap;gap:22px';
      var groups = [];

      q.items.forEach(function (it) {
        var g = el('div');
        g.style.cssText = 'text-align:center';
        var py = el('div', '', esc(it.py));
        py.style.cssText = 'font-weight:700;color:var(--cinnabar);letter-spacing:.12em;margin-bottom:6px;font-size:16px';
        g.appendChild(py);
        var cells = el('div');
        cells.style.cssText = 'display:flex;gap:5px';
        var ins = [];
        for (var i = 0; i < it.word.length; i++) {
          var inp = el('input', 'input input-tian');
          inp.type = 'text';
          inp.maxLength = 1;
          inp.autocomplete = 'off';
          (function (inp, idx) {
            inp.addEventListener('input', function () {
              if (inp.value && ins[idx + 1]) ins[idx + 1].focus();
              wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
            });
          })(inp, i);
          cells.appendChild(inp);
          ins.push(inp);
        }
        g.appendChild(cells);
        row.appendChild(g);
        groups.push({ word: it.word, ins: ins });
      });
      wrap.appendChild(row);
      setTimeout(function () { groups[0] && groups[0].ins[0].focus(); }, 60);

      return {
        node: wrap,
        getAnswer: function () {
          return groups.map(function (g) {
            return g.ins.map(function (i) { return i.value; }).join('');
          });
        },
        isReady: function () {
          return groups.some(function (g) { return g.ins.some(function (i) { return i.value.trim(); }); });
        },
        showResult: function (ok, detail) {
          groups.forEach(function (g, gi) {
            var good = detail && detail.each ? detail.each[gi] : ok;
            g.ins.forEach(function (inp, ci) {
              inp.disabled = true;
              var right = inp.value === g.word[ci];
              inp.style.borderColor = right ? 'var(--grass)' : 'var(--cinnabar)';
              inp.style.background = right ? 'var(--grass-wash)' : 'var(--cinnabar-wash)';
              if (!right) inp.value = g.word[ci];
            });
          });
        }
      };
    },

    /* —— 连线配对 —— */
    match: function (q) {
      var wrap = el('div', 'match-wrap');
      var left = el('div', 'match-col');
      var right = el('div', 'match-col');
      var L = q.pairs.map(function (p, i) { return { t: p[0], i: i }; });
      var R = shuffle(q.pairs.map(function (p, i) { return { t: p[1], i: i }; }));
      var sel = null, made = {}, locked = false;

      function mk(item, side, col) {
        var b = el('button', 'match-item');
        b.type = 'button';
        b.textContent = item.t;
        b.dataset.i = item.i;
        b.onclick = function () {
          if (locked || b.classList.contains('matched')) return;
          SFX.play('tap');
          if (!sel) {
            sel = { side: side, i: item.i, node: b };
            b.classList.add('sel');
            return;
          }
          if (sel.side === side) {
            sel.node.classList.remove('sel');
            sel = { side: side, i: item.i, node: b };
            b.classList.add('sel');
            return;
          }
          // 配上了
          made[Math.min(sel.i, item.i) + '|' + Math.max(sel.i, item.i)] =
            (sel.i === item.i);
          sel.node.classList.remove('sel');
          sel.node.classList.add('matched');
          b.classList.add('matched');
          made[sel.side === 'L' ? sel.i : item.i] = (sel.i === item.i);
          sel = null;
          wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
        };
        col.appendChild(b);
      }
      L.forEach(function (x) { mk(x, 'L', left); });
      R.forEach(function (x) { mk(x, 'R', right); });
      wrap.appendChild(left);
      wrap.appendChild(right);

      return {
        node: wrap,
        getAnswer: function () { return made; },
        isReady: function () {
          return wrap.querySelectorAll('.match-item.matched').length === q.pairs.length * 2;
        },
        showResult: function () {
          locked = true;
          // 展示正确配对
          var ans = el('div', 'q-sub');
          ans.style.gridColumn = '1 / -1';
          ans.innerHTML = '正确配对：' + q.pairs.map(function (p) {
            return esc(p[0]) + ' — ' + esc(p[1]);
          }).join('　｜　');
          wrap.appendChild(ans);
        }
      };
    },

    /* —— 排序（古诗句 / 计算步骤 / 连词成句） —— */
    order: function (q) {
      var wrap = el('div');
      var slot = el('div', 'order-slot');
      var pool = el('div', 'order-pool');
      var chosen = [];

      shuffle(q.items).forEach(function (t) {
        var c = el('button', 'chip');
        c.type = 'button';
        c.textContent = t;
        c.onclick = function () {
          SFX.play('tap');
          if (c.parentNode === pool) { slot.appendChild(c); chosen.push(t); }
          else { pool.appendChild(c); chosen.splice(chosen.indexOf(t), 1); }
          wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
        };
        pool.appendChild(c);
      });

      wrap.appendChild(el('div', 'q-sub', '点一点，按正确顺序排到下面的框里'));
      wrap.appendChild(slot);
      wrap.appendChild(el('div', 'q-sub', '↑ 排这里　　↓ 备选'));
      wrap.appendChild(pool);

      return {
        node: wrap,
        getAnswer: function () {
          return Array.prototype.map.call(slot.querySelectorAll('.chip'), function (c) {
            return c.textContent;
          });
        },
        isReady: function () { return slot.querySelectorAll('.chip').length === q.items.length; },
        showResult: function (ok) {
          wrap.querySelectorAll('.chip').forEach(function (c) { c.onclick = null; c.style.cursor = 'default'; });
          if (!ok) {
            var a = el('div', 'q-sub');
            a.innerHTML = '<b>正确顺序：</b>' + esc(q.answer.join(q.joiner || ' '));
            wrap.appendChild(a);
          }
        }
      };
    },

    /* —— 听音选词（英语听力核心） —— */
    listen: function (q) {
      var wrap = el('div');
      var bar = el('div');
      bar.style.cssText = 'text-align:center;margin-bottom:20px';
      var btn = el('button', 'listen-btn');
      btn.type = 'button';
      btn.innerHTML = '<span>🔊</span><span>点我听 (听两遍)</span>';
      var played = 0;
      btn.onclick = function () {
        if (btn.classList.contains('playing')) return;
        btn.classList.add('playing');
        played++;
        TTS.speakTwice(q.audio, {
          lang: q.lang || 'en',
          onend: function () { btn.classList.remove('playing'); }
        });
      };
      bar.appendChild(btn);
      if (!TTS.available()) {
        bar.appendChild(el('div', 'q-sub', '⚠️ 这台电脑没装语音包，题目文字是：' + esc(q.audio)));
      }
      wrap.appendChild(bar);

      var inner = RENDER.choice(q);
      wrap.appendChild(inner.node);

      // 自动播一遍
      setTimeout(function () { if (TTS.available()) btn.click(); }, 380);

      return {
        node: wrap,
        getAnswer: inner.getAnswer,
        isReady: inner.isReady,
        showResult: function (ok) {
          inner.showResult(ok);
          btn.disabled = true;
          wrap.appendChild(el('div', 'q-sub', '刚才听到的是：<b>' + esc(q.audio) + '</b>'));
        }
      };
    },

    /* —— 挖空背诵 —— */
    recite: function (q) {
      var wrap = el('div');
      var box = el('div', 'recite');
      var holes = [];
      // text 里用 {字} 标出要挖的空
      var parts = q.text.split(/(\{[^}]+\})/);
      parts.forEach(function (p) {
        if (/^\{.+\}$/.test(p)) {
          var word = p.slice(1, -1);
          var inp = el('input');
          inp.type = 'text';
          inp.maxLength = word.length;
          inp.style.cssText =
            'width:' + (word.length * 1.25) + 'em;font-family:var(--font-brush);font-size:27px;' +
            'text-align:center;border:0;border-bottom:3.5px solid var(--cinnabar);' +
            'background:transparent;color:var(--ink);outline:none;';
          inp.addEventListener('input', function () {
            wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
          });
          box.appendChild(inp);
          holes.push({ word: word, inp: inp });
        } else if (p) {
          box.appendChild(document.createTextNode(p));
        }
      });
      wrap.appendChild(box);

      var tools = el('div');
      tools.style.cssText = 'text-align:center;margin-top:14px';
      var listen = el('button', 'btn btn-sm btn-ghost', '🔊 听一遍');
      listen.type = 'button';
      listen.onclick = function () {
        TTS.speak(q.text.replace(/[{}]/g, ''), { lang: 'zh' });
      };
      tools.appendChild(listen);
      wrap.appendChild(tools);
      setTimeout(function () { holes[0] && holes[0].inp.focus(); }, 60);

      return {
        node: wrap,
        getAnswer: function () { return holes.map(function (h) { return h.inp.value; }); },
        isReady: function () { return holes.some(function (h) { return h.inp.value.trim(); }); },
        showResult: function (ok, detail) {
          holes.forEach(function (h, i) {
            h.inp.disabled = true;
            var good = detail && detail.each ? detail.each[i] : ok;
            h.inp.style.borderBottomColor = good ? 'var(--grass)' : 'var(--cinnabar)';
            if (!good) { h.inp.value = h.word; h.inp.style.color = 'var(--cinnabar)'; }
          });
        }
      };
    },

    /* —— 竖式计算（多位数乘一位数） —— */
    vertical: function (q) {
      var wrap = el('div');
      var a = String(q.a), b = String(q.b);
      var product = String(q.a * q.b);
      var width = product.length;

      var box = el('div', 'vert-calc');
      // 被乘数
      var r1 = el('div', 'row');
      r1.innerHTML = pad(a, width).map(function (ch) {
        return '<span class="cell">' + (ch === ' ' ? '' : ch) + '</span>';
      }).join('');
      // 乘数
      var r2 = el('div', 'row');
      r2.innerHTML = '<span class="op">×</span>' + pad(b, width).map(function (ch) {
        return '<span class="cell">' + (ch === ' ' ? '' : ch) + '</span>';
      }).join('');
      var line = el('div', 'line');
      // 结果输入
      var r3 = el('div', 'row');
      var ins = [];
      for (var i = 0; i < width; i++) {
        var inp = el('input');
        inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 1;
        r3.appendChild(inp); ins.push(inp);
      }
      // 从个位往前填更符合竖式习惯
      ins.forEach(function (inp, i) {
        inp.addEventListener('input', function () {
          if (inp.value && i > 0) ins[i - 1].focus();
          wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !inp.value && ins[i + 1]) ins[i + 1].focus();
        });
      });

      box.appendChild(r1); box.appendChild(r2); box.appendChild(line); box.appendChild(r3);
      wrap.appendChild(box);
      wrap.appendChild(el('div', 'q-sub', '从个位起，用一位数依次去乘多位数的每一位。满几十就向前一位进几。'));
      setTimeout(function () { ins[ins.length - 1] && ins[ins.length - 1].focus(); }, 60);

      function pad(s, w) {
        var out = [];
        for (var i = 0; i < w - s.length; i++) out.push(' ');
        return out.concat(s.split(''));
      }

      return {
        node: wrap,
        getAnswer: function () { return ins.map(function (i) { return i.value.trim(); }).join(''); },
        isReady: function () { return ins.every(function (i) { return i.value.trim(); }); },
        showResult: function (ok) {
          ins.forEach(function (inp, i) {
            inp.disabled = true;
            var right = inp.value === product[i];
            inp.style.borderColor = right ? 'var(--grass)' : 'var(--cinnabar)';
            inp.style.background = right ? 'var(--grass-wash)' : 'var(--cinnabar-wash)';
            if (!right) inp.value = product[i];
          });
        }
      };
    },

    /* —— 阅读理解：一段文 + 若干小题 —— */
    passage: function (q) {
      var wrap = el('div');
      var p = el('div', 'passage');
      p.style.cssText += 'margin-bottom:20px;max-height:none';
      p.innerHTML = q.passage.split('\n').map(function (line) {
        return '<div>' + esc(line) + '</div>';
      }).join('');
      wrap.appendChild(p);

      var tools = el('div');
      tools.style.cssText = 'margin:-8px 0 18px';
      var rd = el('button', 'btn btn-sm btn-ghost', '🔊 读给我听');
      rd.type = 'button';
      rd.onclick = function () { TTS.speak(q.passage, { lang: q.lang || 'zh' }); };
      tools.appendChild(rd);
      wrap.appendChild(tools);

      var inner = RENDER.choice(q);
      wrap.appendChild(inner.node);
      return {
        node: wrap,
        getAnswer: inner.getAnswer,
        isReady: inner.isReady,
        showResult: inner.showResult
      };
    },

    /* —— 朗读跟读：孩子自评 —— */
    readaloud: function (q) {
      var wrap = el('div');
      var p = el('div', 'passage');
      p.style.cssText += 'text-align:center;text-indent:0';
      p.textContent = q.text;
      wrap.appendChild(p);

      var tools = el('div');
      tools.style.cssText = 'text-align:center;margin:18px 0';
      var demo = el('button', 'listen-btn');
      demo.type = 'button';
      demo.innerHTML = '<span>🔊</span><span>听老师读一遍</span>';
      demo.onclick = function () {
        demo.classList.add('playing');
        TTS.speak(q.text, {
          lang: q.lang || 'zh',
          onend: function () { demo.classList.remove('playing'); }
        });
      };
      tools.appendChild(demo);
      wrap.appendChild(tools);

      var self = el('div', 'opts cols-2');
      var picked = null;
      [['很流利，一次就读对了', 2], ['读下来了，有几个字卡了一下', 1]].forEach(function (o, i) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.appendChild(el('span', 'key', KEYS[i]));
        b.appendChild(el('span', '', o[0]));
        b.onclick = function () {
          picked = i;
          self.querySelectorAll('.opt').forEach(function (n) { n.classList.remove('picked'); });
          b.classList.add('picked');
          SFX.play('tap');
          wrap.dispatchEvent(new CustomEvent('pick', { bubbles: true }));
        };
        self.appendChild(b);
      });
      wrap.appendChild(el('div', 'q-sub', '大声读一遍，然后告诉我读得怎么样：'));
      wrap.appendChild(self);

      return {
        node: wrap,
        getAnswer: function () { return picked; },
        isReady: function () { return picked !== null; },
        showResult: function () {
          self.querySelectorAll('.opt').forEach(function (n) { n.classList.add('locked', 'right'); });
        }
      };
    }
  };

  /* ============================================================
     判分
     ============================================================ */

  var GRADE = {
    choice: function (q, a) { return { ok: a === q.answer }; },
    listen: function (q, a) { return { ok: a === q.answer }; },
    passage: function (q, a) { return { ok: a === q.answer }; },
    tf: function (q, a) { return { ok: a === (q.answer ? 0 : 1) }; },

    multi: function (q, a) {
      var want = q.answer.slice().sort();
      return { ok: a.length === want.length && a.every(function (x, i) { return x === want[i]; }) };
    },

    fill: function (q, a) {
      var want = Array.isArray(q.answer) ? q.answer : [q.answer];
      var each = want.map(function (w, i) {
        var alts = Array.isArray(w) ? w : [w];
        return alts.some(function (alt) { return normalize(alt) === normalize(a[i]); });
      });
      return { ok: each.every(Boolean), each: each };
    },

    pinyin: function (q, a) {
      var each = q.items.map(function (it, i) { return normalize(it.word) === normalize(a[i]); });
      return { ok: each.every(Boolean), each: each };
    },

    recite: function (q, a) {
      var words = (q.text.match(/\{[^}]+\}/g) || []).map(function (s) { return s.slice(1, -1); });
      var each = words.map(function (w, i) { return normalize(w) === normalize(a[i]); });
      return { ok: each.every(Boolean), each: each };
    },

    match: function (q, a) {
      var all = true;
      for (var i = 0; i < q.pairs.length; i++) if (!a[i]) all = false;
      return { ok: all };
    },

    order: function (q, a) {
      var want = q.answer;
      return { ok: a.length === want.length && a.every(function (x, i) { return normalize(x) === normalize(want[i]); }) };
    },

    vertical: function (q, a) { return { ok: a === String(q.a * q.b) }; },

    readaloud: function (q, a) { return { ok: a !== null, self: a }; }
  };

  /* ============================================================
     Runner —— 跑一组题：出题 / 判分 / 加分 / combo / 错题本
     ============================================================ */

  function Runner(opts) {
    this.qs = opts.questions || [];
    this.mount = opts.mount;
    this.subject = opts.subject;
    this.dayNum = opts.dayNum;
    this.onDone = opts.onDone || function () {};
    this.onProgress = opts.onProgress || function () {};
    this.isReview = !!opts.isReview;
    this.boss = opts.boss || null;

    this.i = 0;
    this.right = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.xp = 0;
    this.startAt = Date.now();
    this.wrongList = [];
    this.log = [];
  }

  Runner.prototype.start = function () {
    this.render();
  };

  Runner.prototype.render = function () {
    var self = this;
    var q = this.qs[this.i];
    if (!q) return this.finish();

    this.mount.innerHTML = '';
    var card = el('div', 'q-card');

    var top = el('div', 'q-top');
    top.innerHTML =
      '<span>第 <b class="num">' + (this.i + 1) + '</b> / ' + this.qs.length + ' 题</span>' +
      '<span>' + (this.combo >= 2 ? '🔥 连对 ' + this.combo : '') + '</span>';
    card.appendChild(top);

    if (q.q) {
      var qt = el('div', 'q-text', qHTML(q.q));
      card.appendChild(qt);
    }
    if (q.sub) card.appendChild(el('div', 'q-sub', rich(q.sub)));

    var renderer = (RENDER[q.type] || RENDER.choice)(q);
    card.appendChild(renderer.node);

    var bar = el('div', 'actionbar');
    var submit = el('button', 'btn btn-primary', '确定');
    submit.type = 'button';
    submit.disabled = true;
    bar.appendChild(submit);
    card.appendChild(bar);

    card.addEventListener('pick', function () {
      submit.disabled = !renderer.isReady();
    });

    submit.onclick = function () {
      if (submit.dataset.next === '1') { self.i++; self.render(); return; }
      self.judge(q, renderer, card, submit, bar);
    };

    this.mount.appendChild(card);
    this.qStart = Date.now();
    this.onProgress(this.i, this.qs.length);

    // 回车提交
    this._key = function (e) {
      if (e.key === 'Enter' && !submit.disabled) { e.preventDefault(); submit.click(); }
    };
    document.addEventListener('keydown', this._key);
  };

  Runner.prototype.judge = function (q, renderer, card, submit, bar) {
    var self = this;
    document.removeEventListener('keydown', this._key);

    var ans = renderer.getAnswer();
    var res = (GRADE[q.type] || GRADE.choice)(q, ans);
    var ok = res.ok;

    renderer.showResult(ok, res);
    submit.dataset.next = '1';
    submit.textContent = (this.i + 1 >= this.qs.length) ? '完成' : '下一题 →';
    submit.disabled = false;

    // 判分反馈
    var v = el('div', 'verdict ' + (ok ? 'ok' : 'no'));
    var gain = 0;
    if (ok) {
      this.right++;
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      var mult = this.combo >= 8 ? 2 : this.combo >= 5 ? 1.5 : this.combo >= 3 ? 1.2 : 1;
      gain = Math.round(10 * mult);
      this.xp += gain;

      v.innerHTML = '<b>✅ 答对了！' + (mult > 1 ? ' 连对加成 ×' + mult : '') + '</b>' +
                    '<p>' + rich(q.explain || '') + '</p>';
      SFX.play(this.combo >= 3 ? 'combo' : 'right', this.combo);
      FX.floatScore('+' + gain, submit);
      if (this.combo === 3 || this.combo === 5 || this.combo === 8) {
        FX.comboTag(this.combo);
        FX.burst(innerWidth * 0.85, 150, 30);
      }
      if (this.isReview) Store.reviewWrong(q.id || (q.subject + ':' + (q.q || '').slice(0, 24)), true);
      if (this.boss) this.boss.hit();
    } else {
      this.combo = 0;
      v.innerHTML = '<b>❌ 再看看～</b><p>' +
        (this.answerText(q)) +
        (q.explain ? '<br>' + rich(q.explain) : '') + '</p>';
      SFX.play('wrong');
      this.wrongList.push(q);
      Store.addWrong(Object.assign({ subject: this.subject }, q), this.dayNum);
      if (this.isReview) Store.reviewWrong(q.id || (q.subject + ':' + (q.q || '').slice(0, 24)), false);
      if (this.boss) this.boss.heal();
    }

    this.log.push({ id: q.id, ok: ok, tags: q.tags || [], subject: q.subject || this.subject });

    // 逐题流水账：这是"记忆数据库"真正记下来的东西
    Store.logAnswer({
      day: this.dayNum,
      stage: this.subject,
      subject: q.subject || this.subject,
      qid: q.id || null,
      type: q.type,
      tags: q.tags || [],
      ok: ok,
      ms: Date.now() - (this.qStart || Date.now())
    });
    card.insertBefore(v, bar);
    v.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // 让"下一题"可以按回车
    this._key2 = function (e) {
      if (e.key === 'Enter') { e.preventDefault(); document.removeEventListener('keydown', self._key2); submit.click(); }
    };
    setTimeout(function () { document.addEventListener('keydown', self._key2); }, 250);
  };

  Runner.prototype.answerText = function (q) {
    var a = q.answer;
    switch (q.type) {
      case 'choice': case 'listen': case 'passage':
        return '正确答案：<b>' + KEYS[a] + '. ' + rich(q.options[a]) + '</b>';
      case 'tf':
        return '正确答案：<b>' + (a ? '对 ✓' : '错 ✗') + '</b>';
      case 'multi':
        return '正确答案：<b>' + a.map(function (i) { return KEYS[i]; }).join('、') + '</b>';
      case 'fill': case 'pinyin': case 'recite':
        var want = q.type === 'pinyin' ? q.items.map(function (i) { return i.word; })
                 : q.type === 'recite' ? (q.text.match(/\{[^}]+\}/g) || []).map(function (s) { return s.slice(1, -1); })
                 : (Array.isArray(a) ? a : [a]).map(function (x) { return Array.isArray(x) ? x[0] : x; });
        return '正确答案：<b>' + esc(want.join('　')) + '</b>';
      case 'vertical':
        return '正确答案：<b>' + (q.a * q.b) + '</b>';
      case 'order':
        return '正确顺序：<b>' + esc(q.answer.join(q.joiner || ' ')) + '</b>';
      default:
        return '';
    }
  };

  Runner.prototype.finish = function () {
    document.removeEventListener('keydown', this._key);
    document.removeEventListener('keydown', this._key2);
    var seconds = Math.round((Date.now() - this.startAt) / 1000);
    this.onDone({
      total: this.qs.length,
      right: this.right,
      xp: this.xp,
      maxCombo: this.maxCombo,
      seconds: seconds,
      wrong: this.wrongList,
      log: this.log
    });
  };

  window.Quiz = {
    Runner: Runner,
    render: RENDER,
    grade: GRADE,
    esc: esc,
    rich: rich,
    el: el,
    shuffle: shuffle
  };
})();
