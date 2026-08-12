/* ============================================================
   nextpaper.js —— 循环测试：根据上一轮的错题，拼出下一轮卷子

   组卷规则（页面上会把配比明明白白列出来）：
     ① 未攻克的错题      —— 原题重考，100% 带入
     ② 同知识点的变式题  —— 错哪个知识点，就在那个知识点上再给几道<b>不同的</b>题
     ③ 新题              —— 没考过的题，约占两成，防止只盯着错题、别的忘了
     ④ 防遗忘抽查        —— 从早就做对的题里随机抽几道

   为什么一定要有 ②：
     只把错题原样再考一遍，孩子很可能是<b>记住了那个答案</b>，
     而不是学会了那个方法。同知识点的变式题做对了，才算真的会。
     所以「攻克」的判定看的是变式题，不是原题。

   题目全部来自已有的四份卷子（题库），不凭空造题。
   ============================================================ */
(function () {
  'use strict';

  var SUB = {
    math:    { name: '数学', icon: '📐' },
    chinese: { name: '语文', icon: '📖' },
    english: { name: '英语', icon: '🔤' }
  };

  /* tag 归一 —— 同一个知识点在不同卷子里可能叫不同名字
     （「乘法·中间有0」和「多位数乘一位数·中间有0」是同一回事）。
     不归一的话，按 tag 找变式题就会漏掉半个题库。 */
  function canon(tag) {
    var S = window.SYLLABUS_MATH, T = window.SYLLABUS_CHINESE, E = window.SYLLABUS_ENGLISH;
    if (S && S.canon) { var a = S.canon(tag); if (a !== tag) return a; }
    if (T && T.canon) { var b = T.canon(tag); if (b !== tag) return b; }
    if (E && E.canon) { var c = E.canon(tag); if (c !== tag) return c; }
    return tag;
  }

  /* ---------- 题库：把所有卷子摊成一道道带 qid 的题 ---------- */
  function buildBank() {
    var bank = [];
    (window.PAPERS || []).forEach(function (P) {
      if (!P) return;
      var no = 0;
      P.sections.forEach(function (sec) {
        (sec.groups || [{ items: sec.items, type: sec.type, per: sec.per }])
          .forEach(function (L) {
            (L.items || []).forEach(function (it) {
              no++;
              bank.push({
                qid: (P.id || 'paper') + '#' + no,
                subject: P.subject, paper: P.id, paperTitle: P.title,
                type: L.type || sec.type, per: L.per || sec.per,
                secName: sec.name,
                q: it.q, o: it.o, a: it.a,
                tag: canon(it.tag || '其他'), rawTag: it.tag || '其他',
                why: it.why, unit: it.unit, audio: it.audio
              });
            });
          });
      });
    });
    return bank;
  }

  function shuffle(a, seed) {
    // 固定种子的洗牌：同一轮反复刷新，卷子是同一份，不会每次都变
    var s = seed || 1;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }

  /* ---------- 组卷 ---------- */
  function compose(subject) {
    var bank = buildBank().filter(function (b) { return b.subject === subject; });
    var st = Store.examStatus(subject);
    var rounds = Store.examLog(subject).length;
    var seed = rounds * 7919 + subject.length;

    var used = {};
    function take(list, n, why) {
      var out = [];
      for (var i = 0; i < list.length && out.length < n; i++) {
        var b = list[i];
        if (used[b.qid]) continue;
        used[b.qid] = 1;
        out.push(Object.assign({}, b, { pick: why }));
      }
      return out;
    }

    // ① 未攻克的错题
    var openIds = {};
    var wrongs = Object.keys(st).map(function (k) { return st[k]; })
      .filter(function (m) { return m.wrong > 0 && m.streak < 2; });
    wrongs.forEach(function (m) { openIds[m.qid] = 1; });
    var g1 = take(bank.filter(function (b) { return openIds[b.qid]; }),
                  99, '错题重考');

    // 出问题的知识点
    var weakTags = {};
    g1.forEach(function (b) { weakTags[canon(b.tag)] = (weakTags[canon(b.tag)] || 0) + 1; });

    // ② 同知识点的变式题：优先没做过的，其次做过但没稳住的
    var variants = bank.filter(function (b) {
      return weakTags[canon(b.tag)] && !used[b.qid];
    });
    var fresh = variants.filter(function (b) { return !st[b.qid]; });
    var again = variants.filter(function (b) { return st[b.qid] && st[b.qid].streak < 2; });
    // 每个薄弱知识点最多补 3 道变式，别把一份卷子堆成一个知识点
    var perTag = {}, pool = shuffle(fresh, seed).concat(shuffle(again, seed + 1));
    var g2 = [];
    pool.forEach(function (b) {
      if ((perTag[b.tag] || 0) >= 3) return;
      if (used[b.qid]) return;
      perTag[b.tag] = (perTag[b.tag] || 0) + 1;
      used[b.qid] = 1;
      g2.push(Object.assign({}, b, { pick: '同知识点变式' }));
    });

    // ③ 新题：没做过的，优先没考过的知识点，约占两成
    var doneTags = {};
    Object.keys(st).forEach(function (k) { if (st[k].tag) doneTags[canon(st[k].tag)] = 1; });
    var never = bank.filter(function (b) { return !st[b.qid] && !used[b.qid]; });
    var newTagFirst = never.filter(function (b) { return !doneTags[canon(b.tag)]; })
                    .concat(never.filter(function (b) { return doneTags[canon(b.tag)]; }));
    var wantNew = Math.max(3, Math.round((g1.length + g2.length) * 0.2));
    var g3 = take(shuffle(newTagFirst, seed + 2), wantNew, '新题');

    // ④ 防遗忘：早就做对的，抽几道回头看看还记得吗
    var solid = bank.filter(function (b) {
      return st[b.qid] && st[b.qid].streak >= 2 && !used[b.qid];
    });
    var g4 = take(shuffle(solid, seed + 3), Math.min(5, Math.round(g1.length * 0.3)), '防遗忘抽查');

    return { groups: [g1, g2, g3, g4], round: rounds + 1, bankSize: bank.length };
  }

  /* ---------- 拼成 exam.js 认识的卷子结构 ---------- */
  function toPaper(subject, c) {
    var S = SUB[subject];
    var LABEL = [
      { name: '一、上次错的，再做一遍', pick: '错题重考',
        hint: '这些题上一轮做错了。<b>先别急着写答案，想想上次是哪一步出的问题。</b>' },
      { name: '二、同一个知识点，换个问法', pick: '同知识点变式',
        hint: '这些题考的知识点和上面一样，但<b>题目是新的</b>。<br>' +
              '上面那些做对了只能说明记住了答案，<b>这些做对了才算真的会</b>。' },
      { name: '三、新题', pick: '新题',
        hint: '没考过的内容。只盯着错题练，别的地方容易生疏。' },
      { name: '四、回头看看还记得吗', pick: '防遗忘抽查',
        hint: '这些题以前做对过，隔一段时间再确认一次。' }
    ];

    var sections = [];
    LABEL.forEach(function (L, i) {
      var list = c.groups[i];
      if (!list.length) return;
      sections.push({
        name: L.name, hint: L.hint,
        groups: [{
          label: '', per: null, type: null,
          items: list.map(function (b) {
            return {
              src: b.qid,                    // 关键：带上原始出处，历史才连得上
              q: b.q, o: b.o, a: b.a, tag: b.tag, why: b.why,
              unit: b.unit, audio: b.audio,
              _type: b.type, _per: b.per
            };
          })
        }]
      });
    });

    // exam.js 是按 section/group 取 type 和 per 的，但这里每道题的
    // 题型和分值都不一样 —— 所以按「题型+分值」再切一层小组。
    var fixed = [];
    sections.forEach(function (sec) {
      var items = sec.groups[0].items;
      var buckets = [], key = {};
      items.forEach(function (it) {
        var k = it._type + '|' + it._per;
        if (!key[k]) { key[k] = { type: it._type, per: it._per, items: [] }; buckets.push(key[k]); }
        key[k].items.push(it);
      });
      fixed.push({
        name: sec.name, hint: sec.hint,
        groups: buckets.map(function (b, i) {
          return {
            label: buckets.length > 1
              ? (b.type === 'choice' || b.type === 'listen' ? '选择题' : '填空／计算') + '（每题 ' + b.per + ' 分）'
              : '',
            type: b.type, per: b.per, items: b.items
          };
        })
      });
    });

    var total = 0, n = 0;
    fixed.forEach(function (s) { s.groups.forEach(function (g) { total += g.per * g.items.length; n += g.items.length; }); });

    return {
      id: subject + '-r' + c.round,
      subject: subject,
      round: c.round,
      title: S.name + '第 ' + c.round + ' 轮 · 错题攻坚卷',
      subtitle: '根据上一轮错题自动生成　·　' + n + ' 题 / ' + total + ' 分',
      totalMinutes: Math.max(20, Math.round(n * 1.2)),
      intro: '这份卷子是<b>照着你上一轮的错题拼出来的</b>，不是随便出的。' +
             '第一大题是原来错的那些，第二大题是<b>同一个知识点的新题目</b>——' +
             '两边都做对了，这个知识点才算真正过关。',
      sections: fixed,
      _stat: { n: n, total: total, groups: c.groups.map(function (g) { return g.length; }) }
    };
  }

  /* ---------- 组卷预览页 ---------- */
  function preview(subject, paper, c) {
    var S = SUB[subject];
    var root = document.getElementById('paper');
    root.innerHTML = '';
    var box = document.createElement('div');
    box.className = 'card';
    var names = ['错题重考', '同知识点变式', '新题', '防遗忘抽查'];
    var tips = ['上一轮做错、还没攻克的原题',
                '同一个知识点换个问法 —— 这部分才真正检验掌握',
                '没考过的内容，防止顾此失彼',
                '早就做对的题，回头确认一次'];
    var rows = c.groups.map(function (g, i) {
      if (!g.length) return '';
      return '<tr><td>' + names[i] + '</td><td class="num"><b>' + g.length + '</b> 题</td>' +
             '<td class="dim">' + tips[i] + '</td></tr>';
    }).join('');

    box.innerHTML =
      '<div class="seal-title">' + S.icon + ' ' + paper.title + '</div><hr class="rule">' +
      '<p class="q-sub">' + paper.intro + '</p>' +
      '<table class="hist"><thead><tr><th>来源</th><th>题量</th><th>说明</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<p class="q-sub" style="margin-top:14px">合计 <b>' + paper._stat.n + '</b> 题、<b>' +
      paper._stat.total + '</b> 分，题目全部来自已做过的卷子题库（共 ' + c.bankSize + ' 道）。</p>';

    var row = document.createElement('div');
    row.className = 'row';
    row.style.marginTop = '18px';
    var go = document.createElement('button');
    go.className = 'btn btn-primary';
    go.type = 'button';
    go.style.fontSize = '18px';
    go.textContent = '开始做这份卷子 →';
    go.onclick = function () { start(paper); };
    row.appendChild(go);
    var back = document.createElement('button');
    back.className = 'btn btn-ghost';
    back.type = 'button';
    back.textContent = '← 回错题本';
    back.onclick = function () { location.href = 'wrongbook.html'; };
    row.appendChild(back);
    box.appendChild(row);
    root.appendChild(box);
  }

  function start(paper) {
    window.EXAM_PAPER = paper;
    document.getElementById('paper').innerHTML = '';
    var s = document.createElement('script');
    s.src = 'js/exam.js';
    document.body.appendChild(s);
  }

  /* ---------- 启动 ---------- */
  function boot() {
    var subject = (location.search.match(/subject=(\w+)/) || [])[1] || 'math';
    var root = document.getElementById('paper');
    if (!SUB[subject]) { root.innerHTML = '<div class="card">不认识的科目：' + subject + '</div>'; return; }
    root.innerHTML = '<div class="card loading">正在读取错题记录，准备组卷…</div>';

    Store.boot((window.PROFILE && PROFILE.name) || '')
      .catch(function () { Store.load(); })
      .then(function () {
        var c = compose(subject);
        if (!c.groups[0].length) {
          root.innerHTML =
            '<div class="card empty"><div class="big">🎉</div>' +
            '<h2>' + SUB[subject].name + '没有待攻克的错题</h2>' +
            '<p>上一轮错的题都已经连对 2 次，攻克了。<br>' +
            '可以直接去做整册总测，或者等我出新的卷子。</p>' +
            '<div class="row"><a class="btn btn-primary" href="wrongbook.html">← 回错题本</a></div></div>';
          return;
        }
        preview(subject, toPaper(subject, c), c);
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
