/* ============================================================
   rounds.js —— 一套一套往下推的卷子

   流程（三科完全一样）：

     第 1 卷【全知识点卷】
       把这本书<b>全部知识点</b>各出一道，其中 25% 的知识点出 2~3 道
       —— 同一个知识点考两三次，才知道是真会还是蒙对的
         ↓ 做完
     第 1 错题集   做错的题 + 它们背后的知识点
         ↓
     第 2 卷【第 1 错题卷】
       ① 第 1 错题集里那些知识点，<b>重新出的新题</b>（不是原题）
       ② 附加 25% 从<b>做对过的题</b>里随机抽的，用来巩固
         ↓ 做完
     第 2 错题集 → 第 3 卷【第 2 错题卷】 → …

     一直到错题集清空为止。

   ⚠️ 错题卷里<b>不放原题</b>。原题再做一遍，孩子可能只是记住了那个答案，
      证明不了学会。同一个知识点换道题做对，才算真的过关。
   ============================================================ */
(function () {
  'use strict';

  var SUB = {
    math:    { name: '数学', icon: '📐' },
    chinese: { name: '语文', icon: '📖' },
    english: { name: '英语', icon: '🔤' }
  };
  var MULTI_RATE = 0.25;      // 全知识点卷里，有多少比例的知识点出 2~3 道
  var REINFORCE  = 0.25;      // 错题卷里附加多少比例的「做对过的题」

  function canon(tag) {
    var all = [window.SYLLABUS_MATH, window.SYLLABUS_CHINESE, window.SYLLABUS_ENGLISH];
    for (var i = 0; i < all.length; i++) {
      if (all[i] && all[i].canon) { var a = all[i].canon(tag); if (a !== tag) return a; }
    }
    return tag;
  }

  /* 这一科的全部知识点（按教材顺序） */
  function allTags(subject) {
    var S = window['SYLLABUS_' + subject.toUpperCase()];
    var out = [];
    if (S) S.units.forEach(function (u) {
      u.points.forEach(function (p) { out.push({ tag: p.tag, unit: u.unit, point: p.point, page: p.page }); });
    });
    return out;
  }

  /* 题库：现不出题的知识点从已有卷子里挑 */
  var BANK = null;
  function bank(subject) {
    if (!BANK) {
      BANK = {};
      (window.PAPERS || []).forEach(function (P) {
        if (!P) return;
        var no = 0;
        P.sections.forEach(function (sec) {
          (sec.groups || [{ items: sec.items, type: sec.type, per: sec.per }]).forEach(function (L) {
            (L.items || []).forEach(function (it) {
              no++;
              (BANK[P.subject] || (BANK[P.subject] = [])).push({
                qid: (P.id || 'p') + '#' + no, subject: P.subject,
                type: L.type || sec.type, q: it.q, o: it.o, a: it.a,
                tag: canon(it.tag || '其他'), why: it.why
              });
            });
          });
        });
      });
    }
    return BANK[subject] || [];
  }

  function rnd(seed) {
    var s = (seed | 0) || 1;
    return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }
  function shuffle(r, a) {
    var x = a.slice();
    for (var i = x.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = x[i]; x[i] = x[j]; x[j] = t; }
    return x;
  }

  /* 出一道这个知识点的题：能现出就现出，否则从题库挑没用过的。
     allowReuse=true 时，实在出不了新的就把用过的拿回来，并打上 reused 标记。 */
  function makeQ(subject, tag, seed, used, allowReuse) {
    var first = null;
    if (window.GEN && GEN.can(tag)) {
      // 概念类知识点的变体本来就少，多试几个种子
      for (var k = 0; k < 60; k++) {
        var g = GEN.one(tag, seed + k * 7919);
        if (!g) break;
        if (!first) first = g;
        if (used['q:' + g.q]) continue;
        used['q:' + g.q] = 1;
        g.qid = 'gen:' + tag + ':' + ((seed + k * 7919) % 1000000);
        g.subject = subject;
        return g;
      }
    }
    var all = bank(subject).filter(function (b) { return b.tag === tag; });
    var pool = all.filter(function (b) { return !used[b.qid] && !used['q:' + b.q]; });
    if (pool.length) {
      var b2 = pool[Math.abs(seed) % pool.length];
      used[b2.qid] = 1; used['q:' + b2.q] = 1;
      return b2;
    }
    /* 这个知识点<b>已经没有新题可出了</b>（变体用光 / 题库里就那么几道）。
       与其让它在错题卷里缺席，不如把旧题拿回来，但明确标出来 ——
       报表会点名这些知识点，提醒该给它们补题。 */
    if (!allowReuse) return null;
    var back = first || all[Math.abs(seed) % (all.length || 1)];
    if (!back) return null;
    back = Object.assign({}, back, { reused: true });
    back.qid = back.qid || ('gen:' + tag + ':reuse');
    back.subject = subject;
    return back;
  }

  /* ══════════ 第 1 卷：全知识点卷 ══════════ */
  function buildFull(subject, seed) {
    var tags = allTags(subject);
    var r = rnd(seed || 20260101);
    var used = {}, out = [];

    // 哪些知识点要出 2~3 道 —— 随机挑 25%
    var multi = {};
    shuffle(r, tags.map(function (t) { return t.tag; }))
      .slice(0, Math.round(tags.length * MULTI_RATE))
      .forEach(function (t) { multi[t] = 2 + (r() < 0.4 ? 1 : 0); });   // 2 或 3 道

    tags.forEach(function (t, i) {
      var n = multi[t.tag] || 1;
      for (var k = 0; k < n; k++) {
        var q = makeQ(subject, t.tag, (seed || 1) + i * 104729 + k * 13, used);
        if (q) { q.unit = t.unit; out.push(q); }
      }
    });

    return {
      kind: 'full', round: 1, subject: subject,
      title: SUB[subject].name + '第 1 卷 · 全知识点',
      intro: '这本书的 <b>' + tags.length + ' 个知识点全部都在这套题里</b>，' +
             '其中有 <b>' + Object.keys(multi).length + ' 个知识点出了 2~3 道</b> —— ' +
             '同一个知识点考两三次，才知道是真会了还是碰巧蒙对。<br>' +
             '<b>做不完可以停，进度会存着，下次接着做。</b>',
      items: out, tagCount: tags.length, multiCount: Object.keys(multi).length
    };
  }

  /* ══════════ 第 N 错题卷 ══════════ */
  function buildFix(subject, wrongTags, seed, prevN, avoid) {
    var r = rnd(seed || Date.now());
    var used = {}, out = [];

    /* 上一卷出现过的题，全部标成「已用」——
       否则从题库挑的时候会把做错的原题原样挑回来。
       生成的题靠题面去重，题库的题靠 qid 去重，两条都要。 */
    (avoid || []).forEach(function (q) {
      if (q.qid) used[q.qid] = 1;
      if (q.q) used['q:' + q.q] = 1;
    });

    // ① 错题背后的知识点，每个出 2 道<b>新题</b>
    var reused = [];
    shuffle(r, wrongTags).forEach(function (tag) {
      var got = 0;
      for (var k = 0; k < 2; k++) {
        // 第一道允许兜底（这个知识点必须出现在卷子里），第二道出不来就算了
        var q = makeQ(subject, tag, (seed || 1) + tag.length * 7919 + k * 131 + Math.floor(r() * 9999),
                      used, k === 0);
        if (q) {
          q.from = 'wrong'; out.push(q); got++;
          if (q.reused && reused.indexOf(tag) < 0) reused.push(tag);
        }
      }
    });

    /* ② 附加约 25% 的巩固题：从<b>做对过的</b>知识点里抽。
       注意分母 —— 要让巩固题占「最终整卷」的 25%，
       就得按 out/(1-25%) 算，不是按 out×25%（那样只占 20%）。
       另外做对过的知识点可能不够，不够就从<b>没考错的其余知识点</b>里补。 */
    var okTags = correctTags(subject).filter(function (t) { return wrongTags.indexOf(t) < 0; });
    if (okTags.length < 4) {
      var rest = allTags(subject).map(function (x) { return x.tag; })
        .filter(function (t) { return wrongTags.indexOf(t) < 0 && okTags.indexOf(t) < 0; });
      okTags = okTags.concat(shuffle(r, rest));
    }
    var want = Math.max(2, Math.round(out.length * REINFORCE / (1 - REINFORCE)));
    var got = 0;
    shuffle(r, okTags).forEach(function (tag) {
      if (got >= want) return;
      var q = makeQ(subject, tag, (seed || 1) + tag.length * 31337 + Math.floor(r() * 9999), used);
      if (q) { q.from = 'review'; out.push(q); got++; }
    });

    var n = prevN + 1;
    return {
      kind: 'fix', round: n, subject: subject, fixOf: prevN,
      title: SUB[subject].name + '第 ' + n + ' 卷 · 第 ' + prevN + ' 错题卷',
      intro: '这一卷针对<b>第 ' + prevN + ' 错题集</b>里的 <b>' + wrongTags.length + ' 个知识点</b>。<br>' +
             '<b>不是把错的原题再做一遍</b> —— 是同一个知识点<b>重新出的新题</b>。' +
             '原题做对了可能只是记住了答案，换道题也做对，才算真的会。<br>' +
             '另外附了 <b>' + out.filter(function (x) { return x.from === 'review'; }).length +
             ' 道以前做对过的知识点的题</b>，用来巩固、防止生疏。',
      items: out,
      wrongTags: wrongTags,
      reusedTags: reused,      // 这些知识点没有新题可出了，该补题
      newCount: out.filter(function (x) { return x.from === 'wrong'; }).length,
      reviewCount: out.filter(function (x) { return x.from === 'review'; }).length
    };
  }

  /* ══════════ 进度：这一科做到第几卷了 ══════════ */

  /* 这一科交过的卷（按顺序）。
     ⚠️ 不要只认 kind —— 早先 recordExam 漏存了 kind，这里就把所有记录都过滤没了，
        错题集算不出来、下一卷永远生成不了，而且一点报错都没有。
        现在加一层兜底：只要带 round 和逐题记录，就当是一卷。 */
  function history(subject) {
    var log = (window.Store && Store.examLog) ? Store.examLog(subject) : [];
    return log.filter(function (r) {
      if (r.kind === 'full' || r.kind === 'fix') return true;
      return !!(r.round && r.items && r.items.length);
    });
  }

  /* 第 N 卷做完后的错题集：做错的题 + 背后的知识点 */
  function wrongSet(subject, n) {
    var h = history(subject);
    var rec = h.filter(function (r) { return r.round === n; }).pop();
    if (!rec) return null;
    var items = (rec.items || []).filter(function (i) { return !i.ok; });
    var tags = [], seen = {};
    items.forEach(function (i) {
      var t = canon(i.tag || '其他');
      if (!seen[t]) { seen[t] = 1; tags.push(t); }
    });
    return { n: n, rec: rec, items: items, tags: tags };
  }

  /* 做对过的知识点（用来抽巩固题） */
  function correctTags(subject) {
    var st = {};
    try { st = Store.examStatus(subject) || {}; } catch (e) {}
    var ok = {}, bad = {};
    Object.keys(st).forEach(function (qid) {
      var m = st[qid], t = canon(m.tag || '');
      if (!t) return;
      if (m.lastOk) ok[t] = 1; else bad[t] = 1;
    });
    return Object.keys(ok).filter(function (t) { return !bad[t]; });
  }

  /* 当前该做什么 */
  function next(subject) {
    var h = history(subject);
    if (!h.length) return { todo: 'full', round: 1 };

    var last = h[h.length - 1];
    var ws = wrongSet(subject, last.round);
    if (!ws) return { todo: 'full', round: 1 };
    if (!ws.tags.length) return { todo: 'clear', round: last.round, last: last };
    return { todo: 'fix', round: last.round + 1, prev: last.round, wrongSet: ws, last: last };
  }

  window.ROUNDS = {
    SUB: SUB,
    allTags: allTags, buildFull: buildFull, buildFix: buildFix,
    history: history, wrongSet: wrongSet, next: next, canon: canon,
    correctTags: correctTags
  };
})();
