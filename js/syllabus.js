/* ============================================================
   syllabus.js —— 知识点总表 + 覆盖率报表

   这一页回答三个问题：
     1. 这本书到底有哪些知识点？（每条都带教材原文和页码）
     2. 已有的卷子考到了哪些？还有哪些一次都没考过？
     3. 润润在每个知识点上做得怎么样？

   知识点清单是逐页读教材抠出来的，不是凭印象写的 ——
   有了它，出题前先查表，就不会漏单元，也不会越考越飘。
   ============================================================ */
(function () {
  'use strict';

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
    return esc(s).replace(/&lt;(\/?)(b|i|u|br|sub|sup|small|em|strong)&gt;/g, '<$1$2>');
  }

  var BOOKS = [window.SYLLABUS_MATH, window.SYLLABUS_CHINESE, window.SYLLABUS_ENGLISH]
              .filter(Boolean);

  /* 试卷里用到的 tag → 出现次数 */
  function usedTags(subject) {
    var used = {};
    (window.PAPERS || []).forEach(function (P) {
      if (!P || P.subject !== subject) return;
      P.sections.forEach(function (sec) {
        (sec.groups || [{ items: sec.items }]).forEach(function (L) {
          (L.items || []).forEach(function (it) {
            if (it.tag) used[it.tag] = (used[it.tag] || 0) + 1;
          });
        });
      });
    });
    return used;
  }

  function tone(p) {
    return p >= 80 ? 'var(--grass, #4a8f4a)'
         : p >= 50 ? 'var(--gold-deep, #b8860b)'
                   : 'var(--cinnabar, #c1462f)';
  }

  function render() {
    var root = document.getElementById('syl');
    root.innerHTML = '';

    if (!BOOKS.length) {
      root.appendChild(el('div', 'card',
        '<p>还没有知识点清单文件。数学的已经做好了，语文和英语还在整理。</p>'));
      return;
    }

    BOOKS.forEach(function (S) {
      var used = usedTags(S.subject);
      var byTag = {};
      try {
        (Store.tagStatus(S.subject) || []).forEach(function (t) { byTag[t.tag] = t; });
      } catch (e) {}

      var total = 0, done = 0;
      S.units.forEach(function (u) {
        u.points.forEach(function (p) {
          total++;
          if ((p.tags || []).some(function (t) { return used[t]; })) done++;
        });
      });

      var box = el('div', 'card');
      box.appendChild(el('div', 'seal-title', S.name + '知识点总表'));
      box.appendChild(el('hr', 'rule'));
      box.appendChild(el('p', 'q-sub',
        '来源：<b>' + esc(S.book) + '</b>　共 ' + S.pdfPages + ' 页，逐页读完，一页没跳。<br>' +
        '每条都标了教材页码，<b>「教材原文」是从课本上一字不改抄下来的</b>，不是概括的。'));

      var pct = Math.round(done / total * 100);
      box.appendChild(el('div', 'cov-hero',
        '<div class="big" style="color:' + tone(pct) + '">' + pct + '%</div>' +
        '<div class="lb">共 <b>' + total + '</b> 个知识点　·　已出过题 <b>' + done + '</b> 个　·　' +
        '<b class="bad">' + (total - done) + '</b> 个还没考过</div>'));

      S.units.forEach(function (u) {
        var un = 0, uc = 0;
        u.points.forEach(function (p) {
          un++;
          if ((p.tags || []).some(function (t) { return used[t]; })) uc++;
        });

        var row = el('div', 'u-row');
        var head = el('button', 'u-head');
        head.type = 'button';
        head.innerHTML =
          '<span class="un">' + esc(u.unit) + '</span>' +
          '<span class="up">教材 p' + u.from + '–p' + u.to + '</span>' +
          '<span class="uc' + (uc === un ? ' full' : uc === 0 ? ' zero' : '') + '">' +
          uc + '/' + un + '</span><span class="arw">▾</span>';
        row.appendChild(head);

        var body = el('div', 'u-body');
        u.points.forEach(function (p) {
          var hit = (p.tags || []).filter(function (t) { return used[t]; });
          var n = hit.reduce(function (a, t) { return a + used[t]; }, 0);
          var k = byTag[(p.tags || [])[0]];
          var c = el('div', 'k-card' + (hit.length ? '' : ' gap'));
          c.innerHTML =
            '<div class="kh"><span class="kid">' + esc(p.id) + '</span>' +
            '<span class="kn">' + esc(p.point) + '</span>' +
            '<span class="kp">教材 p' + p.page + '</span>' +
            '<span class="kt">' + (hit.length ? ('已出 ' + n + ' 题') : '<b>没考过</b>') + '</span></div>' +
            (p.text ? '<div class="kx"><span class="lbl">教材原文</span>' + rich(p.text) + '</div>' : '') +
            (p.eg ? '<div class="ke"><span class="lbl">例</span>' + rich(p.eg) + '</div>' : '') +
            '<div class="kg">' + (p.tags || []).map(function (t, i) {
              return '<span class="tg' + (i ? ' alias' : '') + (used[t] ? ' on' : '') + '">' +
                     esc(t) + (i ? '（别名）' : '') + '</span>';
            }).join('') + '</div>' +
            (k ? '<div class="kk">润润：做过 ' + k.tries + ' 次，错 ' + k.wrong + ' 次' +
                 (k.open ? '　<b class="bad">还有 ' + k.open + ' 道没攻克</b>' : '　已攻克 ✓') + '</div>' : '');
          body.appendChild(c);
        });
        row.appendChild(body);
        head.onclick = function () { row.classList.toggle('open'); };
        box.appendChild(row);
      });

      root.appendChild(box);
    });
  }

  function boot() {
    var root = document.getElementById('syl');
    root.innerHTML = '<div class="card loading">正在读取…</div>';
    if (window.Store && Store.boot) {
      Store.boot((window.PROFILE && PROFILE.name) || '')
        .then(render)
        .catch(function () { try { Store.load(); } catch (e) {} render(); });
    } else render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
