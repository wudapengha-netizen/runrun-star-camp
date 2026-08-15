/* ============================================================
   tools_cov.js —— 知识点覆盖率报表
   用法：node tools_cov.js [math|chinese|english|all]

   把「知识点总表」和「已出的卷子」对一遍，回答三个问题：
     1. 这本书的知识点考到了几成？还有哪些一次都没考过？
     2. 卷子里有没有「野生 tag」（清单里查不到出处的）？
     3. 有没有一个正名被多个知识点占用（会让覆盖率虚高）？

   ⚠️ 比对前先用 canon() 把别名归一。
      早先没归一时，「多位数乘一位数·中间有0」和「乘法·中间有0」被
      当成两个知识点，覆盖率虚高，循环出题还找不到跨卷的变式题。
   ============================================================ */
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, 'data');
global.window = {};
fs.readdirSync(DATA)
  .filter(function (f) { return /^(syllabus|exam)-.*\.js$/.test(f); })
  .sort()
  .forEach(function (f) { eval(fs.readFileSync(path.join(DATA, f), 'utf8')); });

const WANT = (process.argv[2] || 'all').toLowerCase();
const SUBJECTS = ['math', 'chinese', 'english'].filter(function (s) {
  return WANT === 'all' || WANT === s;
});

let anyGap = false;

SUBJECTS.forEach(function (subj) {
  const S = window['SYLLABUS_' + subj.toUpperCase()];
  if (!S) { console.log('\n（没有 ' + subj + ' 的知识点总表）'); return; }

  const papers = Object.keys(window)
    .filter(function (k) { return /^EXAM_/.test(k) && window[k] && window[k].subject === subj; })
    .map(function (k) { return window[k]; });

  const used = {}, raw = {};
  papers.forEach(function (P) {
    P.sections.forEach(function (sec) {
      (sec.groups || [{ items: sec.items }]).forEach(function (L) {
        (L.items || []).forEach(function (it) {
          if (!it.tag) return;
          raw[it.tag] = (raw[it.tag] || 0) + 1;
          const c = S.canon(it.tag);
          used[c] = (used[c] || 0) + 1;
        });
      });
    });
  });

  let total = 0, done = 0;
  const gaps = [], rows = [];
  S.units.forEach(function (u) {
    let n = 0, c = 0;
    u.points.forEach(function (p) {
      total++; n++;
      if (used[p.tag]) { done++; c++; }
      else gaps.push({ id: p.id, point: p.point.replace(/<[^>]+>/g, ''), page: p.page, tag: p.tag });
    });
    rows.push([u.unit, 'p' + u.from + '-' + u.to, n, c]);
  });

  const known = {};
  S.units.forEach(function (u) { u.points.forEach(function (p) { known[p.tag] = 1; }); });
  const orphan = Object.keys(raw).filter(function (t) { return !known[S.canon(t)]; });

  const dup = {};
  S.units.forEach(function (u) {
    u.points.forEach(function (p) { (dup[p.tag] = dup[p.tag] || []).push(p.id); });
  });
  const shared = Object.keys(dup).filter(function (t) { return dup[t].length > 1; });

  const pct = Math.round(done / total * 100);
  console.log('\n' + '═'.repeat(62));
  console.log(' 【' + S.name + '】 ' + pct + '%　（' + done + ' / ' + total + ' 个知识点）');
  console.log('  卷子：' + (papers.map(function (p) { return p.id; }).join('  ') || '（无）'));
  console.log('═'.repeat(62));
  rows.forEach(function (r) {
    const bar = r[3] === r[2] ? '✅' : r[3] === 0 ? '❌' : '  ';
    console.log(' ' + bar + ' ' + String(r[0]).padEnd(34) + String(r[1]).padEnd(11) +
                String(r[3]).padStart(3) + '/' + String(r[2]).padEnd(3) +
                String(Math.round(r[3] / r[2] * 100) + '%').padStart(6));
  });

  if (gaps.length) {
    anyGap = true;
    console.log('\n ── 还没考过（' + gaps.length + '）──');
    gaps.forEach(function (g) {
      console.log('   [' + g.id + '] ' + g.point + '　教材 p' + g.page + '　tag=' + g.tag);
    });
  } else {
    console.log('\n 🎉 全部知识点都已出题');
  }

  if (orphan.length) {
    console.log('\n ⚠️ 野生 tag（清单里查不到出处，' + orphan.length + ' 个）');
    orphan.forEach(function (o) { console.log('   ' + o + '  (' + raw[o] + ' 题)'); });
  }
  if (shared.length) {
    console.log('\n ⚠️ 一个正名被多个知识点占用（覆盖率会虚高）');
    shared.forEach(function (t) { console.log('   ' + t + ' ← ' + dup[t].join(', ')); });
  }
});

console.log('');
process.exit(anyGap ? 1 : 0);
