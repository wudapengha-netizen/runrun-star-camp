/* ============================================================
   gen2.js —— 第二层出题机：从知识点总表自动派生题目

   gen.js 是一个知识点一个手写生成器，适合<b>算式类</b>。
   但语文英语有一百多个知识点，一个个写不现实，也没必要 ——
   因为<b>总表里已经存了教材原文</b>，题目可以从原文自动派生：

     ① 诗词默写：把原文按句切开，随机挖 1~2 句让孩子补
        （6 首古诗 + 7 处日积月累 + 文言文，每首能出十几种挖法）
     ② 英语拼读：总表里存着「A is for /æ/：apple, bag」这种原文，
        能派生出「哪个字母发 /æ/」「apple 开头什么音」等好几种问法
     ③ 英语词汇：words-en.js 有 105 个单词的拼写和中文，
        中→英、英→中、首字母提示，三种问法随机
     ④ 教材原话判断：把原文里的关键词换掉造出错句，
        让孩子判断对错 —— 每个知识点都能这么出

   ⚠️ 派生出的题，答案<b>直接来自总表原文</b>，不是我另写的，
      所以只要总表是对的（逐页抄的教材），题就是对的。
   ============================================================ */
(function () {
  'use strict';
  if (!window.GEN) { console.warn('gen2 需要先加载 gen.js'); return; }

  function mkRnd(seed) {
    var s = (seed | 0) || 1;
    return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }
  function ri(rnd, lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }
  function pick(rnd, a) { return a[Math.floor(rnd() * a.length)]; }
  function shuffle(rnd, a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }
  function choice(rnd, right, wrongs) {
    var o = shuffle(rnd, [right].concat(wrongs));
    return { o: o, a: o.indexOf(right) };
  }
  function strip(s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, ''); }

  /* 从三本总表里按 tag 找知识点 */
  var POINTS = null;
  function points() {
    if (POINTS) return POINTS;
    POINTS = {};
    [window.SYLLABUS_MATH, window.SYLLABUS_CHINESE, window.SYLLABUS_ENGLISH].forEach(function (S) {
      if (!S) return;
      S.units.forEach(function (u) {
        u.points.forEach(function (p) { POINTS[p.tag] = { p: p, unit: u.unit, book: S.name }; });
      });
    });
    return POINTS;
  }

  /* ══════════ ① 诗词 / 文言文默写 ══════════ */

  /* 把「远上寒山石径斜，白云生处有人家。」切成句 */
  function lines(text) {
    return strip(text).split(/(?<=[，。！？；])/)
      .map(function (x) { return x.trim(); })
      .filter(function (x) { return x.replace(/[，。！？；]/g, '').length >= 3; });
  }

  function poemGen(tag, title, author) {
    return function (rnd) {
      var P = points()[tag];
      if (!P || !P.p.text) return null;
      var ls = lines(P.p.text);
      if (ls.length < 2) return null;

      var full = ls.join('');
      var n = ls.length >= 4 ? ri(rnd, 1, 2) : 1;            // 挖 1~2 句
      var idx = shuffle(rnd, ls.map(function (_, i) { return i; })).slice(0, n).sort(function (a, b) { return a - b; });
      var shown = ls.map(function (l, i) {
        return idx.indexOf(i) >= 0 ? '___ ' + l.slice(-1) : l;
      }).join('');
      var ans = idx.map(function (i) { return [ls[i].replace(/[，。！？；]$/, '')]; });

      return { type: 'fill',
        q: '默写《' + title + '》' + (author ? '（' + author + '）' : '') + '：<br>' + shown,
        a: ans, tag: tag,
        why: '全文：<b>' + full + '</b><br>' +
             (P.p.eg ? P.p.eg : '') + '<br>（教材 p' + P.p.page + '）' };
    };
  }

  /* 也可以反过来：给一句，问出自哪首 */
  function poemFrom(tags) {
    return function (rnd) {
      var Ps = points();
      var have = tags.filter(function (t) { return Ps[t] && Ps[t].p.text; });
      if (have.length < 4) return null;
      var t = pick(rnd, have);
      var ls = lines(Ps[t].p.text);
      var line = pick(rnd, ls).replace(/[，。！？；]$/, '');
      var name = function (x) { return strip(Ps[x].p.point).replace(/^.*《/, '').replace(/》.*$/, '') || x; };
      var wrongs = shuffle(rnd, have.filter(function (x) { return x !== t; })).slice(0, 3).map(name);
      var c = choice(rnd, name(t), wrongs);
      return { type: 'choice', q: '「<b>' + line + '</b>」这一句出自——',
        o: c.o, a: c.a, tag: '文学常识·古诗作者',
        why: '出自《' + name(t) + '》。<br>全文：<b>' + ls.join('') + '</b>（教材 p' + Ps[t].p.page + '）' };
    };
  }

  /* ══════════ ② 英语自然拼读 ══════════ */

  /* 解析 "A is for /æ/：apple, bag｜B is for /b/：bed, Bob" */
  function parsePhonics(text) {
    var out = [];
    strip(text).split('｜').forEach(function (seg) {
      var m = seg.match(/([A-Za-z])\s*(?:is for|goes with u,?)\s*(\/[^/]+\/)\s*[：:]\s*(.+)/);
      if (!m) return;
      out.push({ letter: m[1].toUpperCase(), sound: m[2],
                 words: m[3].split(/[,，]/).map(function (x) { return x.trim(); }).filter(Boolean) });
    });
    return out;
  }
  function allPhonics() {
    var out = [];
    ['拼读·AaDd', '拼读·EeHh', '拼读·IiLl', '拼读·MmPp', '拼读·QqUu', '拼读·VvZz'].forEach(function (t) {
      var P = points()[t];
      if (P && P.p.text) parsePhonics(P.p.text).forEach(function (x) { x.tag = t; out.push(x); });
    });
    return out;
  }

  function phonicsGen(tag) {
    return function (rnd) {
      var P = points()[tag];
      if (!P || !P.p.text) return null;
      var set = parsePhonics(P.p.text);
      if (!set.length) return null;
      var all = allPhonics();
      var it = pick(rnd, set);
      var k = ri(rnd, 0, 2);

      if (k === 0) {   // 字母 → 音
        // ⚠️ C 和 K 都发 /k/，干扰项必须<b>按音去重</b>，否则会出现两个一样的选项
        var seenS = {}; seenS[it.sound] = 1;
        var others = [];
        shuffle(rnd, all).forEach(function (x) {
          if (others.length >= 3 || seenS[x.sound]) return;
          seenS[x.sound] = 1; others.push(x.sound);
        });
        var c = choice(rnd, it.sound, others);
        return { type: 'choice', q: '字母 <b>' + it.letter + '</b> 发什么音？', o: c.o, a: c.a, tag: tag,
          why: '课本歌谣：<b>' + it.letter + ' is for ' + it.sound + '</b>，例词 <b>' +
               it.words.join(', ') + '</b>。（Appendix 2，教材 p' + P.p.page + '）' };
      }
      if (k === 1) {   // 音 → 例词
        var w = pick(rnd, it.words);
        var ow = shuffle(rnd, all.filter(function (x) { return x.letter !== it.letter; }))
          .slice(0, 3).map(function (x) { return x.words[0]; });
        var c2 = choice(rnd, w, ow);
        return { type: 'choice', q: '下面哪个词，开头的音是 <b>' + it.sound + '</b>？', o: c2.o, a: c2.a, tag: tag,
          why: '<b>' + it.letter + ' is for ' + it.sound + '</b>：' + it.words.join(', ') + '。<br>' +
               '（Appendix 2 歌谣原文，教材 p' + P.p.page + '）' };
      }
      // 例词 → 字母
      var w2 = pick(rnd, it.words);
      var ol = shuffle(rnd, all.filter(function (x) { return x.letter !== it.letter; }))
        .slice(0, 3).map(function (x) { return x.letter + x.letter.toLowerCase(); });
      var c3 = choice(rnd, it.letter + it.letter.toLowerCase(), ol);
      return { type: 'choice', q: '<b>' + w2 + '</b> 开头的音，是哪个字母发的？', o: c3.o, a: c3.a, tag: tag,
        why: '<b>' + it.letter + ' is for ' + it.sound + '</b>：' + it.words.join(', ') + '。' +
             '（教材 p' + P.p.page + '）' };
    };
  }

  /* ══════════ ③ 英语词汇 ══════════ */

  function vocabGen(tag, filter) {
    return function (rnd) {
      var all = (window.WORDS_EN || []);
      var pool = filter ? all.filter(filter) : all;
      if (pool.length < 4) pool = all;
      if (pool.length < 4) return null;
      var it = pick(rnd, pool);
      var cn = it.cn.split(/[；;]/)[0].trim();
      var k = ri(rnd, 0, 2);

      if (k === 0) {   // 中 → 英（打字）
        return { type: 'fill', q: '写出单词：<b>' + cn + '</b> → ___', a: [[it.w]], tag: tag,
          why: '<b>' + it.w + '</b> /' + it.ipa + '/ ' + it.cn + '<br>（课本词汇表 Appendix 4）' };
      }
      if (k === 1) {   // 英 → 中（选择）
        var ow = shuffle(rnd, all.filter(function (x) { return x.w !== it.w; })).slice(0, 3)
          .map(function (x) { return x.cn.split(/[；;]/)[0].trim(); });
        var c = choice(rnd, cn, ow);
        return { type: 'choice', q: '<b>' + it.w + '</b> 的意思是——', o: c.o, a: c.a, tag: tag,
          why: '<b>' + it.w + '</b> /' + it.ipa + '/ ' + it.cn };
      }
      // 首字母提示
      var hint = it.w[0] + ' _'.repeat(Math.max(0, it.w.length - 1));
      return { type: 'fill', q: '按提示写出单词（' + cn + '）：<b>' + hint + '</b> → ___',
        a: [[it.w]], tag: tag,
        why: '<b>' + it.w + '</b> /' + it.ipa + '/ ' + it.cn + '　共 ' + it.w.length + ' 个字母。' };
    };
  }

  /* ══════════ ④ 教材原话判断（通用兜底） ══════════ */

  /* 把句子里的一个数字或关键词换掉，造一个「像模像样但错」的句子 */
  var SWAP = [
    [/(\d+)/, function (m) { var n = +m; return String(n === 1 ? 2 : (Math.random() < .5 ? n + 1 : Math.max(1, n - 1))); }],
    [/相同/, function () { return '不同'; }], [/不同/, function () { return '相同'; }],
    [/从左往右/, function () { return '从右往左'; }],
    [/先乘除，?后加减/, function () { return '先加减，后乘除'; }],
    [/越大/, function () { return '越小'; }], [/越小/, function () { return '越大'; }],
    [/最短/, function () { return '最长'; }], [/最长/, function () { return '最短'; }],
    [/单数/, function () { return '双数'; }], [/双数/, function () { return '单数'; }],
    [/大写/, function () { return '小写'; }], [/小写/, function () { return '大写'; }],
    [/前/, function () { return '后'; }]
  ];
  function mutate(rnd, s) {
    var cands = SWAP.filter(function (r) { return r[0].test(s); });
    if (!cands.length) return null;
    var r = pick(rnd, cands);
    var m = s.match(r[0]);
    return s.replace(r[0], r[1](m[1] || m[0]));
  }

  function factGen(tag) {
    return function (rnd) {
      var P = points()[tag];
      if (!P) return null;
      var src = strip(P.p.text || '').split(/[｜|]/)[0].trim();
      if (src.length < 8 || src.length > 80) {
        // 原文不合适就退回「这条知识点讲的是什么」
        var others = shuffle(rnd, Object.keys(points()).filter(function (t) {
          return t !== tag && points()[t].book === P.book;
        })).slice(0, 3).map(function (t) { return strip(points()[t].p.point); });
        var c0 = choice(rnd, strip(P.p.point), others);
        return { type: 'choice',
          q: '课本 <b>' + P.unit + '</b>（教材 p' + P.p.page + '）讲的是下面哪一条？',
          o: c0.o, a: c0.a, tag: tag,
          why: (P.p.text ? '课本原文：<b>' + strip(P.p.text) + '</b><br>' : '') + (P.p.eg || '') };
      }
      var bad = mutate(rnd, src);
      if (!bad || bad === src) {
        var c1 = choice(rnd, '对', ['错']);
        return { type: 'choice', q: '判断：「<b>' + src + '</b>」这句话对不对？',
          o: ['对', '错'], a: 0, tag: tag,
          why: '<b>对。</b>这是课本原话（教材 p' + P.p.page + '）。<br>' + (P.p.eg || '') };
      }
      var mode = ri(rnd, 0, 2);
      var note = '课本原话：<b>' + src + '</b>（教材 p' + P.p.page + '）' + (P.p.eg ? '<br>' + P.p.eg : '');

      if (mode === 0) {          // 判断对错
        var showBad = rnd() < 0.5;
        return { type: 'choice',
          q: '判断：「<b>' + (showBad ? bad : src) + '</b>」这句话对不对？',
          o: ['对', '错'], a: showBad ? 1 : 0, tag: tag,
          why: (showBad ? '题目里那句把关键的地方改掉了，所以是<b>错</b>的。<br>' : '和课本一致，是<b>对</b>的。<br>') + note };
      }
      if (mode === 1) {          // 四选一，挑出课本原话
        var fakes = [], guard = 0;
        while (fakes.length < 3 && guard < 30) {
          guard++;
          var f = mutate(rnd, src);
          if (f && f !== src && fakes.indexOf(f) < 0) fakes.push(f);
        }
        if (fakes.length < 3) {
          return { type: 'choice', q: '判断：「<b>' + bad + '</b>」这句话对不对？',
            o: ['对', '错'], a: 1, tag: tag, why: '这句被改过了。<br>' + note };
        }
        var c2 = choice(rnd, src, fakes);
        return { type: 'choice', q: '下面哪一句是<b>课本原话</b>？', o: c2.o, a: c2.a, tag: tag, why: note };
      }
      // 挖掉一个关键词让孩子填
      var toks = src.match(/\d+|从左往右|先乘除|相同|不同|越大|越小|最短|最长|单数|双数|大写|小写/g);
      if (toks && toks.length) {
        var w = pick(rnd, toks);
        var blanked = src.replace(w, '___');
        return { type: 'fill', q: '把课本原话补完整：<br>' + blanked, a: [[w]], tag: tag, why: note };
      }
      return { type: 'choice', q: '判断：「<b>' + src + '</b>」这句话对不对？',
        o: ['对', '错'], a: 0, tag: tag, why: '<b>对。</b>这是课本原话。<br>' + note };
    };
  }

  /* ══════════ 注册 ══════════ */

  var POEMS = [
    ['日积月累·所见', '所见', '清·袁枚'],
    ['古诗·望洞庭', '望洞庭', '唐·刘禹锡'],
    ['古诗默写·山行', '山行', '唐·杜牧'],
    ['古诗·夜书所见', '夜书所见', '宋·叶绍翁'],
    ['日积月累·舟夜书所见', '舟夜书所见', '清·查慎行'],
    ['日积月累·早发白帝城', '早发白帝城', '唐·李白'],
    ['古诗·鹿柴', '鹿柴', '唐·王维'],
    ['古诗默写·望天门山', '望天门山', '唐·李白'],
    ['古诗·饮湖上初晴后雨', '饮湖上初晴后雨', '宋·苏轼'],
    ['日积月累·采莲曲', '采莲曲', '唐·王昌龄'],
    ['文言文·司马光', '司马光', '本册唯一文言文'],
    ['背诵·秋天的雨第2段', '秋天的雨（第2自然段）', ''],
    ['背诵·大自然的声音2-3段', '大自然的声音（第2~3自然段）', '']
  ];

  var reg = {};
  POEMS.forEach(function (p) { reg[p[0]] = poemGen(p[0], p[1], p[2]); });
  reg['文学常识·古诗作者'] = poemFrom(POEMS.slice(0, 10).map(function (p) { return p[0]; }));

  ['拼读·AaDd', '拼读·EeHh', '拼读·IiLl', '拼读·MmPp', '拼读·QqUu', '拼读·VvZz']
    .forEach(function (t) { reg[t] = phonicsGen(t); });
  /* 「自然拼读·字母音」是总表里的汇总条目 —— 从 26 个字母里随机抽，覆盖面最广 */
  reg['自然拼读·字母音'] = function (rnd) {
    var src = ['拼读·AaDd', '拼读·EeHh', '拼读·IiLl', '拼读·MmPp', '拼读·QqUu', '拼读·VvZz'];
    var q = phonicsGen(pick(rnd, src))(rnd);
    if (q) q.tag = '自然拼读·字母音';
    return q;
  };

  reg['词汇·动物'] = vocabGen('词汇·动物', function (w) {
    return /狗|猫|鱼|鸟|兔|狐狸|熊猫|猴|虎|象|狮|长颈鹿|动物/.test(w.cn); });
  reg['词汇·水果'] = vocabGen('词汇·水果', function (w) { return /苹果|香蕉|橙|葡萄/.test(w.cn); });
  reg['词汇·颜色'] = vocabGen('词汇·颜色', function (w) { return /色/.test(w.cn); });
  reg['词汇·数字'] = vocabGen('词汇·数字', function (w) {
    return /^(一|二|三|四|五|六|七|八|九|十)$/.test(w.cn.trim()); });
  reg['词汇·家庭'] = vocabGen('词汇·家庭', function (w) {
    return /妈妈|爸爸|奶奶|爷爷|祖父|祖母|母亲|父亲|姐|妹|哥|弟|婴儿|伯|舅|姑|姨|堂|家/.test(w.cn); });
  reg['词汇·身体部位'] = vocabGen('词汇·身体部位', function (w) { return /耳朵|手|眼睛|嘴|胳膊/.test(w.cn); });
  reg['词汇·农场花园'] = vocabGen('词汇·农场花园', function (w) {
    return /农场|花园|学校|花|草|树|植物|空气|阳光|水/.test(w.cn); });
  reg['词汇·形容词'] = vocabGen('词汇·形容词', function (w) { return /的$/.test(w.cn.split(/[；;]/)[0]); });
  reg['词汇·词汇表'] = vocabGen('词汇·词汇表', null);

  /* 其余全部用「教材原话判断」兜底 */
  function fillRest() {
    var have = {};
    window.GEN.tags().forEach(function (t) { have[t] = 1; });
    Object.keys(reg).forEach(function (t) { have[t] = 1; });
    Object.keys(points()).forEach(function (t) {
      if (!have[t]) reg[t] = factGen(t);
    });
  }

  /* 挂进 GEN —— 保持同一个接口 */
  var oldCan = window.GEN.can, oldOne = window.GEN.one, oldTags = window.GEN.tags;
  window.GEN.can = function (tag) { return oldCan(tag) || !!reg[tag]; };
  window.GEN.one = function (tag, seed) {
    var r = oldOne(tag, seed);
    if (r) return r;
    if (!reg[tag]) return null;
    var q = reg[tag](mkRnd(seed));
    if (!q) return null;
    q.tag = q.tag || tag; q.gen = true; q.seed = seed;
    return q;
  };
  window.GEN.tags = function () {
    var s = {}, out = [];
    oldTags().concat(Object.keys(reg)).forEach(function (t) { if (!s[t]) { s[t] = 1; out.push(t); } });
    return out;
  };

  fillRest();
})();
