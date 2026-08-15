/* ============================================================
   nextpaper.js —— 循环测试：根据上一轮的错题，拼出下一轮卷子

   组卷规则（页面上会把配比明明白白列出来）：
     ① <b>同知识点的新题</b> —— 错哪个知识点，就在那个知识点上出<b>别的题</b>。
        <b>不把原题复制一遍再做</b>：原题重做很可能只是记住了那个答案，
        证明不了学会没有。换一道题做对了，才算真的会。
     ② 随机补充           —— 从整个题库里随机抽 10~20%，每轮抽的都不一样，
        防止只盯着错题、别的地方生疏。
     ③ 防遗忘抽查         —— 从早就攻克的题里再抽一两道回头看。

   一直循环到所有知识点都攻克为止：
     做完这一轮，还错的知识点进下一轮，直到错题清零。

   ⚠️ 万一某个知识点的题库里<b>没有别的题了</b>（只有原来那一道），
      才会退回用原题，并在卷子上注明 —— 这种情况说明该给这个知识点补题了。

   题目全部来自已有的九份卷子（题库），不凭空造题。
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

    // —— 找出「还没攻克的知识点」，注意是<b>知识点</b>，不是题 ——
    var wrongIds = {}, weakTags = {};
    Object.keys(st).forEach(function (k) {
      var m = st[k];
      if (m.wrong > 0 && m.streak < 2) {
        wrongIds[m.qid] = 1;
        weakTags[canon(m.tag)] = (weakTags[canon(m.tag)] || 0) + 1;
      }
    });
    var tagList = Object.keys(weakTags);

    // ① 同知识点的<b>新题</b>：明确排除做错的那些原题
    //    优先没做过的，其次做过但还没稳住的（但都不是原来错的那道）
    var reused = [];                    // 记下哪些知识点被迫用了原题
    var g1 = [];
    var perTag = {};
    tagList.forEach(function (t) {
      var same = bank.filter(function (b) {
        return canon(b.tag) === t && !used[b.qid] && !wrongIds[b.qid];
      });
      var fresh = shuffle(same.filter(function (b) { return !st[b.qid]; }), seed + t.length);
      var again = shuffle(same.filter(function (b) { return st[b.qid]; }), seed + t.length + 1);
      var pool = fresh.concat(again);

      // 每个薄弱知识点给 3 道新题 —— 一道说明不了问题，太多又堆成一科
      var want = 3, got = 0;
      for (var i = 0; i < pool.length && got < want; i++) {
        if (used[pool[i].qid]) continue;
        used[pool[i].qid] = 1; got++;
        g1.push(Object.assign({}, pool[i], { pick: '同知识点新题' }));
      }

      // 题库里这个知识点没有别的题了，只能退回原题，并记下来提醒补题
      if (got === 0) {
        var orig = bank.filter(function (b) { return wrongIds[b.qid] && canon(b.tag) === t && !used[b.qid]; });
        if (orig.length) {
          used[orig[0].qid] = 1;
          g1.push(Object.assign({}, orig[0], { pick: '原题（题库暂无同知识点新题）', fallback: true }));
          reused.push(t);
        }
      }
      perTag[t] = got;
    });

    // ② 随机补充：整个题库里随机抽 10~20%，每轮抽到的都不一样
    //    种子跟着轮次走 —— 同一轮反复刷新是同一份卷子，换一轮就换一批题
    //    ⚠️ 必须排除 wrongIds：不然做错的原题会被当成「随机补充」抽回来，
    //       等于绕过了「不重考原题」这条规矩。
    var rest = bank.filter(function (b) { return !used[b.qid] && !wrongIds[b.qid]; });
    var wantMore = Math.max(3, Math.round(g1.length * 0.15));
    var g2 = take(shuffle(rest, seed + 977), wantMore, '随机补充');

    // ③ 防遗忘：早就攻克的题里抽一两道回头看
    var solid = bank.filter(function (b) {
      return st[b.qid] && st[b.qid].streak >= 2 && !used[b.qid];
    });
    var g3 = take(shuffle(solid, seed + 1493), Math.min(3, Math.round(g1.length * 0.2)), '防遗忘抽查');

    return {
      groups: [g1, g2, g3], round: rounds + 1, bankSize: bank.length,
      weakTags: tagList, reused: reused
    };
  }

  /* ---------- 拼成 exam.js 认识的卷子结构 ---------- */
  function toPaper(subject, c) {
    var S = SUB[subject];
    var LABEL = [
      { name: '一、上次错的那些知识点，换成新题再来',
        hint: '这些题考的是<b>你上一轮做错的知识点</b>，但<b>题目全是新的</b>——' +
              '不是把原来那道再抄一遍。<br>' +
              '<b>换一道题也做对了，这个知识点才算真的过关。</b>' },
      { name: '二、随机补充',
        hint: '从整个题库里随机抽的，每一轮抽到的都不一样。<br>' +
              '只盯着错题练，别的地方容易生疏。' },
      { name: '三、回头看看还记得吗',
        hint: '这些题以前已经攻克了，隔一段时间再确认一次。' }
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
      intro: '这份卷子是<b>照着你上一轮错的知识点</b>拼出来的。<br>' +
             '第一大题<b>不是把原来那些题再抄一遍</b>，而是同一个知识点<b>换成了新的题目</b>——' +
             '原题做对了可能只是记住了答案，<b>换一道也做对，才算真的学会。</b>',
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
    var names = ['同知识点新题', '随机补充', '防遗忘抽查'];
    var tips = ['针对上一轮错的 <b>' + (c.weakTags || []).length + ' 个知识点</b>，出的都是新题（不是原题重做）',
                '从整个题库随机抽，每轮不同，防止顾此失彼',
                '早已攻克的题，回头确认一次'];
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

    if (c.reused && c.reused.length) {
      var warn = document.createElement('div');
      warn.className = 'save-bar warn';
      warn.style.marginTop = '12px';
      warn.innerHTML = '⚠️ 这几个知识点<b>题库里暂时没有别的题</b>，只能先用原题：<b>' +
                       c.reused.join('、') + '</b>。<br>' +
                       '（这说明该给它们补几道新题了 —— 告诉老师一声。）';
      box.appendChild(warn);
    }

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
