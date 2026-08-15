/* ============================================================
   practice.js —— 做题页

   只有一件事：出题 → 做 → 立刻知道对错 → 下一题。
   没有闯关、没有积分、没有称号。

   题从哪来：
     · 能现出的知识点（gen.js 里有生成器）→ <b>现出，每次都是新的</b>
     · 现不出的（课文理解、古诗默写这类）→ 从已有卷子的题库里挑

   出哪个知识点：按「最需要练」排序
     1. 做错过、还没连对 2 次的        —— 最优先
     2. 从来没练过的
     3. 练过但正确率低于 80% 的
     4. 其余的随机穿插，防止生疏
   ============================================================ */
(function () {
  'use strict';

  var SUB = {
    math:    { name: '数学', icon: '📐' },
    chinese: { name: '语文', icon: '📖' },
    english: { name: '英语', icon: '🔤' }
  };
  var SIZE = 15;                       // 一组多少题

  function el(t, c, h) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (h != null) n.innerHTML = h;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function rich(s) {
    return esc(s)
      .replace(/&lt;(\/?)(b|i|u|sup|sub|small|em|strong)&gt;/g, '<$1$2>')
      .replace(/&lt;br\s*\/?&gt;/g, '<br>')
      .replace(/\{(\d+)\/(\d+)\}/g,
        '<span class="frac"><span class="num">$1</span><span class="den">$2</span></span>')
      .replace(/_{3,}/g, '<span class="blank-mark"></span>');
  }
  function canon(tag) {
    var all = [window.SYLLABUS_MATH, window.SYLLABUS_CHINESE, window.SYLLABUS_ENGLISH];
    for (var i = 0; i < all.length; i++) {
      if (all[i] && all[i].canon) { var a = all[i].canon(tag); if (a !== tag) return a; }
    }
    return tag;
  }

  /* ---------- 答案判定（和试卷用同一套规则） ---------- */
  function norm(s) {
    if (s == null) return '';
    s = String(s).trim()
      .replace(/[！-～]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
      .replace(/　/g, '').replace(/\s+/g, '')
      .replace(/[。，,、；;：:！!？?]/g, '')
      .replace(/\.+$/, '').replace(/÷/g, '/');
    var cn = { 零: '0', 一: '1', 二: '2', 两: '2', 三: '3', 四: '4', 五: '5',
               六: '6', 七: '7', 八: '8', 九: '9', 十: '10' };
    var m = s.match(/^([零一二两三四五六七八九十]+)分之([零一二两三四五六七八九十]+)$/);
    if (m && cn[m[1]] && cn[m[2]]) s = cn[m[2]] + '/' + cn[m[1]];
    return s.toLowerCase();
  }
  function blankOK(got, accepted) {
    var g = norm(got);
    if (!g) return false;
    for (var i = 0; i < accepted.length; i++) {
      var w = norm(accepted[i]);
      if (g === w) return true;
      if (/^\d+$/.test(w) && new RegExp('^' + w + '[^\\d]*$').test(g)) return true;
    }
    return false;
  }

  /* ---------- 题库（现不出题的知识点从这里挑） ---------- */
  var BANK = null;
  function bank(subject) {
    if (!BANK) {
      BANK = {};
      (window.PAPERS || []).forEach(function (P) {
        if (!P) return;
        var no = 0;
        P.sections.forEach(function (sec) {
          (sec.groups || [{ items: sec.items, type: sec.type, per: sec.per }])
            .forEach(function (L) {
              (L.items || []).forEach(function (it) {
                no++;
                var arr = BANK[P.subject] || (BANK[P.subject] = []);
                arr.push({
                  qid: (P.id || 'p') + '#' + no, subject: P.subject,
                  type: L.type || sec.type, q: it.q, o: it.o, a: it.a,
                  tag: canon(it.tag || '其他'), why: it.why, audio: it.audio
                });
              });
            });
        });
      });
    }
    return BANK[subject] || [];
  }

  /* ---------- 挑知识点：最需要练的排前面 ---------- */
  function pickTags(subject) {
    var S = window['SYLLABUS_' + subject.toUpperCase()];
    var all = [];
    if (S) S.units.forEach(function (u) {
      u.points.forEach(function (p) { all.push(p.tag); });
    });
    // 没有总表就退回题库里出现过的 tag
    if (!all.length) {
      var seen = {};
      bank(subject).forEach(function (b) { if (!seen[b.tag]) { seen[b.tag] = 1; all.push(b.tag); } });
    }

    var st = {};
    try { st = Store.examStatus(subject) || {}; } catch (e) {}
    var stat = {};      // tag → {tries, wrong, open}
    Object.keys(st).forEach(function (qid) {
      var m = st[qid], t = canon(m.tag || '其他');
      var g = stat[t] || (stat[t] = { tries: 0, wrong: 0, open: 0 });
      g.tries += m.tries; g.wrong += m.wrong;
      if (m.wrong > 0 && m.streak < 2) g.open++;
    });

    var scored = all.map(function (t) {
      var g = stat[t];
      var score;
      if (g && g.open) score = 1000 + g.open * 10;              // 还没攻克 —— 最优先
      else if (!g) score = 500;                                  // 从没练过
      else {
        var rate = g.tries ? (g.tries - g.wrong) / g.tries : 1;
        score = rate < 0.8 ? 300 + (1 - rate) * 100 : 50 * Math.random();
      }
      return { tag: t, score: score + Math.random() * 20, stat: g };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored;
  }

  /* ---------- 组一组题 ---------- */
  function build(subject) {
    var ranked = pickTags(subject);
    var out = [], used = {};
    var seedBase = Date.now();

    // 前 60% 的题给最需要练的知识点，每个点 2 道
    var focus = ranked.slice(0, Math.max(4, Math.ceil(SIZE * 0.6 / 2)));
    focus.forEach(function (r) {
      for (var i = 0; i < 2 && out.length < Math.ceil(SIZE * 0.6); i++) {
        var q = makeOne(subject, r.tag, seedBase + out.length * 7919 + i * 131, used);
        if (q) out.push(q);
      }
    });
    // 剩下的从全部知识点里轮着来
    var idx = 0;
    while (out.length < SIZE && idx < ranked.length * 3) {
      var r2 = ranked[idx % ranked.length]; idx++;
      var q2 = makeOne(subject, r2.tag, seedBase + out.length * 104729 + idx * 37, used);
      if (q2) out.push(q2);
    }
    return out;
  }

  /* 出一道：能现出就现出，否则从题库挑一道没用过的 */
  function makeOne(subject, tag, seed, used) {
    if (window.GEN && GEN.can(tag)) {
      var g = GEN.one(tag, seed);
      if (g && !used['gen:' + g.q]) {
        used['gen:' + g.q] = 1;
        g.qid = 'gen:' + tag + ':' + (seed % 1000000);
        g.subject = subject;
        return g;
      }
      return null;
    }
    var pool = bank(subject).filter(function (b) { return b.tag === tag && !used[b.qid]; });
    if (!pool.length) return null;
    var b2 = pool[Math.floor(Math.random() * pool.length)];
    used[b2.qid] = 1;
    return b2;
  }

  /* ---------- 状态 ---------- */
  var subject = 'math';
  var list = [], at = 0, answers = [], startAt = 0;

  /* ---------- 渲染 ---------- */
  function render() {
    var root = document.getElementById('view');
    root.innerHTML = '';
    root.appendChild(bar());
    if (at >= list.length) { root.appendChild(done()); return; }
    root.appendChild(card(list[at]));
  }

  function bar() {
    var b = el('div', 'pr-bar');
    var right = answers.filter(function (x) { return x && x.ok; }).length;
    var doneN = answers.filter(function (x) { return x; }).length;
    b.innerHTML =
      '<div class="tabs">' + Object.keys(SUB).map(function (k) {
        return '<button class="tab' + (k === subject ? ' on' : '') + '" data-s="' + k + '">' +
               SUB[k].icon + ' ' + SUB[k].name + '</button>';
      }).join('') + '</div>' +
      '<div class="prog"><b>' + Math.min(at + 1, list.length) + '</b> / ' + list.length +
      (doneN ? '　·　对 <b class="ok">' + right + '</b> 错 <b class="no">' + (doneN - right) + '</b>' : '') +
      '</div>';
    b.querySelectorAll('.tab').forEach(function (t) {
      t.onclick = function () {
        if (t.dataset.s === subject) return;
        subject = t.dataset.s;
        try { localStorage.setItem('runrun.practice.subject', subject); } catch (e) {}
        newRound();
      };
    });
    return b;
  }

  function card(q) {
    var c = el('div', 'pr-card');
    c.appendChild(el('div', 'pr-tag', esc(q.tag) + (q.gen ? '　·　新出的题' : '')));
    c.appendChild(el('div', 'pr-q', rich(q.q)));

    var picked = null, inputs = [];
    var body = el('div', 'pr-body');

    if (q.type === 'choice' || q.type === 'listen') {
      var opts = el('div', 'pr-opts');
      q.o.forEach(function (o, i) {
        var b = el('button', 'pr-opt');
        b.type = 'button';
        b.innerHTML = '<span class="key">' + 'ABCD'[i] + '</span><span class="txt">' + rich(o) + '</span>';
        b.onclick = function () {
          if (c.dataset.done) return;
          opts.querySelectorAll('.pr-opt').forEach(function (n) { n.classList.remove('picked'); });
          b.classList.add('picked'); picked = i;
        };
        opts.appendChild(b);
      });
      body.appendChild(opts);
    } else {
      var row = el('div', 'pr-blanks');
      q.a.forEach(function (acc, i) {
        if (q.a.length > 1) row.appendChild(el('span', 'bn', '(' + (i + 1) + ')'));
        var inp = el('input', 'pr-blank');
        inp.type = 'text'; inp.autocomplete = 'off';
        var len = String((acc && acc[0]) || '').length;
        if (len > 3) inp.style.width = Math.min(420, 90 + len * 26) + 'px';
        inp.onkeydown = function (e) {
          if (e.key !== 'Enter') return;
          var k = inputs.indexOf(inp);
          if (k >= 0 && k < inputs.length - 1) inputs[k + 1].focus();
          else go.click();
        };
        inputs.push(inp);
        row.appendChild(inp);
      });
      body.appendChild(row);
    }
    c.appendChild(body);

    var act = el('div', 'pr-act');
    var go = el('button', 'btn btn-primary pr-go', '检查');
    go.type = 'button';
    act.appendChild(go);
    c.appendChild(act);

    go.onclick = function () {
      if (c.dataset.done) { next(); return; }
      var ok, got;
      if (q.type === 'choice' || q.type === 'listen') {
        if (picked == null) { go.textContent = '先选一个'; setTimeout(function () { go.textContent = '检查'; }, 900); return; }
        ok = picked === q.a;
        got = 'ABCD'[picked] + '. ' + String(q.o[picked]).replace(/<[^>]+>/g, '');
      } else {
        var vals = inputs.map(function (n) { return n.value; });
        if (vals.every(function (v) { return !v.trim(); })) {
          go.textContent = '先写答案'; setTimeout(function () { go.textContent = '检查'; }, 900); return;
        }
        ok = q.a.every(function (acc, i) { return blankOK(vals[i], acc); });
        got = vals.map(function (v) { return v.trim() || '（空）'; }).join(' / ');
      }
      c.dataset.done = '1';
      c.classList.add(ok ? 'right' : 'wrong');
      inputs.forEach(function (n) { n.readOnly = true; });

      if (q.type === 'choice' || q.type === 'listen') {
        var os = c.querySelectorAll('.pr-opt');
        os[q.a].classList.add('is-right');
        if (!ok && picked != null) os[picked].classList.add('is-wrong');
      }

      var want = (q.type === 'choice' || q.type === 'listen')
        ? 'ABCD'[q.a] + '. ' + String(q.o[q.a]).replace(/<[^>]+>/g, '')
        : q.a.map(function (acc) { return acc[0]; }).join(' / ');

      var fb = el('div', 'pr-fb ' + (ok ? 'ok' : 'no'));
      fb.innerHTML = '<div class="hd">' + (ok ? '✅ 对了' : '❌ 错了') +
        (ok ? '' : '　正确答案：<b>' + esc(want) + '</b>') + '</div>' +
        (q.why ? '<div class="why">' + rich(q.why) + '</div>' : '');
      c.insertBefore(fb, act);

      answers[at] = { ok: ok, got: got, want: want, q: q };
      go.textContent = (at === list.length - 1) ? '看这一组的结果 →' : '下一题 →';
      go.focus();
      document.getElementById('view').replaceChild(bar(), document.querySelector('.pr-bar'));
    };

    // 键盘：1~4 选选项，回车检查
    c.tabIndex = -1;
    setTimeout(function () { if (inputs.length) inputs[0].focus(); else c.focus(); }, 30);
    c.onkeydown = function (e) {
      if (c.dataset.done) { if (e.key === 'Enter') { e.preventDefault(); go.click(); } return; }
      if (/^[1-4]$/.test(e.key) && (q.type === 'choice' || q.type === 'listen')) {
        var b2 = c.querySelectorAll('.pr-opt')[+e.key - 1];
        if (b2) b2.click();
      } else if (e.key === 'Enter' && !inputs.length) { e.preventDefault(); go.click(); }
    };
    return c;
  }

  function next() { at++; render(); window.scrollTo(0, 0); }

  function done() {
    var right = answers.filter(function (x) { return x && x.ok; }).length;
    var pct = Math.round(right / list.length * 100);
    var mins = Math.max(1, Math.round((Date.now() - startAt) / 60000));
    var box = el('div', 'pr-done');
    box.innerHTML =
      '<div class="big" style="color:' + (pct >= 85 ? 'var(--grass)' : pct >= 60 ? 'var(--gold-deep)' : 'var(--cinnabar)') + '">' +
      right + ' / ' + list.length + '</div>' +
      '<div class="lb">正确率 ' + pct + '%　·　用时 ' + mins + ' 分钟</div>';

    var wrongs = answers.filter(function (x) { return x && !x.ok; });
    if (wrongs.length) {
      box.appendChild(el('h3', 'blk-h', '这一组错了 ' + wrongs.length + ' 题'));
      var l = el('div', 'pr-wrongs');
      wrongs.forEach(function (w) {
        l.appendChild(el('div', 'pr-w',
          '<div class="q">' + rich(w.q.q) + '</div>' +
          '<div class="a"><span class="no">你填：' + esc(w.got) + '</span>' +
          '<span class="ok">应为：' + esc(w.want) + '</span>' +
          '<span class="tg">' + esc(w.q.tag) + '</span></div>'));
      });
      box.appendChild(l);
      box.appendChild(el('div', 'blk-note',
        '这些知识点<b>下一组会再出</b>——换成新题目，不是同一道。做对两次才算过关。'));
    } else {
      box.appendChild(el('div', 'all-clear', '🎉 全对！'));
    }

    var row = el('div', 'row');
    row.style.marginTop = '20px';
    var again = el('button', 'btn btn-primary', '再来一组 →');
    again.type = 'button';
    again.style.fontSize = '19px';
    again.onclick = newRound;
    row.appendChild(again);
    var bk = el('a', 'btn btn-ghost', '📕 错题本');
    bk.href = 'wrongbook.html';
    row.appendChild(bk);
    box.appendChild(row);

    save();
    return box;
  }

  /* ---------- 存档 ---------- */
  function save() {
    if (!(window.Store && Store.recordExam)) return;
    try {
      Store.recordExam({
        paper: '练习·' + subject, subject: subject,
        title: SUB[subject].name + '练习（' + list.length + ' 题）',
        ms: Date.now() - startAt,
        score: answers.filter(function (x) { return x && x.ok; }).length,
        total: list.length,
        items: list.map(function (q, i) {
          var a = answers[i] || {};
          return {
            qid: q.qid, no: i + 1, tag: q.tag, secName: '练习',
            type: q.type, per: 1, ok: !!a.ok,
            q: String(q.q).replace(/<[^>]+>/g, '').slice(0, 90),
            got: String(a.got || '（没答）').slice(0, 60),
            want: String(a.want || '').slice(0, 60),
            why: q.why || ''
          };
        })
      });
    } catch (e) { console.warn('练习记录没存上', e); }
  }

  function newRound() {
    list = build(subject);
    at = 0; answers = []; startAt = Date.now();
    render();
    window.scrollTo(0, 0);
  }

  /* ---------- 启动 ---------- */
  function boot() {
    try { subject = localStorage.getItem('runrun.practice.subject') || 'math'; } catch (e) {}
    if (!SUB[subject]) subject = 'math';
    var root = document.getElementById('view');
    root.innerHTML = '<div class="pr-card">正在准备题目…</div>';
    var go = function () { newRound(); };
    if (window.Store && Store.boot) {
      Store.boot((window.PROFILE && PROFILE.name) || '').then(go)
        .catch(function () { try { Store.load(); } catch (e) {} go(); });
    } else go();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
