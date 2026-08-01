/* ============================================================
   summary.js —— 当日掌握情况小结
   按知识点 tag 汇总正确率 → 绿(已掌握) / 黄(还要再练) / 红(明天重点回顾)
   ============================================================ */
(function () {
  'use strict';

  var SUBJ = {
    chinese: { name: '语文', color: 'var(--s-chinese)' },
    math:    { name: '数学', color: 'var(--s-math)' },
    english: { name: '英语', color: 'var(--s-english)' },
    review:  { name: '昨日回顾', color: 'var(--ink-soft)' },
    boss:    { name: 'Boss 战', color: '#2f2822' }
  };

  /**
   * 把一天里所有关卡的答题日志汇总成小结
   * @param {number} dayNum
   * @returns {object} { subjects:[...], bands:{g:[],y:[],r:[]}, comment, totalRight, totalQ }
   */
  function build(dayNum) {
    var rec = Store.dayRec(dayNum);
    var perSubject = {};
    var perTag = {};

    Object.keys(rec.stats).forEach(function (stage) {
      var st = rec.stats[stage];
      if (!st) return;

      // 学科统计（Boss 和回顾单独一行）
      var key = (stage === 'boss' || stage === 'review') ? stage : stage;
      if (!perSubject[key]) perSubject[key] = { right: 0, total: 0, seconds: 0 };
      perSubject[key].right += st.right || 0;
      perSubject[key].total += st.total || 0;
      perSubject[key].seconds += st.seconds || 0;

      // 知识点统计
      (st.log || []).forEach(function (item) {
        (item.tags || []).forEach(function (tag) {
          if (!perTag[tag]) perTag[tag] = { right: 0, total: 0, subject: item.subject };
          perTag[tag].total++;
          if (item.ok) perTag[tag].right++;
        });
      });
    });

    var subjects = Object.keys(perSubject).map(function (k) {
      var s = perSubject[k];
      return {
        key: k,
        name: (SUBJ[k] || { name: k }).name,
        color: (SUBJ[k] || {}).color || 'var(--ink)',
        right: s.right,
        total: s.total,
        pct: s.total ? Math.round((s.right / s.total) * 100) : 0,
        minutes: Math.max(1, Math.round(s.seconds / 60))
      };
    }).sort(function (a, b) {
      var order = ['review', 'chinese', 'math', 'english', 'boss'];
      return order.indexOf(a.key) - order.indexOf(b.key);
    });

    // 三档分类
    var bands = { g: [], y: [], r: [] };
    Object.keys(perTag).forEach(function (tag) {
      var t = perTag[tag];
      var pct = t.total ? (t.right / t.total) * 100 : 0;
      var entry = { tag: tag, right: t.right, total: t.total, pct: Math.round(pct), subject: t.subject };
      if (pct >= 90) bands.g.push(entry);
      else if (pct >= 60) bands.y.push(entry);
      else bands.r.push(entry);
    });
    // 红黄按错得多的排前面
    bands.r.sort(function (a, b) { return a.pct - b.pct; });
    bands.y.sort(function (a, b) { return a.pct - b.pct; });

    var totalRight = subjects.reduce(function (n, s) { return n + s.right; }, 0);
    var totalQ = subjects.reduce(function (n, s) { return n + s.total; }, 0);

    return {
      dayNum: dayNum,
      subjects: subjects,
      bands: bands,
      totalRight: totalRight,
      totalQ: totalQ,
      pct: totalQ ? Math.round((totalRight / totalQ) * 100) : 0,
      comment: comment(subjects, bands),
      at: new Date().toISOString()
    };
  }

  /* 根据实际数据生成一句话点评 —— 说人话，不空洞 */
  function comment(subjects, bands) {
    var core = subjects.filter(function (s) {
      return ['chinese', 'math', 'english'].indexOf(s.key) >= 0 && s.total > 0;
    });
    if (!core.length) return '今天刚开始，把三个关卡都走一遍就知道哪里要加把劲啦。';

    var worst = core.slice().sort(function (a, b) { return a.pct - b.pct; })[0];
    var best = core.slice().sort(function (a, b) { return b.pct - a.pct; })[0];
    var avg = Math.round(core.reduce(function (n, s) { return n + s.pct; }, 0) / core.length);

    var name = window.PROFILE ? PROFILE.name : '你';

    if (avg >= 95 && !bands.r.length) {
      return name + '，今天几乎全对，' + best.name + '尤其稳。这个状态保持住，明天可以挑战难一点的题。';
    }
    if (bands.r.length) {
      // 优先点名"最弱那一科里"的红灯知识点，别出现「数学吃力 → 却让你复习语文的字音」这种前言不搭后语
      var inWorst = bands.r.filter(function (b) { return b.subject === worst.key; });
      if (inWorst.length) {
        return worst.name + '今天有点吃力（' + worst.pct + '%），明天开场的「昨日回顾」会先带你把<b>' +
               inWorst[0].tag + '</b>过一遍，先把这个弄明白，别急着往前赶。';
      }
      return '今天有 ' + bands.r.length + ' 个知识点亮了红灯，最要紧的是<b>' + bands.r[0].tag +
             '</b>。它们已经进了错题本，明天开场会先考你一遍，连着答对两次就算真会了。';
    }
    if (avg >= 85) {
      return '整体不错（平均 ' + avg + '%），' + best.name + '最棒。' +
             (bands.y.length ? '黄灯那几个知识点再多念两遍就彻底记住了。' : '继续保持！');
    }
    return name + '，今天平均 ' + avg + '%，' + worst.name + '还需要再练练。' +
           '不用急，明天回顾环节会把今天错的题再出一遍，答对两次就算真会了。';
  }

  /* ============ 渲染成 DOM ============ */
  function render(sum) {
    var el = Quiz.el, esc = Quiz.esc;
    var box = el('div');

    // 成绩表
    var tbl = el('table', 'score-table');
    tbl.innerHTML = '<thead><tr><th>科目</th><th>正确率</th><th>题数</th><th>用时</th></tr></thead>';
    var tb = el('tbody');
    sum.subjects.forEach(function (s) {
      var tr = el('tr');
      tr.innerHTML =
        '<td><span class="s-dot" style="background:' + s.color + '"></span>' + esc(s.name) + '</td>' +
        '<td class="pct" style="color:' + pctColor(s.pct) + '">' + s.pct + '%</td>' +
        '<td class="num">' + s.right + ' / ' + s.total + '</td>' +
        '<td class="num">' + s.minutes + ' 分钟</td>';
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    box.appendChild(tbl);

    // 三档
    var m = el('div', 'mastery');
    band(m, 'g', '🟢', '已掌握', sum.bands.g, '这些今天全对或几乎全对，记住了！');
    band(m, 'y', '🟡', '还要再练', sum.bands.y, '有点晃，明天再碰一次就稳了。');
    band(m, 'r', '🔴', '明天重点回顾', sum.bands.r, '这些已经放进错题本，明天开场先练它们。');
    box.appendChild(m);

    // 点评
    var c = el('div', 'comment');
    c.innerHTML = '<b>老师说：</b>' + sum.comment;
    box.appendChild(c);

    return box;

    function band(parent, cls, lamp, title, list, hint) {
      if (!list.length) return;
      var d = el('div', 'm-band ' + cls);
      d.appendChild(el('div', 'lamp', lamp));
      var body = el('div', 'body');
      body.appendChild(el('b', '', title + '（' + list.length + '）'));
      var span = el('span');
      span.innerHTML = list.slice(0, 8).map(function (x) {
        return '<em>' + esc(x.tag) + ' ' + x.right + '/' + x.total + '</em>';
      }).join('') + (list.length > 8 ? '…' : '') +
        '<br><small style="color:var(--ink-soft)">' + hint + '</small>';
      body.appendChild(span);
      d.appendChild(body);
      parent.appendChild(d);
    }
  }

  function pctColor(p) {
    if (p >= 90) return 'var(--grass)';
    if (p >= 60) return 'var(--gold-deep)';
    return 'var(--cinnabar)';
  }

  window.Summary = { build: build, render: render, pctColor: pctColor, SUBJ: SUBJ };
})();
