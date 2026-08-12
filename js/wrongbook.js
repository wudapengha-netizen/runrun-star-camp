/* ============================================================
   wrongbook.js —— 错题本 / 学习档案

   数据来自 Store.examLog（跟着云端存档走，换电脑也在）。
   这一页不产生数据，只把数据库翻出来给人看：
     · 每科考过几次、分数走势
     · 还没攻克的知识点（按丢分排）
     · 每道错题：题目 / 他填的 / 正确答案 / 讲解
     · 一键导出摘要，方便发给我看

   「攻克」的判定特意定得严：错过的题，要在后来的轮次里
   连对 2 次才算数。只对一次可能只是记住了答案。
   ============================================================ */
(function () {
  'use strict';

  var SUBJECTS = [
    { key: 'math',    name: '数学', icon: '📐', color: 'var(--indigo, #3f6bb0)' },
    { key: 'chinese', name: '语文', icon: '📖', color: 'var(--cinnabar, #c1462f)' },
    { key: 'english', name: '英语', icon: '🔤', color: 'var(--jade, #2f8f6b)' }
  ];

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
  /* 讲解里本来就带 <b> <br> 这类标签，白名单放行，其余转义 */
  function rich(s) {
    return esc(s).replace(/&lt;(\/?)(b|i|u|br|sub|sup|small|em|strong)&gt;/g, '<$1$2>');
  }
  function when(ts) {
    var d = new Date(ts), n = new Date();
    var same = d.toDateString() === n.toDateString();
    var hm = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    return same ? ('今天 ' + hm)
                : ((d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm);
  }

  /* ---------- 渲染 ---------- */

  function render() {
    var root = document.getElementById('book');
    root.innerHTML = '';

    var log = Store.examLog();
    if (!log.length) {
      root.appendChild(el('div', 'card empty',
        '<div class="big">📭</div>' +
        '<h2>还没有交过卷</h2>' +
        '<p>做完任意一份卷子并交卷，成绩和错题就会自动存进来——' +
        '在家里任何一台电脑上打开这一页，看到的都是同一份记录。</p>' +
        '<div class="row"><a class="btn btn-primary" href="index.html">去做卷子</a></div>'));
      return;
    }

    root.appendChild(overview(log));
    SUBJECTS.forEach(function (s) {
      var sub = Store.examLog(s.key);
      if (sub.length) root.appendChild(subjectCard(s, sub));
    });
    root.appendChild(exportCard(log));
  }

  /* 顶部总览 */
  function overview(log) {
    var box = el('div', 'card');
    box.appendChild(el('div', 'seal-title', '总览'));
    box.appendChild(el('hr', 'rule'));

    var grid = el('div', 'ov-grid');
    SUBJECTS.forEach(function (s) {
      var sub = Store.examLog(s.key);
      var last = sub[sub.length - 1];
      var open = Store.openWrong(s.key).length;
      var cell = el('div', 'ov-cell');
      if (!last) {
        cell.innerHTML = '<div class="ic">' + s.icon + '</div><div class="nm">' + s.name + '</div>' +
                         '<div class="none">还没考过</div>';
      } else {
        var pct = Math.round(last.score / last.total * 100);
        cell.innerHTML =
          '<div class="ic">' + s.icon + '</div><div class="nm">' + s.name + '</div>' +
          '<div class="pct" style="color:' + tone(pct) + '">' + pct + '%</div>' +
          '<div class="sm">最近 ' + last.score + '/' + last.total + '　考过 ' + sub.length + ' 次</div>' +
          '<div class="sm ' + (open ? 'bad' : 'good') + '">' +
          (open ? ('还有 <b>' + open + '</b> 道没攻克') : '错题已全部攻克 🎉') + '</div>';
      }
      grid.appendChild(cell);
    });
    box.appendChild(grid);
    return box;
  }

  function tone(p) {
    return p >= 85 ? 'var(--grass, #4a8f4a)'
         : p >= 70 ? 'var(--gold-deep, #b8860b)'
                   : 'var(--cinnabar, #c1462f)';
  }

  /* 每一科一张大卡 */
  function subjectCard(s, log) {
    var box = el('div', 'card');
    box.appendChild(el('div', 'seal-title', s.icon + ' ' + s.name));
    box.appendChild(el('hr', 'rule'));

    // —— 历次成绩 ——
    var hist = el('table', 'hist');
    hist.innerHTML = '<thead><tr><th>时间</th><th>卷子</th><th>得分</th><th>得分率</th><th>用时</th></tr></thead>';
    var tb = el('tbody');
    log.slice().reverse().forEach(function (r) {
      var pct = Math.round(r.score / r.total * 100);
      tb.innerHTML +=
        '<tr><td class="dim">' + when(r.at) + '</td>' +
        '<td>' + esc(r.title) + '</td>' +
        '<td class="num">' + r.score + '/' + r.total + '</td>' +
        '<td class="num" style="color:' + tone(pct) + '"><b>' + pct + '%</b></td>' +
        '<td class="num dim">' + Math.max(1, Math.round(r.ms / 60000)) + ' 分</td></tr>';
    });
    hist.appendChild(tb);
    box.appendChild(hist);

    // —— 知识点掌握情况 ——
    var tags = Store.tagStatus(s.key);
    var openTags = tags.filter(function (t) { return t.open > 0; });
    var fixedTags = tags.filter(function (t) { return t.open === 0 && t.fixed > 0; });

    if (openTags.length) {
      box.appendChild(el('h3', 'blk-h', '还没攻克的知识点（' + openTags.length + ' 个）'));
      box.appendChild(el('div', 'blk-note',
        '「攻克」的标准是：这道题错过之后，<b>在后面的轮次里连对 2 次</b>。' +
        '只对一次不算——可能只是记住了那个答案。'));
      var list = el('div', 'tag-list');
      openTags.forEach(function (t) { list.appendChild(tagRow(t, s)); });
      box.appendChild(list);
    } else {
      box.appendChild(el('div', 'all-clear', '🎉 这一科错过的题目全部攻克了'));
    }

    if (fixedTags.length) {
      box.appendChild(el('h3', 'blk-h', '已攻克（' + fixedTags.length + ' 个）'));
      var fx = el('div', 'fixed-list');
      fixedTags.forEach(function (t) {
        fx.appendChild(el('span', 'chip-ok', esc(t.tag) + ' ✓'));
      });
      box.appendChild(fx);
    }

    // —— 下一轮入口 ——
    var act = el('div', 'row act');
    if (openTags.length) {
      var b = el('button', 'btn btn-primary',
        '🔁 生成 ' + s.name + '第 ' + (log.length + 1) + ' 轮测试');
      b.type = 'button';
      b.onclick = function () { location.href = 'exam-next.html?subject=' + s.key; };
      act.appendChild(b);
    }
    box.appendChild(act);
    return box;
  }

  /* 一个知识点一行，点开看具体错题 */
  function tagRow(t, s) {
    var row = el('div', 'tag-row');
    var head = el('button', 'tag-head');
    head.type = 'button';
    head.innerHTML =
      '<span class="tw">' + esc(t.tag) + '</span>' +
      '<span class="cnt">' + t.open + ' 道没攻克' +
      (t.fixed ? '　·　已攻克 ' + t.fixed : '') + '</span>' +
      '<span class="arw">▾</span>';
    row.appendChild(head);

    var body = el('div', 'tag-body');
    t.qs.filter(function (m) { return m.wrong > 0 && m.streak < 2; })
        .forEach(function (m) { body.appendChild(qCard(m, s)); });
    row.appendChild(body);

    head.onclick = function () { row.classList.toggle('open'); };
    return row;
  }

  /* 一道错题的明细 */
  function qCard(m, s) {
    // 从卷子原始数据里取全文和讲解（数据库里只存了摘要）
    var full = lookup(m.qid) || {};
    var c = el('div', 'q-card');
    c.innerHTML =
      '<div class="qq">' + rich(full.q || m.q || '') + '</div>' +
      '<div class="ans">' +
        '<span class="bad">他填的：<b>' + esc(m.lastGot || '（没答）') + '</b></span>' +
        '<span class="good">正确答案：<b>' + esc(full.want || '') + '</b></span>' +
      '</div>' +
      (full.why ? '<div class="why">' + rich(full.why) + '</div>' : '') +
      '<div class="meta">' + esc(m.qid) + '　·　做过 ' + m.tries + ' 次，错 ' + m.wrong + ' 次' +
      (m.streak ? '　·　已连对 ' + m.streak + ' 次' : '') + '　·　最近 ' + when(m.lastAt) + '</div>';
    return c;
  }

  /* qid → 卷子里的原题（题干全文、正确答案、讲解） */
  var BANK = null;
  function bank() {
    if (BANK) return BANK;
    BANK = {};
    (window.PAPERS || []).forEach(function (P) {
      if (!P) return;
      var no = 0;
      P.sections.forEach(function (sec) {
        (sec.groups || [{ items: sec.items, type: sec.type, per: sec.per }])
          .forEach(function (L) {
            (L.items || []).forEach(function (it) {
              no++;
              var type = L.type || sec.type;
              BANK[(P.id || 'paper') + '#' + no] = {
                q: it.q, why: it.why, tag: it.tag, type: type,
                per: L.per || sec.per, o: it.o, a: it.a,
                want: (type === 'choice' || type === 'listen')
                        ? ('ABCD'[it.a] + '. ' + String(it.o[it.a]).replace(/<[^>]+>/g, ''))
                        : (it.a || []).map(function (x) { return x[0]; }).join(' / ')
              };
            });
          });
      });
    });
    return BANK;
  }
  function lookup(qid) { return bank()[qid]; }

  /* ---------- 导出：一键复制摘要 ---------- */
  function exportCard(log) {
    var box = el('div', 'card');
    box.appendChild(el('div', 'seal-title', '发给老师看'));
    box.appendChild(el('hr', 'rule'));
    box.appendChild(el('p', 'q-sub',
      '这些记录存在你自己的云端账号里，<b>我这边是读不到的</b>（配对码只有你有，本来就该这样）。' +
      '要我看错题、出下一轮卷子的时候，点这个按钮复制一份摘要发给我就行。'));

    var ta = el('textarea', 'digest');
    ta.readOnly = true;
    ta.value = digest(log);
    box.appendChild(ta);

    var row = el('div', 'row');
    var b = el('button', 'btn btn-primary', '📋 复制摘要');
    b.type = 'button';
    b.onclick = function () {
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      if (navigator.clipboard) navigator.clipboard.writeText(ta.value).catch(function () {});
      b.textContent = ok || navigator.clipboard ? '✅ 已复制' : '请手动全选复制';
      setTimeout(function () { b.textContent = '📋 复制摘要'; }, 2200);
    };
    row.appendChild(b);
    box.appendChild(row);
    return box;
  }

  function digest(log) {
    var L = ['【' + ((window.PROFILE && PROFILE.name) || '孩子') + ' 的做卷记录】'];
    SUBJECTS.forEach(function (s) {
      var sub = Store.examLog(s.key);
      if (!sub.length) return;
      L.push('');
      L.push('■ ' + s.name);
      sub.forEach(function (r) {
        L.push('  ' + when(r.at) + '　' + r.title + '　' + r.score + '/' + r.total +
               '（' + Math.round(r.score / r.total * 100) + '%）');
      });
      var open = Store.openWrong(s.key);
      if (!open.length) { L.push('  错题已全部攻克'); return; }
      L.push('  还没攻克 ' + open.length + ' 道：');
      open.forEach(function (m) {
        var f = lookup(m.qid) || {};
        L.push('   · [' + m.qid + '] ' + (m.tag || '') +
               '｜' + String(f.q || m.q || '').replace(/<[^>]+>/g, '').slice(0, 46) +
               '｜填了「' + (m.lastGot || '空') + '」，应为「' + (f.want || '') + '」' +
               '｜做 ' + m.tries + ' 次错 ' + m.wrong + ' 次');
      });
    });
    return L.join('\n');
  }

  /* ---------- 启动 ---------- */
  function boot() {
    var root = document.getElementById('book');
    root.innerHTML = '<div class="card loading">正在读取存档…</div>';
    Store.boot((window.PROFILE && PROFILE.name) || '')
      .then(render)
      .catch(function (e) {
        console.warn('云端没读到，改看本机存档', e);
        Store.load();
        render();
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
