/* ============================================================
   tools_check.js —— 试卷自检
   用法：node tools_check.js

   检查每份卷子的：
     · subtitle / intro 里声明的总分，和实际逐题加出来的分对不对得上
     · 大题 hint 里写的「共 N 分」对不对
     · 有没有题缺 tag、缺答案、选项下标越界
     · 填空题的空数和答案数对不对（问了两个空只给一个答案这种）

   起因：卷三卷四的副标题分数都写错了 —— 后来加了题却忘了改分。
   这种错不该靠人眼发现。
   ============================================================ */
const fs = require('fs');
const path = require('path');
global.window = {};

// 自动发现 data/ 下所有卷子 —— 别再写死名单。
// 之前写死过一次，新加的三份卷子根本没被检查，白跑了一遍「全部通过」。
const DATA = path.join(__dirname, 'data');
fs.readdirSync(DATA)
  .filter(function (f) { return /^exam-.*\.js$/.test(f); })
  .sort()
  .forEach(function (f) { eval(fs.readFileSync(path.join(DATA, f), 'utf8')); });

const PAPERS = Object.keys(window)
  .filter(function (k) { return /^EXAM_/.test(k) && window[k] && window[k].sections; })
  .map(function (k) { return window[k]; });

let problems = 0;
function bad(msg) { problems++; console.log('  ❌ ' + msg); }

PAPERS.forEach(function (P) {
  console.log('\n══ ' + P.title + '  (' + P.id + ') ══');
  let n = 0, total = 0;
  const secTotals = [];

  P.sections.forEach(function (sec) {
    let sn = 0, sp = 0;
    const lists = sec.groups
      ? sec.groups.map(function (g) { return { items: g.items, per: g.per || sec.per, type: g.type || sec.type }; })
      : [{ items: sec.items, per: sec.per, type: sec.type }];

    lists.forEach(function (L) {
      (L.items || []).forEach(function (it) {
        n++; sn++;
        const per = L.per;
        if (!per) bad('第 ' + n + ' 题没有分值');
        total += per || 0; sp += per || 0;

        if (!it.tag) bad('第 ' + n + ' 题没有 tag');
        if (!it.why) bad('第 ' + n + ' 题没有讲解');

        if (L.type === 'choice' || L.type === 'listen') {
          if (!Array.isArray(it.o)) bad('第 ' + n + ' 题是选择题却没有选项');
          else if (typeof it.a !== 'number') bad('第 ' + n + ' 题答案不是选项下标');
          else if (it.a < 0 || it.a >= it.o.length) bad('第 ' + n + ' 题答案下标 ' + it.a + ' 越界（共 ' + it.o.length + ' 个选项）');
        } else {
          if (!Array.isArray(it.a)) { bad('第 ' + n + ' 题是填空却没有答案数组'); return; }
          it.a.forEach(function (acc, i) {
            if (!Array.isArray(acc) || !acc.length) bad('第 ' + n + ' 题第 ' + (i + 1) + ' 空没有可接受答案');
          });
          // 题干里的 ___ 数量应该和答案空数一致
          const marks = (String(it.q).match(/_{3,}/g) || []).length;
          if (marks && marks !== it.a.length) {
            bad('第 ' + n + ' 题：题干有 ' + marks + ' 个空，却给了 ' + it.a.length +
                ' 组答案　→ ' + String(it.q).replace(/<[^>]+>/g, '').slice(0, 50));
          }
        }
      });
    });

    secTotals.push({ name: sec.name, n: sn, p: sp, hint: sec.hint || '' });
    // 大题 hint 里写的「共 N 分」
    const m = (sec.hint || '').match(/共\s*(\d+)\s*分/);
    if (m && Number(m[1]) !== sp) {
      bad('大题「' + sec.name + '」hint 写「共 ' + m[1] + ' 分」，实际 ' + sp + ' 分');
    }
  });

  // 卷首声明的总分
  [['subtitle', P.subtitle], ['intro', P.intro]].forEach(function (pair) {
    const m = String(pair[1] || '').match(/共\s*(\d+)\s*分/);
    if (m && Number(m[1]) !== total) {
      bad(pair[0] + ' 写「共 ' + m[1] + ' 分」，实际 ' + total + ' 分');
    }
  });

  console.log('  ' + n + ' 题　' + total + ' 分');
  secTotals.forEach(function (s) {
    console.log('    ' + String(s.name).padEnd(24) + String(s.n).padStart(3) + ' 题' + String(s.p).padStart(5) + ' 分');
  });
});

console.log('\n' + (problems ? '❌ 共 ' + problems + ' 处问题' : '✅ 全部卷子自检通过'));
process.exit(problems ? 1 : 0);
