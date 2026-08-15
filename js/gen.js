/* ============================================================
   gen.js —— 无限出题机

   一个知识点一个生成器。每次调用换一组数字/词语，出一道新题。
   <b>答案是算出来的，不是我手写的</b> —— 生成题目和算答案用的是同一段代码，
   所以不存在「题目和答案对不上」这种事。

   每个生成器接一个带种子的随机数发生器 rnd，返回：
     { q, type:'fill'|'choice', a, o?, tag, why }
   格式和试卷里的题完全一样，能直接喂给 exam.js 渲染。

   ⚠️ 数字范围严格卡在三年级上册：
     · 乘法只到「多位数乘一位数」，乘数 2~9，被乘数最多四位
     · 除法只用表内除法（除数 2~9，商是整数）
     · 分数只到同分母加减和 1 减几分之几，不化简
     · 减法不出现负数，除法不出现余数
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 带种子的随机数：同一个种子出同一道题 ---------- */
  function mkRnd(seed) {
    var s = (seed | 0) || 1;
    return function () {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  }
  function ri(rnd, lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }
  function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function shuffle(rnd, arr) {
    var r = arr.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }
  /* 造选择题：正确答案 + 干扰项，打乱后返回下标 */
  function choice(rnd, right, wrongs) {
    var opts = shuffle(rnd, [right].concat(wrongs));
    return { o: opts, a: opts.indexOf(right) };
  }
  /* 干扰项去重、去掉和正确答案相同的 */
  function distinct(right, list) {
    var seen = {}, out = [];
    list.forEach(function (x) {
      var k = String(x);
      if (k === String(right) || seen[k]) return;
      seen[k] = 1; out.push(x);
    });
    return out;
  }

  var NAMES = ['小明', '小红', '小军', '小丽', '小刚', '小芳', '东东', '圆圆'];
  var THINGS = [
    { n: '本', w: '故事书' }, { n: '张', w: '卡片' }, { n: '个', w: '苹果' },
    { n: '支', w: '铅笔' }, { n: '朵', w: '花' }, { n: '只', w: '兔子' },
    { n: '块', w: '橡皮' }, { n: '袋', w: '糖果' }
  ];

  var G = {};   // tag → 生成器

  /* ══════════════ 一、观察物体 ══════════════ */

  G['观察物体·相对面'] = function (rnd) {
    if (rnd() < 0.5) {
      var up = ri(rnd, 1, 6), down = 7 - up;
      var c = choice(rnd, String(down), distinct(down, [up, 7 - up + 1, 7 - up - 1, up + 1]
        .filter(function (x) { return x >= 1 && x <= 6; }).map(String)).slice(0, 3));
      return { type: 'choice', q: '一个正方体骰子，朝上的面是 <b>' + up + '</b>，朝下的面是几？',
        o: c.o, a: c.a, tag: '观察物体·相对面',
        why: '课本第 2 页：<b>正方体相对两个面上的数，和是 7。</b><br>' +
             '朝上和朝下正好相对，所以 7 − ' + up + ' = <b>' + down + '</b>。' };
    }
    var a1 = ri(rnd, 1, 6);
    return { type: 'fill', q: '骰子上和 <b>' + a1 + '</b> 相对的那个面，上面是 ___ 。',
      a: [[String(7 - a1)]], tag: '观察物体·相对面',
      why: '相对两面的和永远是 <b>7</b>：1↔6、2↔5、3↔4。<br>7 − ' + a1 + ' = <b>' + (7 - a1) + '</b>。' };
  };

  G['观察物体·长方体的面'] = function (rnd) {
    var law = '课本第 3 页原话：<b>都有三组相同的面，每组中的两个面都不相连。</b><br>' +
              '前↔后、左↔右、上↔下 —— <b>3 组，6 个面，12 条棱，8 个顶点。</b>';
    var k = ri(rnd, 0, 5);
    if (k === 0) {
      var c = choice(rnd, '3 组', ['2 组', '4 组', '6 组']);
      return { type: 'choice', q: '一个长方体，有几组「大小形状完全相同、而且互不相连」的面？',
        o: c.o, a: c.a, tag: '观察物体·长方体的面', why: law };
    }
    if (k === 1) return { type: 'fill', q: '一个长方体有 ___ 个面，___ 条棱，___ 个顶点。',
      a: [['6'], ['12'], ['8']], tag: '观察物体·长方体的面', why: law };
    if (k === 2) {
      var pairs = [['前', '后'], ['左', '右'], ['上', '下']];
      var pr = pick(rnd, pairs), first = rnd() < 0.5 ? 0 : 1;
      var ask = pr[first], ans = pr[1 - first];
      var c2 = choice(rnd, ans, distinct(ans, ['前', '后', '左', '右', '上', '下']
        .filter(function (x) { return x !== ask; })).slice(0, 3));
      return { type: 'choice',
        q: '一个正方体的六个面分别写着「前、后、左、右、上、下」。写着<b>「' + ask + '」</b>的面，它的对面写的是——',
        o: c2.o, a: c2.a, tag: '观察物体·长方体的面',
        why: '课本第 4 页：<b>「后」与「前」相对。</b>三组相对面：前↔后、左↔右、上↔下。<br>' +
             '所以「' + ask + '」的对面是「<b>' + ans + '</b>」。' };
    }
    if (k === 3) {
      var c3 = choice(rnd, '一个长方形', ['一个长方体', '三个面', '一条线段']);
      return { type: 'choice', q: '从<b>上面</b>观察一个长方体盒子，看到的是——',
        o: c3.o, a: c3.a, tag: '观察物体·长方体的面',
        why: '从一个方向看立体图形，看到的是一个<b>平面图形</b>。<br>' +
             '从上面看长方体，看到的就是上面那个<b>长方形</b>的面。' };
    }
    if (k === 4) {
      var c4 = choice(rnd, '可能是正方体，也可能是长方体',
        ['一定是正方体', '一定是长方体', '一定是圆柱']);
      return { type: 'choice', q: '观察一个立体图形，看到的<b>一个面是正方形</b>。这个立体图形——',
        o: c4.o, a: c4.a, tag: '观察物体·长方体的面',
        why: '课本第 2 页：「可能是正方体，因为正方体的面都是正方形。<b>也可能是……</b>」<br>' +
             '又高又细的长方体盒子，上下两个面也是正方形。<b>只看一个面断定不了。</b>' };
    }
    var n = ri(rnd, 2, 5);
    return { type: 'fill', q: n + ' 个一样的长方体盒子，一共有 ___ 个面。',
      a: [[String(n * 6)]], tag: '观察物体·长方体的面',
      why: '一个长方体有 <b>6</b> 个面，' + n + ' 个就是 ' + n + ' × 6 = <b>' + (n * 6) + '</b> 个。<br>' + law };
  };

  G['观察物体·展开图'] = function (rnd) {
    var v = ri(rnd, 0, 5);
    if (v === 3) {
      var c = choice(rnd, '不一定相同，剪开的边不同，摊出来就不同',
        ['一定完全相同', '一定不同', '和盒子大小有关']);
      return { type: 'choice',
        q: '两个<b>一模一样</b>的纸盒，小明和小红各剪开一个（都剪 7 条边）。他们摊出来的图形——',
        o: c.o, a: c.a, tag: '观察物体·展开图',
        why: '课本第 3 页：<b>这两个同样的纸盒，剪开的边不同，得到的图形也不同。</b><br>' +
             '剪<b>几条</b>是固定的（7 条），但剪<b>哪几条</b>可以不一样。' };
    }
    if (v === 4) {
      var c2 = choice(rnd, '不然那个面会掉下来，摊不成一整片',
        ['为了好看', '为了少剪几刀', '没有原因，习惯而已']);
      return { type: 'choice', q: '剪开纸盒时，为什么<b>每个面都至少要留一条边</b>和别的面连着？',
        o: c2.o, a: c2.a, tag: '观察物体·展开图',
        why: '课本第 3 页提示原文：<b>每个面都至少有一条边和其他的面相连。</b><br>' +
             '要是一个面四条边全剪断，它就成了单独的小方片掉出来了。' };
    }
    if (v === 5) {
      var c3 = choice(rnd, '6 个', ['4 个', '5 个', '8 个']);
      return { type: 'choice', q: '一个平面图形要能折成正方体，必须由几个<b>同样大的正方形</b>组成？',
        o: c3.o, a: c3.a, tag: '观察物体·展开图',
        why: '正方体有 <b>6</b> 个面，展开后就是 6 个正方形。<br>' +
             '但注意：<b>有 6 个正方形不一定就能折成</b>，还得看排列方式。（课本第 5 页让我们剪下来折一折试试）' };
    }
    if (v === 0) return { type: 'fill',
      q: '把一个<b>没有开口</b>的长方体纸盒沿着边剪开、平铺在桌上，一共要剪开 ___ 条边。',
      a: [['7']], tag: '观察物体·展开图',
      why: '长方体一共 <b>12 条棱</b>。摊平后 6 个面还要连成一整片，得留 <b>5 条不剪</b>。<br>12 − 5 = <b>7</b> 条。（课本第 3 页）' };
    if (v === 1) return { type: 'fill', q: '一个正方体的展开图上，一共有 ___ 个正方形。',
      a: [['6']], tag: '观察物体·展开图',
      why: '正方体有 <b>6</b> 个面，剪开摊平后面还是那 6 个，不多也不少。' };
    var c = choice(rnd, '12 条', ['6 条', '8 条', '10 条']);
    return { type: 'choice', q: '一个正方体一共有多少条棱？',
      o: c.o, a: c.a, tag: '观察物体·展开图',
      why: '正方体有 <b>12 条棱</b>、6 个面、8 个顶点。<br>剪开时留 5 条不剪，所以要剪 12−5=7 条。' };
  };

  /* ══════════════ 二、混合运算 ══════════════ */

  /* 只有加减：a − b + c 或 a + b − c，保证不出现负数 */
  G['混合运算·同级'] = function (rnd) {
    if (rnd() < 0.5) {
      var a = ri(rnd, 40, 95), b = ri(rnd, 10, a - 5), c = ri(rnd, 10, 60);
      var r1 = a - b, ans = r1 + c;
      return { type: 'fill', q: a + ' − ' + b + ' + ' + c + ' = ___', a: [[String(ans)]],
        tag: '混合运算·同级',
        why: '只有加减法，<b>从左往右</b>算：<br>' + a + '−' + b + '=<b>' + r1 + '</b>，' +
             r1 + '+' + c + '=<b>' + ans + '</b>。<br>' +
             '要是先算 ' + b + '+' + c + '=' + (b + c) + '，再 ' + a + '−' + (b + c) +
             ' 就' + (a >= b + c ? '得 ' + (a - b - c) + '，答案就错了' : '不够减了 —— 这正说明顺序反了') + '。' };
    }
    // 只有乘除：a ÷ b × c，保证整除
    var b2 = ri(rnd, 2, 9), q2 = ri(rnd, 2, 9), a2 = b2 * q2, c2 = ri(rnd, 2, 9);
    var ans2 = q2 * c2;
    return { type: 'fill', q: a2 + ' ÷ ' + b2 + ' × ' + c2 + ' = ___', a: [[String(ans2)]],
      tag: '混合运算·同级',
      why: '只有乘除法，<b>从左往右</b>算：<br>' + a2 + '÷' + b2 + '=<b>' + q2 + '</b>，' +
           q2 + '×' + c2 + '=<b>' + ans2 + '</b>。<br>' +
           '先算 ' + b2 + '×' + c2 + '=' + (b2 * c2) + ' 的话，' + a2 + '÷' + (b2 * c2) + ' 就除不开了。' };
  };

  /* 两级：a − b ÷ c 或 a + b × c */
  G['混合运算·先乘除'] = function (rnd) {
    if (rnd() < 0.5) {
      var c = ri(rnd, 2, 9), q = ri(rnd, 2, 9), b = c * q, a = ri(rnd, q + 5, 99);
      return { type: 'fill', q: a + ' − ' + b + ' ÷ ' + c + ' = ___', a: [[String(a - q)]],
        tag: '混合运算·先乘除',
        why: '既有除法又有减法，<b>先乘除后加减</b>：<br>' + b + '÷' + c + '=<b>' + q + '</b>，' +
             a + '−' + q + '=<b>' + (a - q) + '</b>。' };
    }
    var a2 = ri(rnd, 5, 60), b2 = ri(rnd, 2, 9), c2 = ri(rnd, 2, 9);
    return { type: 'fill', q: a2 + ' + ' + b2 + ' × ' + c2 + ' = ___', a: [[String(a2 + b2 * c2)]],
      tag: '混合运算·先乘除',
      why: '<b>先乘除后加减</b>：' + b2 + '×' + c2 + '=<b>' + (b2 * c2) + '</b>，' +
           a2 + '+' + (b2 * c2) + '=<b>' + (a2 + b2 * c2) + '</b>。' };
  };

  /* 有括号 */
  G['混合运算·括号'] = function (rnd) {
    var d = ri(rnd, 2, 9), q = ri(rnd, 2, 9), sum = d * q;
    var a = ri(rnd, 10, sum - 5), b = sum - a;
    return { type: 'fill', q: '(' + a + ' + ' + b + ') ÷ ' + d + ' = ___', a: [[String(q)]],
      tag: '混合运算·括号',
      why: '课本第 9 页：<b>算式里有括号，要先算括号里面的。</b><br>' +
           a + '+' + b + '=<b>' + sum + '</b>，' + sum + '÷' + d + '=<b>' + q + '</b>。' };
  };

  /* 括号的作用：同样数字，加不加括号差多少 */
  G['混合运算·括号作用'] = function (rnd) {
    var a = ri(rnd, 2, 9), b = ri(rnd, 2, 9), c = ri(rnd, 2, 9);
    var no = a + b * c, yes = (a + b) * c;
    return { type: 'fill',
      q: '算一算，比一比：<br>' + a + ' + ' + b + ' × ' + c + ' = ___ 　　(' + a + ' + ' + b + ') × ' + c + ' = ___',
      a: [[String(no)], [String(yes)]], tag: '混合运算·括号作用',
      why: '左边先乘后加：' + b + '×' + c + '=' + (b * c) + '，' + a + '+' + (b * c) + '=<b>' + no + '</b>。<br>' +
           '右边先算括号：' + a + '+' + b + '=' + (a + b) + '，' + (a + b) + '×' + c + '=<b>' + yes + '</b>。<br>' +
           '同样的数字，<b>加个括号结果差了 ' + Math.abs(yes - no) + '</b>。课本第 9 页：括号可以改变运算顺序。' };
  };

  /* 找错：造一个「擅自改变运算顺序」的错例 */
  G['混合运算·找错'] = function (rnd) {
    var k = ri(rnd, 0, 2);
    if (k === 0) {          // a − b + c 被当成 a − (b+c)
      var a = ri(rnd, 40, 90), b = ri(rnd, 10, 30), c = ri(rnd, 5, 20);
      return { type: 'fill',
        q: '小明写：' + a + ' − ' + b + ' + ' + c + ' = ' + a + ' − ' + (b + c) + ' = ' + (a - b - c) +
           '　　正确的得数是 ___',
        a: [[String(a - b + c)]], tag: '混合运算·找错',
        why: '小明<b>偷偷先算了 ' + b + '+' + c + '</b>。只有加减法必须<b>从左往右</b>：<br>' +
             a + '−' + b + '=<b>' + (a - b) + '</b>，' + (a - b) + '+' + c + '=<b>' + (a - b + c) + '</b>。' };
    }
    if (k === 1) {          // a + b ÷ c 被当成 (a+b) ÷ c
      var c2 = ri(rnd, 2, 9), q2 = ri(rnd, 2, 9), b2 = c2 * q2, a2 = c2 * ri(rnd, 1, 5) - b2 % c2;
      a2 = Math.max(2, a2);
      var wrongSum = a2 + b2;
      return { type: 'fill',
        q: '小明写：' + a2 + ' + ' + b2 + ' ÷ ' + c2 + ' = ' + wrongSum + ' ÷ ' + c2 +
           ' = ' + (Math.round(wrongSum / c2 * 100) / 100) + '　　正确的得数是 ___',
        a: [[String(a2 + q2)]], tag: '混合运算·找错',
        why: '小明<b>先算了 ' + a2 + '+' + b2 + '</b>。有除法就要<b>先除</b>：<br>' +
             b2 + '÷' + c2 + '=<b>' + q2 + '</b>，' + a2 + '+' + q2 + '=<b>' + (a2 + q2) + '</b>。' };
    }
    // a ÷ b × c 被当成 a ÷ (b×c)
    var b3 = ri(rnd, 2, 6), q3 = ri(rnd, 2, 9), a3 = b3 * q3, c3 = ri(rnd, 2, 6);
    return { type: 'fill',
      q: '小明写：' + a3 + ' ÷ ' + b3 + ' × ' + c3 + ' = ' + a3 + ' ÷ ' + (b3 * c3) +
         ' = ' + (Math.round(a3 / (b3 * c3) * 100) / 100) + '　　正确的得数是 ___',
      a: [[String(q3 * c3)]], tag: '混合运算·找错',
      why: '小明<b>先算了 ' + b3 + '×' + c3 + '</b>。只有乘除法也要<b>从左往右</b>：<br>' +
           a3 + '÷' + b3 + '=<b>' + q3 + '</b>，' + q3 + '×' + c3 + '=<b>' + (q3 * c3) + '</b>。' };
  };

  /* 连减的规律：a−b−c = a−(b+c) */
  G['混合运算·运算规律'] = function (rnd) {
    var b = ri(rnd, 10, 40), c = ri(rnd, 10, 40), a = b + c + ri(rnd, 5, 40);
    return { type: 'fill', q: a + ' − ' + b + ' − ' + c + ' = ___ 　　' + a + ' − (' + b + ' + ' + c + ') = ___',
      a: [[String(a - b - c)], [String(a - b - c)]], tag: '混合运算·运算规律',
      why: '左边：' + a + '−' + b + '=' + (a - b) + '，' + (a - b) + '−' + c + '=<b>' + (a - b - c) + '</b>。<br>' +
           '右边：' + b + '+' + c + '=' + (b + c) + '，' + a + '−' + (b + c) + '=<b>' + (a - b - c) + '</b>。<br>' +
           '两边一样，规律是 <b>a − b − c = a − (b + c)</b>：连续减两个数，等于减去它们的和。' };
  };

  /* 判断先算什么 */
  G['混合运算·运算顺序'] = function (rnd) {
    var a = ri(rnd, 20, 90), b = ri(rnd, 2, 9), c = ri(rnd, 2, 9);
    var k = ri(rnd, 0, 2), expr, right, why;
    if (k === 0) {
      expr = a + ' − ' + (b * c) + ' ÷ ' + c; right = (b * c) + ' ÷ ' + c;
      why = '既有除法又有减法，<b>先乘除后加减</b>。';
    } else if (k === 1) {
      expr = a + ' + ' + b + ' × ' + c; right = b + ' × ' + c;
      why = '既有乘法又有加法，<b>先乘除后加减</b>。';
    } else {
      expr = '(' + a + ' − ' + b + ') × ' + c; right = a + ' − ' + b;
      why = '<b>算式里有括号，要先算括号里面的。</b>（课本第 9 页）';
    }
    var wrongs = distinct(right, [a + ' − ' + b, b + ' × ' + c, a + ' + ' + b, '从左往右，先算最左边']);
    var ch = choice(rnd, right, wrongs.slice(0, 3));
    return { type: 'choice', q: '<b>' + expr + '</b>　第一步应该算——',
      o: ch.o, a: ch.a, tag: '混合运算·运算顺序', why: why + '<br>所以第一步算 <b>' + right + '</b>。' };
  };

  G['混合运算·综合算式'] = function (rnd) {
    var law = '课本第 6 页：<b>像 24−13+18 这样的算式是综合算式。</b>' +
              '把分步算式合并成一个、中间不写等号，才叫综合算式。';
    if (rnd() < 0.5) {
      var a = ri(rnd, 20, 60), b = ri(rnd, 5, 19), c = ri(rnd, 5, 30);
      var right = a + ' − ' + b + ' + ' + c;
      var ch = choice(rnd, right, [a + ' − ' + b + ' = ' + (a - b),
        (a - b) + ' + ' + c + ' = ' + (a - b + c), String(a - b + c)]);
      return { type: 'choice', q: '下面哪一个是<b>综合算式</b>？', o: ch.o, a: ch.a,
        tag: '混合运算·综合算式', why: law };
    }
    // 把分步算式合并 —— 需要加括号的那种
    var k = ri(rnd, 2, 6), mid = ri(rnd, 6, 20), big = mid + ri(rnd, 3, 15);
    var d = big - mid, ans = mid * k;
    var opts = ['(' + big + ' − ' + d + ') × ' + k,
                big + ' − ' + d + ' × ' + k,
                big + ' × ' + k + ' − ' + d,
                '(' + big + ' + ' + d + ') × ' + k];
    var ch2 = choice(rnd, opts[0], opts.slice(1));
    return { type: 'choice',
      q: '分步算式是：先算 <b>' + big + ' − ' + d + ' = ' + mid + '</b>，再算 <b>' + mid + ' × ' + k + ' = ' + ans + '</b>。<br>' +
         '合并成一个综合算式，应该是——',
      o: ch2.o, a: ch2.a, tag: '混合运算·综合算式',
      why: '要<b>先算减法</b>，可按运算顺序会先算乘法，所以减法必须<b>加括号</b>：<br>' +
           '<b>(' + big + '−' + d + ')×' + k + ' = ' + mid + '×' + k + ' = ' + ans + '</b>。<br>' +
           '写成 ' + big + '−' + d + '×' + k + ' 就变成先算 ' + d + '×' + k + '=' + (d * k) + ' 了，完全不是一回事。<br>' + law };
  };

  /* ══════════════ 三、两步应用题 ══════════════ */

  G['两步应用·倍数'] = function (rnd) {
    var n1 = pick(rnd, NAMES), n2 = pick(rnd, NAMES.filter(function (x) { return x !== n1; }));
    var n3 = pick(rnd, NAMES.filter(function (x) { return x !== n1 && x !== n2; }));
    var t = pick(rnd, THINGS);
    var base = ri(rnd, 8, 20), diff = ri(rnd, 2, base - 3), k = ri(rnd, 2, 5);
    var mid = base - diff, ans = mid * k;
    return { type: 'fill',
      q: n1 + '有 <b>' + base + '</b> ' + t.n + t.w + '，' + n2 + '比' + n1 + '<b>少 ' + diff + '</b> ' + t.n +
         '，' + n3 + '的' + t.w + '数是' + n2 + '的 <b>' + k + ' 倍</b>。' + n3 + '有多少' + t.n + '？<br>' +
         '(1) ' + n2 + '有多少' + t.n + '？　(2) ' + n3 + '有多少' + t.n + '？',
      a: [[String(mid)], [String(ans)]], tag: '两步应用·倍数',
      why: '问的是' + n3 + '，可' + n3 + '是「' + n2 + '的 ' + k + ' 倍」——' +
           '<b>不知道' + n2 + '是多少，就算不出' + n3 + '</b>。所以第一步必须先求' + n2 + '：<br>' +
           '(1) ' + n2 + '：' + base + ' − ' + diff + ' = <b>' + mid + '</b>（' + t.n + '）<br>' +
           '(2) ' + n3 + '：' + mid + ' × ' + k + ' = <b>' + ans + '</b>（' + t.n + '）<br>' +
           '综合算式 <b>(' + base + '−' + diff + ')×' + k + ' = ' + ans + '</b>，减法必须加括号。' };
  };

  G['两步应用·连减'] = function (rnd) {
    var t = pick(rnd, THINGS);
    var b = ri(rnd, 10, 40), c = ri(rnd, 10, 40), a = b + c + ri(rnd, 10, 60);
    return { type: 'fill',
      q: '一共有 <b>' + a + '</b> ' + t.n + t.w + '。第一天用了 <b>' + b + '</b> ' + t.n +
         '，第二天用了 <b>' + c + '</b> ' + t.n + '。还剩多少' + t.n + '？<br>还剩 ___ ' + t.n,
      a: [[String(a - b - c)]], tag: '两步应用·连减',
      why: '两种算法都对：<br>' +
           '① 一天一天减：' + a + '−' + b + '=' + (a - b) + '，' + (a - b) + '−' + c + '=<b>' + (a - b - c) + '</b><br>' +
           '② 先算共用了多少：' + b + '+' + c + '=' + (b + c) + '，' + a + '−' + (b + c) + '=<b>' + (a - b - c) + '</b><br>' +
           '课本第 12 页：<b>把问题分解为几个关联的小问题，一步解决一个。</b>' };
  };

  /* ══════════════ 四、长度与质量单位 ══════════════ */

  function unitQ(rnd, tag, pairs, note) {
    var p = pick(rnd, pairs);
    var n = p.n(rnd);
    return { type: 'fill', q: n + ' ' + p.from + ' = ___ ' + p.to,
      a: [[String(n * p.k)]], tag: tag,
      why: '<b>1 ' + p.from + ' = ' + p.k + ' ' + p.to + '</b>，所以 ' + n + ' × ' + p.k +
           ' = <b>' + (n * p.k) + '</b>。<br>' + note };
  }

  G['长度单位·进率'] = function (rnd) {
    if (rnd() < 0.5) {
      var n = ri(rnd, 2, 9);
      return { type: 'fill', q: n + ' 厘米 = ___ 毫米', a: [[String(n * 10)]],
        tag: '长度单位·进率',
        why: '<b>1 厘米 = 10 毫米</b>（直尺上 1 厘米里正好 10 小格）。<br>' +
             n + ' × 10 = <b>' + (n * 10) + '</b> 毫米。' };
    }
    var m = ri(rnd, 2, 9) * 10;
    return { type: 'fill', q: m + ' 毫米 = ___ 厘米', a: [[String(m / 10)]],
      tag: '长度单位·进率',
      why: '小单位换大单位<b>除以进率</b>：' + m + ' ÷ 10 = <b>' + (m / 10) + '</b> 厘米。' };
  };

  G['长度单位·换算'] = function (rnd) {
    return unitQ(rnd, '长度单位·换算', [
      { from: '分米', to: '厘米', k: 10, n: function (r) { return ri(r, 2, 9); } },
      { from: '米', to: '分米', k: 10, n: function (r) { return ri(r, 2, 9); } }
    ], '相邻两个长度单位之间都是 <b>10</b>：毫米→厘米→分米→米。');
  };

  G['长度单位·千米进率'] = function (rnd) {
    if (rnd() < 0.5) {
      var n = ri(rnd, 2, 9);
      return { type: 'fill', q: n + ' 千米 = ___ 米', a: [[String(n * 1000)]],
        tag: '长度单位·千米进率',
        why: '<b>1 千米 = 1000 米</b>。' + n + ' × 1000 = <b>' + (n * 1000) + '</b> 米。<br>' +
             '记个参照：跑道一圈 400 米，<b>2 圈半就是 1000 米</b>。' };
    }
    var k = ri(rnd, 2, 9);
    return { type: 'fill', q: (k * 1000) + ' 米 = ___ 千米', a: [[String(k)]],
      tag: '长度单位·千米进率',
      why: '米换千米<b>去掉末尾三个 0</b>：' + (k * 1000) + ' ÷ 1000 = <b>' + k + '</b> 千米。' };
  };

  G['质量单位·进率'] = function (rnd) {
    if (rnd() < 0.5) {
      var n = ri(rnd, 2, 9);
      return { type: 'fill', q: n + ' 千克 = ___ 克', a: [[String(n * 1000)]],
        tag: '质量单位·进率',
        why: '<b>1 千克 = 1000 克</b>。' + n + ' × 1000 = <b>' + (n * 1000) + '</b> 克。' };
    }
    if (rnd() < 0.35) {
      var x = ri(rnd, 2, 9), y = ri(rnd, 1000, 9000);
      var big = x * 1000 > y;
      var cc = choice(rnd, big ? '>' : (x * 1000 === y ? '=' : '<'), distinct(big ? '>' : '<', ['>', '<', '=']));
      return { type: 'choice', q: '在 ○ 里填 >、< 或 =：　<b>' + x + ' 千克 ○ ' + y + ' 克</b>',
        o: cc.o, a: cc.a, tag: '质量单位·进率',
        why: '先化成同一个单位：' + x + ' 千克 = <b>' + (x * 1000) + ' 克</b>。<br>' +
             (x * 1000) + ' 和 ' + y + ' 比，' + (big ? '前者大' : (x * 1000 === y ? '一样大' : '后者大')) + '。' };
    }
    var k = ri(rnd, 2, 9);
    return { type: 'fill', q: (k * 1000) + ' 克 = ___ 千克', a: [[String(k)]],
      tag: '质量单位·进率',
      why: '克换千克<b>除以 1000</b>：' + (k * 1000) + ' ÷ 1000 = <b>' + k + '</b> 千克。' };
  };

  G['质量单位·吨进率'] = function (rnd) {
    if (rnd() < 0.5) {
      var n = ri(rnd, 2, 9);
      return { type: 'fill', q: n + ' 吨 = ___ 千克', a: [[String(n * 1000)]],
        tag: '质量单位·吨进率',
        why: '<b>1 吨 = 1000 千克</b>。' + n + ' × 1000 = <b>' + (n * 1000) + '</b> 千克。<br>' +
             '参照：1 袋粮食 100 千克，<b>10 袋就是 1 吨</b>。' };
    }
    var t = ri(rnd, 2, 9);
    return { type: 'fill', q: (t * 1000) + ' 千克 = ___ 吨', a: [[String(t)]],
      tag: '质量单位·吨进率',
      why: '千克换吨<b>除以 1000</b>：' + (t * 1000) + ' ÷ 1000 = <b>' + t + '</b> 吨。' };
  };

  var MASS_ITEMS = [
    { w: '一枚鸡蛋', u: '克', n: 50 }, { w: '一本字典', u: '克', n: 400 },
    { w: '一个笔袋', u: '克', n: 200 }, { w: '一个苹果', u: '克', n: 150 },
    { w: '一袋大米', u: '千克', n: 5 }, { w: '一个三年级学生', u: '千克', n: 25 },
    { w: '一头猪', u: '千克', n: 100 }, { w: '一头大象', u: '吨', n: 4 },
    { w: '一辆卡车的载重', u: '吨', n: 8 }, { w: '一条鲸鱼', u: '吨', n: 20 }
  ];
  G['质量单位·估测'] = function (rnd) {
    var law = '课本第 32、33 页：比较轻的用<b>克</b>（鸡蛋约 50 克、字典约 400 克）；' +
              '比较重的用<b>千克</b>（学生约 25 千克）；大宗物品用<b>吨</b>（大象好几吨）。';
    if (rnd() < 0.5) {
      var it = pick(rnd, MASS_ITEMS);
      var c = choice(rnd, it.u, distinct(it.u, ['克', '千克', '吨', '米']).slice(0, 3));
      return { type: 'choice', q: it.w + '大约重 <b>' + it.n + '</b> ___', o: c.o, a: c.a,
        tag: '质量单位·估测', why: '答案是 <b>' + it.u + '</b>。<br>' + law };
    }
    // 反过来问：哪个最适合用某个单位
    var u = pick(rnd, ['克', '千克', '吨']);
    var same = MASS_ITEMS.filter(function (x) { return x.u === u; });
    var other = MASS_ITEMS.filter(function (x) { return x.u !== u; });
    var right = pick(rnd, same).w;
    var ws = shuffle(rnd, other).slice(0, 3).map(function (x) { return x.w; });
    var c2 = choice(rnd, right, distinct(right, ws));
    return { type: 'choice', q: '下面哪一个，最适合用「<b>' + u + '</b>」作单位？',
      o: c2.o, a: c2.a, tag: '质量单位·估测',
      why: '<b>' + right + '</b>用「' + u + '」最合适。<br>' + law };
  };

  /* ══════════════ 五、多位数乘一位数 ══════════════ */

  G['乘法·口算'] = function (rnd) {
    var d = ri(rnd, 2, 9), b = ri(rnd, 2, 9);
    var zeros = rnd() < 0.5 ? 1 : 2, a = d * Math.pow(10, zeros);
    return { type: 'fill', q: a + ' × ' + b + ' = ___', a: [[String(a * b)]],
      tag: '乘法·口算',
      why: '看作 <b>' + d + ' 个' + (zeros === 1 ? '十' : '百') + '乘 ' + b + '</b>，' +
           '得 ' + (d * b) + ' 个' + (zeros === 1 ? '十' : '百') + '，就是 <b>' + (a * b) + '</b>。<br>' +
           '先算 ' + d + '×' + b + '=' + (d * b) + '，再在末尾添回 ' + zeros + ' 个 0。' };
  };

  /* 不进位：每一位乘完都小于 10 */
  G['乘法·笔算'] = function (rnd) {
    var b = ri(rnd, 2, 4);
    var hi = Math.floor(9 / b);
    var d1 = ri(rnd, 1, hi), d2 = ri(rnd, 0, hi), d3 = ri(rnd, 1, hi);
    var a = d3 * 100 + d2 * 10 + d1;
    return { type: 'fill', q: a + ' × ' + b + ' = ___', a: [[String(a * b)]],
      tag: '乘法·笔算',
      why: '从个位起，一位一位乘，<b>这道题一次也不用进位</b>：<br>' +
           d1 + '×' + b + '=' + (d1 * b) + '，' + d2 + '×' + b + '=' + (d2 * b) + '，' +
           d3 + '×' + b + '=' + (d3 * b) + ' → <b>' + (a * b) + '</b>。<br>' +
           '课本第 43 页：笔算的道理和口算一样，先求出有多少个百、十、一，再相加。' };
  };

  /* 连续进位：保证个位和十位都进位 */
  G['乘法·连续进位'] = function (rnd) {
    var b, d1, d2, d3, a, tries = 0;
    do {
      b = ri(rnd, 3, 9); d1 = ri(rnd, 2, 9); d2 = ri(rnd, 2, 9); d3 = ri(rnd, 1, 9);
      var c1 = Math.floor(d1 * b / 10);
      var c2 = Math.floor((d2 * b + c1) / 10);
      a = d3 * 100 + d2 * 10 + d1;
      tries++;
    } while ((c1 === 0 || c2 === 0) && tries < 60);
    var p1 = d1 * b, w1 = p1 % 10, k1 = Math.floor(p1 / 10);
    var p2 = d2 * b + k1, w2 = p2 % 10, k2 = Math.floor(p2 / 10);
    var p3 = d3 * b + k2;
    return { type: 'fill', q: a + ' × ' + b + ' = ___', a: [[String(a * b)]],
      tag: '乘法·连续进位',
      why: '个位 ' + d1 + '×' + b + '=' + p1 + '，写 ' + w1 + ' 进 ' + k1 + '；<br>' +
           '十位 ' + d2 + '×' + b + '=' + (d2 * b) + '，<b>再加进上来的 ' + k1 + '</b> 得 ' + p2 +
           '，写 ' + w2 + ' 进 ' + k2 + '；<br>' +
           '百位 ' + d3 + '×' + b + '=' + (d3 * b) + '，<b>再加进上来的 ' + k2 + '</b> 得 ' + p3 + '。<br>' +
           '答案 <b>' + (a * b) + '</b>。这道题连着进了两次位，<b>每一次进上来的数都要加</b>。' };
  };

  /* 中间有 0 */
  G['乘法·中间有0'] = function (rnd) {
    var b = ri(rnd, 3, 9), d1 = ri(rnd, 2, 9), d3 = ri(rnd, 1, 9);
    var a = d3 * 100 + d1;                 // 十位固定为 0
    var p1 = d1 * b, k1 = Math.floor(p1 / 10);
    return { type: 'fill', q: a + ' × ' + b + ' = ___', a: [[String(a * b)]],
      tag: '乘法·中间有0',
      why: '个位 ' + d1 + '×' + b + '=' + p1 + '，写 ' + (p1 % 10) + ' 进 ' + k1 + '；<br>' +
           '十位 <b>0×' + b + '=0，但要加上进来的 ' + k1 + '</b>，得 ' + k1 + '；<br>' +
           '百位 ' + d3 + '×' + b + '=' + (d3 * b) + '。<br>' +
           '答案 <b>' + (a * b) + '</b>。<b>0 乘完是 0，可进上来的数不能丢。</b>' };
  };

  /* 末尾有 0 */
  G['乘法·末尾有0'] = function (rnd) {
    var b = ri(rnd, 2, 9), t = ri(rnd, 12, 98), a = t * 10;
    return { type: 'fill', q: a + ' × ' + b + ' = ___', a: [[String(a * b)]],
      tag: '乘法·末尾有0',
      why: '末尾的 0 先放一边，看作 <b>' + t + ' 个十乘 ' + b + '</b>：<br>' +
           t + '×' + b + '=' + (t * b) + '，得 ' + (t * b) + ' 个十，也就是 <b>' + (a * b) + '</b>。<br>' +
           '课本第 50 页教的就是这个简便写法：先算 ' + t + '×' + b + '，再在末尾添回一个 0。' };
  };

  G['乘法·0的乘法'] = function (rnd) {
    var n = ri(rnd, 2, 9), m = ri(rnd, 2, 9);
    return { type: 'fill', q: '0 × ' + n + ' = ___ 　　' + m + ' × 0 = ___ 　　0 + ' + n + ' = ___',
      a: [['0'], ['0'], [String(n)]], tag: '乘法·0的乘法',
      why: '课本第 49 页：<b>0 和任何数相乘都得 0。</b><br>' +
           '但<b>加法不一样</b>：0 + ' + n + ' 还是 <b>' + n + '</b>。<br>' +
           n + ' 个盘子每盘 0 个桃子，一共 0 个（乘法）；可 0 个再加 ' + n + ' 个，就是 ' + n + ' 个（加法）。' };
  };

  /* 乘法找错：漏加进位 / 只乘个位 */
  G['乘法·找错'] = function (rnd) {
    var b = ri(rnd, 3, 9), d1 = ri(rnd, 3, 9), d2 = ri(rnd, 2, 9);
    var a = d2 * 10 + d1, right = a * b;
    if (rnd() < 0.5) {
      var k = Math.floor(d1 * b / 10);
      var wrong = (d2 * b) * 10 + (d1 * b) % 10;     // 十位忘了加进位
      return { type: 'fill', q: '小明写：<b>' + a + ' × ' + b + ' = ' + wrong + '</b>　　正确的得数是 ___',
        a: [[String(right)]], tag: '乘法·找错',
        why: '小明<b>忘了加进位</b>：个位 ' + d1 + '×' + b + '=' + (d1 * b) + '，写下 ' + ((d1 * b) % 10) +
             ' 进 ' + k + '，可十位算完 ' + d2 + '×' + b + '=' + (d2 * b) + ' 就直接写了，把进上来的 ' + k + ' 丢了。<br>' +
             '正确：' + (d2 * b) + '+' + k + '=' + (d2 * b + k) + '，答案 <b>' + right + '</b>。' };
    }
    var wrong2 = d1 * b;                              // 只乘了个位
    return { type: 'fill', q: '小明写：<b>' + a + ' × ' + b + ' = ' + wrong2 + '</b>　　正确的得数是 ___',
      a: [[String(right)]], tag: '乘法·找错',
      why: '小明<b>只乘了个位</b>：' + d1 + '×' + b + '=' + wrong2 + ' 就收工了，十位的 ' + d2 + ' 忘了乘。<br>' +
           '正确答案 <b>' + right + '</b>。<br>' +
           '估一估也能发现不对：' + (d2 * 10) + '×' + b + ' 就已经 ' + (d2 * 10 * b) + ' 了。' };
  };

  G['乘法·估算'] = function (rnd) {
    var t = ri(rnd, 2, 9), b = ri(rnd, 3, 9);
    var a = t * 100 - ri(rnd, 1, 9);        // 接近整百，如 497
    var est = t * 100 * b;
    return { type: 'fill',
      q: '估一估：<b>' + a + ' × ' + b + '</b> 大约是多少？（把 ' + a + ' 看成 ' + (t * 100) + ' 来估）<br>大约是 ___',
      a: [[String(est)]], tag: '乘法·估算',
      why: '把 ' + a + ' 看成 <b>' + (t * 100) + '</b>，' + (t * 100) + '×' + b + '=<b>' + est + '</b>。<br>' +
           '实际是 ' + (a * b) + '，估算值很接近。<br>' +
           '课本第 51 页：<b>估算时要根据实际问题，确定把数往大估还是往小估。</b>' };
  };

  /* ══════════════ 六、分数 ══════════════ */

  G['分数·几分之几'] = function (rnd) {
    var d = ri(rnd, 4, 10), n = ri(rnd, 2, d - 1);
    return { type: 'fill', q: '<b>{' + n + '/' + d + '}</b> 里面有 ___ 个 <b>{1/' + d + '}</b>。',
      a: [[String(n)]], tag: '分数·几分之几',
      why: '分子是几，就有几个「几分之一」。<b>{' + n + '/' + d + '} 就是 ' + n + ' 个 {1/' + d + '}</b>。<br>' +
           '这个想法很有用 —— 分数加减法靠的就是它。' };
  };

  G['分数·比大小'] = function (rnd) {
    var d = ri(rnd, 4, 10), n1 = ri(rnd, 1, d - 2), n2 = ri(rnd, n1 + 1, d - 1);
    var big = '{' + n2 + '/' + d + '}', sml = '{' + n1 + '/' + d + '}';
    var c = choice(rnd, big + ' 大', [sml + ' 大', '一样大', '没法比']);
    return { type: 'choice', q: '比一比 <b>' + sml + '</b> 和 <b>' + big + '</b>——',
      o: c.o, a: c.a, tag: '分数·比大小',
      why: '课本第 77 页：<b>平均分成相同的份数后，涂的份数越多，分数越大。</b><br>' +
           '分母都是 ' + d + '，比分子：' + n2 + ' > ' + n1 + '，所以 <b>' + big + ' > ' + sml + '</b>。' };
  };

  G['分数·分子为1比大小'] = function (rnd) {
    var d1 = ri(rnd, 2, 5), d2 = ri(rnd, d1 + 1, 9);
    var big = '{1/' + d1 + '}', sml = '{1/' + d2 + '}';
    var c = choice(rnd, big + ' 大', [sml + ' 大', '一样大', '分母大的就大']);
    return { type: 'choice', q: '比一比 <b>' + big + '</b> 和 <b>' + sml + '</b>——',
      o: c.o, a: c.a, tag: '分数·分子为1比大小',
      why: '课本第 77 页：<b>等分的份数越多，每份就越小。</b><br>' +
           '同一个蛋糕分给 ' + d1 + ' 个人，每人得 ' + big + '；分给 ' + d2 + ' 个人，每人只有 ' + sml + '。<br>' +
           '所以 <b>' + big + ' > ' + sml + '</b>。<b>分子都是 1 时，分母越大分数反而越小</b> —— 和整数正好相反。' };
  };

  G['分数·加法'] = function (rnd) {
    var d = ri(rnd, 5, 10), n1 = ri(rnd, 1, d - 2), n2 = ri(rnd, 1, d - n1);
    return { type: 'fill', q: '{' + n1 + '/' + d + '} + {' + n2 + '/' + d + '} = ___',
      a: [[(n1 + n2) + '/' + d]], tag: '分数·加法',
      why: '课本第 81 页的想法：' + n1 + ' 个 {1/' + d + '} 加 ' + n2 + ' 个 {1/' + d + '} 是 ' +
           (n1 + n2) + ' 个 {1/' + d + '}。<br><b>分母不变，只把分子相加</b>：' +
           n1 + '+' + n2 + '=' + (n1 + n2) + '，得 <b>{' + (n1 + n2) + '/' + d + '}</b>。' };
  };

  G['分数·减法'] = function (rnd) {
    var d = ri(rnd, 5, 10), n1 = ri(rnd, 2, d), n2 = ri(rnd, 1, n1 - 1);
    return { type: 'fill', q: '{' + n1 + '/' + d + '} − {' + n2 + '/' + d + '} = ___',
      a: [[(n1 - n2) + '/' + d]], tag: '分数·减法',
      why: '<b>分母不变，只把分子相减</b>：' + n1 + '−' + n2 + '=' + (n1 - n2) +
           '，得 <b>{' + (n1 - n2) + '/' + d + '}</b>。<br>' +
           '课本第 81 页：' + n1 + ' 个 {1/' + d + '} 减去 ' + n2 + ' 个 {1/' + d + '}，剩 ' + (n1 - n2) + ' 个。' };
  };

  G['分数·1减分数'] = function (rnd) {
    var d = ri(rnd, 3, 10), n = ri(rnd, 1, d - 1);
    return { type: 'fill', q: '1 − {' + n + '/' + d + '} = ___',
      a: [[(d - n) + '/' + d]], tag: '分数·1减分数',
      why: '课本第 82 页：<b>1 可以看作 ' + d + ' 个 {1/' + d + '}，就是 {' + d + '/' + d + '}。</b><br>' +
           '{' + d + '/' + d + '} − {' + n + '/' + d + '} = <b>{' + (d - n) + '/' + d + '}</b>。<br>' +
           '<b>关键一步：先把 1 换成分母和它一样的分数</b>，然后就是普通减法。' };
  };

  G['分数·整体的几分之几'] = function (rnd) {
    var t = pick(rnd, THINGS);
    var k = ri(rnd, 2, 6), each = ri(rnd, 3, 9), total = k * each;
    return { type: 'fill',
      q: '一盒' + t.w + '有 <b>' + total + '</b> ' + t.n + '，平均分成 <b>' + k + '</b> 份。<br>' +
         '1 份是这盒' + t.w + '的 ___（填分数，写成 1/2 这样），有 ___ ' + t.n + '。',
      a: [['1/' + k], [String(each)]], tag: '分数·整体的几分之几',
      why: '分成 ' + k + ' 份，1 份就是 <b>{1/' + k + '}</b>；' + total + ' ÷ ' + k + ' = <b>' + each + '</b>（' + t.n + '）。<br>' +
           '注意这里的「1」不是一个东西，而是<b>一整盒 ' + total + ' ' + t.n + '</b> —— ' +
           '分数可以表示<b>一个整体</b>的几分之几。（课本第 85 页）' };
  };

  G['分数·解决问题'] = function (rnd) {
    var k = ri(rnd, 2, 5), each = ri(rnd, 3, 9), total = k * each;
    var take = ri(rnd, 1, k - 1);
    return { type: 'fill',
      q: '一个小组有 <b>' + total + '</b> 人，其中 <b>{' + take + '/' + k + '}</b> 是女生。女生有多少人？<br>' +
         '先算 1 份是多少：' + total + ' ÷ ' + k + ' = ___ 人；再算 ' + take + ' 份：___ 人',
      a: [[String(each)], [String(each * take)]], tag: '分数·解决问题',
      why: '「{' + take + '/' + k + '} 是女生」的意思是：把 ' + total + ' 人<b>平均分成 ' + k + ' 组</b>，' +
           '女生占其中 ' + take + ' 组。<br>' +
           '1 组：' + total + '÷' + k + '=<b>' + each + '</b> 人；' + take + ' 组：' +
           each + '×' + take + '=<b>' + (each * take) + '</b> 人。（课本第 87 页）' };
  };

  G['分数·与整数关系'] = function (rnd) {
    var d = ri(rnd, 2, 9), k = ri(rnd, 0, 3);
    var law = '课本第 90 页：<b>4 个 {1/4} 是 {4/4}，就是 1。</b>' +
              '<b>分子和分母相同的分数都等于 1。</b>';
    if (k === 0) return { type: 'fill',
      q: d + ' 个 <b>{1/' + d + '}</b> 是 ___（填分数），也就是 ___（填整数）。',
      a: [[d + '/' + d], ['1']], tag: '分数·与整数关系', why: law };
    if (k === 1) return { type: 'fill',
      q: '<b>1</b> 里面有 ___ 个 <b>{1/' + d + '}</b>。',
      a: [[String(d)]], tag: '分数·与整数关系',
      why: '1 可以看作 <b>{' + d + '/' + d + '}</b>，也就是 <b>' + d + '</b> 个 {1/' + d + '}。<br>' + law };
    if (k === 2) {
      var n = ri(rnd, 1, d - 1);
      var c = choice(rnd, '{' + n + '/' + d + '} 小', ['{' + n + '/' + d + '} 大', '一样大', '没法比']);
      return { type: 'choice', q: '比一比 <b>{' + n + '/' + d + '}</b> 和 <b>1</b>——',
        o: c.o, a: c.a, tag: '分数·与整数关系',
        why: '1 就是 {' + d + '/' + d + '}。分母都是 ' + d + '，比分子：' + n + ' < ' + d +
             '，所以 <b>{' + n + '/' + d + '} < 1</b>。<br>' + law };
    }
    return { type: 'fill', q: '<b>{' + d + '/' + d + '}</b> = ___（填整数）',
      a: [['1']], tag: '分数·与整数关系',
      why: '分子和分母一样，说明<b>' + d + ' 份全都取了</b>，正好是一整个，等于 <b>1</b>。<br>' + law };
  };

  G['分数·各部分名称'] = function (rnd) {
    var d = ri(rnd, 3, 9), n = ri(rnd, 1, d - 1);
    return { type: 'fill', q: '分数 <b>{' + n + '/' + d + '}</b> 中，' + n + ' 叫作 ___ ，' + d + ' 叫作 ___ 。',
      a: [['分子'], ['分母']], tag: '分数·各部分名称',
      why: '分数线<b>上面</b>的叫<b>分子</b>，<b>下面</b>的叫<b>分母</b>。<br>' +
           '分母表示<b>平均分成几份</b>（这里是 ' + d + ' 份），分子表示<b>取了几份</b>（这里取 ' + n + ' 份）。' };
  };

  G['分数·几分之一'] = function (rnd) {
    var t = pick(rnd, ['月饼', '蛋糕', '西瓜', '披萨', '苹果派']);
    var k = ri(rnd, 2, 8);
    var c = choice(rnd, '{1/' + k + '}', ['{1/' + (k + 1) + '}', '{' + k + '/1}', '{2/' + k + '}']);
    return { type: 'choice', q: '把一个' + t + '<b>平均分成 ' + k + ' 份</b>，每份是这个' + t + '的——',
      o: c.o, a: c.a, tag: '分数·几分之一',
      why: '平均分成几份，每份就是<b>几分之一</b>，这里是 <b>{1/' + k + '}</b>。<br>' +
           '关键在「<b>平均</b>分」三个字 —— 分得不一样大就不能用分数表示。（课本第 74 页）' };
  };

  /* ══════════════ 七、数学广角 ══════════════ */

  G['数学广角·搭配'] = function (rnd) {
    if (rnd() < 0.35) {
      // 二选一的场景 —— 用加法，专门和搭配区分开
      var f = ri(rnd, 2, 5), g = ri(rnd, 2, 5);
      var cc = choice(rnd, String(f + g), distinct(f + g, [f * g, f + g + 1, f * g + 1]).slice(0, 3).map(String));
      return { type: 'choice',
        q: '从家到 A 市，有 <b>' + f + '</b> 班飞机、<b>' + g + '</b> 班高铁可以坐（<b>只能选一种</b>）。' +
           '一共有多少种走法？',
        o: cc.o, a: cc.a, tag: '数学广角·搭配',
        why: '这是<b>二选一</b>，不是分两步搭配，所以用<b>加法</b>：' + f + ' + ' + g + ' = <b>' + (f + g) + '</b> 种。<br>' +
             '⚠️ 和搭配衣服区别开：衣服要<b>上装下装各选一件（分两步）</b>，那才用乘法。（课本第 101 页）' };
    }
    var a = ri(rnd, 2, 5), b = ri(rnd, 2, 5);
    var c = choice(rnd, String(a * b), distinct(a * b, [a + b, a * b + 1, a * b - 1, a * b + 2]).slice(0, 3).map(String));
    return { type: 'choice',
      q: '有 <b>' + a + '</b> 件上装、<b>' + b + '</b> 件下装，每次上装、下装<b>各选 1 件</b>，一共有多少种搭配？',
      o: c.o, a: c.a, tag: '数学广角·搭配',
      why: '搭配要<b>分两步</b>：上装 ' + a + ' 种选择，每选定一件，下装还有 ' + b + ' 种。<br>' +
           a + ' × ' + b + ' = <b>' + (a * b) + '</b> 种。<br>' +
           '⚠️ 和「坐飞机<b>或</b>坐高铁」不一样 —— 那是二选一，用<b>加法</b>。（课本第 101 页）' };
  };

  G['数学广角·排列'] = function (rnd) {
    var pool = shuffle(rnd, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    var sorted = pool.slice().sort(function (x, y) { return y - x; });
    var max = sorted[0] * 10 + sorted[1];
    var asc = pool.slice().sort(function (x, y) { return x - y; });
    var min = asc[0] * 10 + asc[1];
    return { type: 'fill',
      q: '用 <b>' + pool.join('、') + '</b> 三个数字，组成<b>没有重复数字</b>的两位数。<br>' +
         '一共能组成 ___ 个；其中最大的是 ___ ，最小的是 ___ 。',
      a: [['6'], [String(max)], [String(min)]], tag: '数学广角·排列',
      why: '十位有 <b>3</b> 种选择，选完个位只剩 <b>2</b> 个可用，3×2 = <b>6</b> 个。<br>' +
           '要<b>最大</b>：十位放最大的 ' + sorted[0] + '，个位放次大的 ' + sorted[1] + ' → <b>' + max + '</b>。<br>' +
           '要<b>最小</b>：十位放最小的 ' + asc[0] + '，个位放次小的 ' + asc[1] + ' → <b>' + min + '</b>。<br>' +
           '<b>十位比个位重要得多，所以先定十位。</b>' };
  };

  /* ---------- 对外接口 ---------- */

  /** 这个知识点能不能现出题 */
  function can(tag) { return !!G[tag]; }

  /** 出一道。seed 决定出哪一道 —— 同一个种子永远出同一道 */
  function one(tag, seed) {
    if (!G[tag]) return null;
    var q = G[tag](mkRnd(seed));
    if (!q) return null;
    q.tag = q.tag || tag;
    q.gen = true;                  // 标记：这是现出的题，不是题库里的
    q.seed = seed;
    return q;
  }

  /** 出 n 道<b>互不相同</b>的题（按题干去重） */
  function many(tag, n, seed) {
    if (!G[tag]) return [];
    var out = [], seen = {}, s = seed || 1, guard = 0;
    while (out.length < n && guard < n * 40) {
      guard++;
      var q = one(tag, s + guard * 7919);
      if (!q) break;
      var k = q.q;
      if (seen[k]) continue;
      seen[k] = 1; out.push(q);
    }
    return out;
  }

  window.GEN = {
    can: can, one: one, many: many,
    tags: function () { return Object.keys(G); }
  };
})();
