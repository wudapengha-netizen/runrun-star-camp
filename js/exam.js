/* ============================================================
   exam.js —— 试卷引擎：渲染 → 作答 → 交卷 → 自动评分 → 成绩报告
   选择题点选，填空/计算/应用题打字。
   ============================================================ */
(function () {
  'use strict';

  var E = null;          // 试卷数据
  var Q = [];            // 摊平后的题目列表
  var startAt = 0;
  var timer = null;
  var submitted = false;
  var KEY = 'runrun.exam.math.v1';

  function el(t, c, h) { var d = document.createElement(t); if (c) d.className = c; if (h !== undefined) d.innerHTML = h; return d; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* {3/7} → 上下叠放的真分数；<b> 保留 */
  function rich(s) {
    return esc(s)
      .replace(/&lt;(\/?)(b|i|u|sup|sub|small)&gt;/g, '<$1$2>')
      .replace(/&lt;br\s*\/?&gt;/g, '<br>')
      .replace(/\{(\d+)\/(\d+)\}/g,
        '<span class="frac"><span class="num">$1</span><span class="den">$2</span></span>')
      .replace(/_{3,}/g, '<span class="blank-mark"></span>');
  }

  /* ---------- 答案归一化 ----------
     孩子可能打全角数字、带单位、多打空格，这些都不该算错。 */
  function norm(s) {
    if (s == null) return '';
    s = String(s).trim();
    // 全角转半角
    s = s.replace(/[！-～]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
    }).replace(/　/g, '');
    s = s.replace(/\s+/g, '');
    // 去掉结尾的单位和标点（答案本身要求只填数字时）
    s = s.replace(/[。，,、；;：:！!？?]/g, '');
    // 分数写法统一：二分之一 / 1/2 / 1÷2
    s = s.replace(/÷/g, '/');
    var cn = { 零: '0', 一: '1', 二: '2', 两: '2', 三: '3', 四: '4', 五: '5',
               六: '6', 七: '7', 八: '8', 九: '9', 十: '10' };
    var m = s.match(/^([零一二两三四五六七八九十]+)分之([零一二两三四五六七八九十]+)$/);
    if (m && cn[m[1]] && cn[m[2]]) s = cn[m[2]] + '/' + cn[m[1]];
    return s.toLowerCase();
  }

  /* 一个空的作答是否正确：accepted 是可接受答案数组 */
  function blankOK(got, accepted) {
    var g = norm(got);
    if (!g) return false;
    for (var i = 0; i < accepted.length; i++) {
      var w = norm(accepted[i]);
      if (g === w) return true;
      // 允许带单位作答：填 "60厘米" 而标准答案是 "60"
      if (/^\d+$/.test(w) && new RegExp('^' + w + '[^\\d]*$').test(g)) return true;
    }
    return false;
  }

  /* ---------- 摊平题目，编好全局题号 ---------- */
  function flatten() {
    Q = [];
    var no = 0;
    E.sections.forEach(function (sec, si) {
      var lists = [];
      if (sec.groups) sec.groups.forEach(function (g) { lists.push({ group: g, items: g.items, per: g.per }); });
      else lists.push({ group: null, items: sec.items, per: sec.per });

      lists.forEach(function (L) {
        L.items.forEach(function (it) {
          no++;
          Q.push({
            no: no, sec: si, secName: sec.name, group: L.group,
            type: sec.type, per: L.per || sec.per,
            q: it.q, o: it.o, a: it.a, tag: it.tag, why: it.why, unit: it.unit
          });
        });
      });
    });
  }

  /* ---------- 渲染 ---------- */
  function render() {
    var root = document.getElementById('paper');
    root.innerHTML = '';

    var head = el('div', 'exam-head');
    head.innerHTML =
      '<h1>' + esc(E.title) + '</h1>' +
      '<div class="sub">' + esc(E.subtitle) + '</div>' +
      '<div class="meta">' +
      '<span>姓名：<b>' + esc((window.PROFILE && PROFILE.name) || '') + '</b></span>' +
      '<span>日期：<b>' + new Date().toLocaleDateString('zh-CN') + '</b></span>' +
      '<span id="clock">用时 00:00</span>' +
      '</div>';
    root.appendChild(head);

    var qi = 0;
    E.sections.forEach(function (sec) {
      var box = el('section', 'sec');
      box.appendChild(el('h2', 'sec-name', esc(sec.name)));
      if (sec.hint) box.appendChild(el('div', 'sec-hint', rich(sec.hint)));

      var lists = sec.groups ? sec.groups.map(function (g) { return { label: g.label, items: g.items }; })
                             : [{ label: null, items: sec.items }];
      lists.forEach(function (L) {
        if (L.label) box.appendChild(el('div', 'grp-label', rich(L.label)));
        L.items.forEach(function () {
          box.appendChild(renderQ(Q[qi])); qi++;
        });
      });
      root.appendChild(box);
    });

    var bar = el('div', 'submit-bar');
    var left = el('div', 'left');
    left.innerHTML = '<span id="progress"></span>';
    var btn = el('button', 'btn btn-primary btn-submit', '交卷，看成绩');
    btn.type = 'button';
    btn.onclick = confirmSubmit;
    bar.appendChild(left); bar.appendChild(btn);
    root.appendChild(bar);

    updateProgress();
  }

  function renderQ(q) {
    var wrap = el('div', 'q');
    wrap.id = 'q' + q.no;

    var head = el('div', 'q-head');
    head.innerHTML = '<span class="q-no">' + q.no + '</span>' +
                     '<span class="q-body">' + rich(q.q) + '</span>' +
                     '<span class="q-pt">' + q.per + '分</span>';
    wrap.appendChild(head);

    if (q.type === 'choice') {
      var opts = el('div', 'opts' + (q.o.every(function (x) { return String(x).length <= 10; }) ? ' cols2' : ''));
      q.o.forEach(function (o, i) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.dataset.i = i;
        b.innerHTML = '<span class="key">' + 'ABCD'[i] + '</span><span class="txt">' + rich(o) + '</span>';
        b.onclick = function () {
          if (submitted) return;
          opts.querySelectorAll('.opt').forEach(function (n) { n.classList.remove('picked'); });
          b.classList.add('picked');
          wrap.dataset.ans = i;
          save(); updateProgress();
        };
        opts.appendChild(b);
      });
      wrap.appendChild(opts);
    } else {
      var row = el('div', 'blanks');
      q.a.forEach(function (_, i) {
        if (q.a.length > 1) row.appendChild(el('span', 'bn', '(' + (i + 1) + ')'));
        var inp = el('input', 'blank');
        inp.type = 'text';
        inp.autocomplete = 'off';
        inp.dataset.i = i;
        inp.oninput = function () { if (!submitted) { save(); updateProgress(); } };
        row.appendChild(inp);
        if (q.unit) row.appendChild(el('span', 'unit', q.unit));
      });
      wrap.appendChild(row);
    }
    return wrap;
  }

  /* ---------- 作答收集与暂存 ---------- */
  function collect() {
    return Q.map(function (q) {
      var w = document.getElementById('q' + q.no);
      if (q.type === 'choice') {
        return w.dataset.ans === undefined ? null : Number(w.dataset.ans);
      }
      return Array.prototype.map.call(w.querySelectorAll('.blank'), function (i) { return i.value; });
    });
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ans: collect(), startAt: startAt, submitted: submitted }));
    } catch (e) {}
  }

  function restore() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!d || !d.ans) return false;
      d.ans.forEach(function (a, k) {
        var q = Q[k]; if (!q || a == null) return;
        var w = document.getElementById('q' + q.no);
        if (q.type === 'choice') {
          w.dataset.ans = a;
          var b = w.querySelector('.opt[data-i="' + a + '"]');
          if (b) b.classList.add('picked');
        } else {
          var ins = w.querySelectorAll('.blank');
          a.forEach(function (v, i) { if (ins[i]) ins[i].value = v; });
        }
      });
      startAt = d.startAt || Date.now();
      return true;
    } catch (e) { return false; }
  }

  function answeredCount() {
    return collect().filter(function (a) {
      if (a === null) return false;
      if (Array.isArray(a)) return a.some(function (v) { return String(v).trim(); });
      return true;
    }).length;
  }

  function updateProgress() {
    var n = answeredCount();
    var p = document.getElementById('progress');
    if (p) p.innerHTML = '已作答 <b>' + n + '</b> / ' + Q.length + ' 题' +
      (n < Q.length ? '　<span class="warn">还有 ' + (Q.length - n) + ' 题没做</span>' : '　<span class="ok">全部做完了</span>');
  }

  /* ---------- 判分 ---------- */
  function grade() {
    var ans = collect();
    var rows = Q.map(function (q, k) {
      var got = ans[k];
      var ok, detail = [];
      if (q.type === 'choice') {
        ok = (got === q.a);
      } else {
        detail = q.a.map(function (acc, i) { return blankOK(got ? got[i] : '', acc); });
        ok = detail.every(Boolean);
      }
      return { q: q, got: got, ok: ok, detail: detail, score: ok ? q.per : 0 };
    });
    return rows;
  }

  function confirmSubmit() {
    var miss = Q.length - answeredCount();
    if (miss > 0 && !confirm('还有 ' + miss + ' 题没有作答，没做的会算 0 分。\n确定现在交卷吗？')) return;
    doSubmit();
  }

  function doSubmit() {
    submitted = true;
    clearInterval(timer);
    var rows = grade();
    save();
    showReport(rows);
  }

  /* ---------- 成绩报告 ---------- */
  function showReport(rows) {
    var total = rows.reduce(function (a, r) { return a + r.q.per; }, 0);
    var got = rows.reduce(function (a, r) { return a + r.score; }, 0);
    var pct = Math.round(got / total * 100);
    var mins = Math.max(1, Math.round((Date.now() - startAt) / 60000));

    // 按知识点归类失分
    var tags = {};
    rows.forEach(function (r) {
      var t = r.q.tag || '其他';
      if (!tags[t]) tags[t] = { tag: t, right: 0, total: 0, lost: 0 };
      tags[t].total++;
      if (r.ok) tags[t].right++; else tags[t].lost += r.q.per;
    });
    var weak = Object.keys(tags).map(function (k) { return tags[k]; })
      .filter(function (x) { return x.right < x.total; })
      .sort(function (a, b) { return b.lost - a.lost; });

    // 按大题统计
    var bySec = {};
    rows.forEach(function (r) {
      var n = r.q.secName;
      if (!bySec[n]) bySec[n] = { name: n, got: 0, total: 0 };
      bySec[n].got += r.score; bySec[n].total += r.q.per;
    });

    var root = document.getElementById('paper');
    var rep = el('div', 'report');
    var level = pct >= 95 ? '优秀' : pct >= 85 ? '良好' : pct >= 70 ? '合格' : '要加油';
    var color = pct >= 85 ? 'var(--grass)' : pct >= 70 ? 'var(--gold-deep)' : 'var(--cinnabar)';

    rep.innerHTML =
      '<div class="score-hero">' +
      '<div class="big" style="color:' + color + '">' + got + '<small> / ' + total + '</small></div>' +
      '<div class="lv">' + level + '　·　得分率 ' + pct + '%　·　用时 ' + mins + ' 分钟</div>' +
      '</div>';

    var tbl = el('table', 'sec-table');
    tbl.innerHTML = '<thead><tr><th>大题</th><th>得分</th><th>满分</th><th>得分率</th></tr></thead>';
    var tb = el('tbody');
    Object.keys(bySec).forEach(function (k) {
      var s = bySec[k];
      var p = Math.round(s.got / s.total * 100);
      tb.innerHTML += '<tr><td>' + esc(s.name) + '</td><td class="num">' + s.got + '</td>' +
        '<td class="num">' + s.total + '</td><td class="num" style="color:' +
        (p >= 85 ? 'var(--grass)' : p >= 70 ? 'var(--gold-deep)' : 'var(--cinnabar)') + '">' + p + '%</td></tr>';
    });
    tbl.appendChild(tb);
    rep.appendChild(tbl);

    if (weak.length) {
      var w = el('div', 'weak');
      w.innerHTML = '<h3>丢分最多的知识点</h3>' +
        weak.slice(0, 8).map(function (x) {
          return '<div class="weak-row"><span class="t">' + esc(x.tag) + '</span>' +
                 '<span class="n">' + x.right + '/' + x.total + ' 题　−' + x.lost + '分</span></div>';
        }).join('');
      rep.appendChild(w);
    } else {
      rep.appendChild(el('div', 'weak', '<h3>🎉 全部答对，没有丢分的知识点</h3>'));
    }

    var acts = el('div', 'report-acts');
    var again = el('button', 'btn btn-ghost', '重新做一遍');
    again.type = 'button';
    again.onclick = function () {
      if (!confirm('会清空这次的作答，重新开始。确定吗？')) return;
      try { localStorage.removeItem(KEY); } catch (e) {}
      location.reload();
    };
    var pr = el('button', 'btn btn-ghost', '🖨 打印这份卷子和答案');
    pr.type = 'button';
    pr.onclick = function () { window.print(); };
    var back = el('button', 'btn', '← 回闯关营');
    back.type = 'button';
    back.onclick = function () { location.href = 'index.html'; };
    acts.appendChild(again); acts.appendChild(pr); acts.appendChild(back);
    rep.appendChild(acts);

    root.insertBefore(rep, root.firstChild);

    // 逐题标红标绿 + 展开解析
    rows.forEach(function (r) {
      var w = document.getElementById('q' + r.q.no);
      w.classList.add(r.ok ? 'right' : 'wrong');
      var mark = el('div', 'verdict ' + (r.ok ? 'ok' : 'no'));
      var right = answerText(r.q);
      mark.innerHTML =
        '<b>' + (r.ok ? '✅ 对　+' + r.q.per + '分' : '❌ 错　0分') + '</b>' +
        (r.ok ? '' : '<div class="ra">正确答案：<b>' + right + '</b></div>') +
        (r.q.why ? '<div class="why">' + rich(r.q.why) + '</div>' : '');
      w.appendChild(mark);

      if (r.q.type === 'choice') {
        w.querySelectorAll('.opt').forEach(function (b) {
          b.classList.add('locked');
          var i = Number(b.dataset.i);
          if (i === r.q.a) b.classList.add('is-right');
          else if (i === r.got) b.classList.add('is-wrong');
        });
      } else {
        var ins = w.querySelectorAll('.blank');
        ins.forEach(function (inp, i) {
          inp.disabled = true;
          inp.classList.add(r.detail[i] ? 'ok' : 'no');
        });
      }
    });

    document.querySelector('.submit-bar').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function answerText(q) {
    if (q.type === 'choice') return 'ABCD'[q.a] + '. ' + rich(q.o[q.a]);
    return q.a.map(function (acc) { return rich(acc[0]); }).join('　');
  }

  /* ---------- 计时 ---------- */
  function tick() {
    var s = Math.floor((Date.now() - startAt) / 1000);
    var c = document.getElementById('clock');
    if (c) c.textContent = '用时 ' + String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  /* ---------- 启动 ---------- */
  function boot() {
    E = window.EXAM_MATH;
    if (!E) { document.getElementById('paper').innerHTML = '<p>试卷数据没加载成功。</p>'; return; }
    flatten();
    startAt = Date.now();
    render();
    var had = restore();
    if (had) updateProgress();
    timer = setInterval(tick, 1000);
    tick();

    window.addEventListener('beforeunload', function (e) {
      if (!submitted && answeredCount() > 0) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
