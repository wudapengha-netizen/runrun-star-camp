/* ============================================================
   tools_gen.js —— 出题机自检
   用法：node tools_gen.js [每个知识点生成几道，默认 300]

   出题机的答案是算出来的，但「算的那段代码」本身也可能写错。
   所以这里<b>独立再算一遍</b>：把题干里的算式解析出来，用另一套
   代码求值，和生成器给的答案对照。对不上就报错。

   还会检查：
     · 同一个知识点连出 N 道，重复率高不高（重复太多说明参数范围太窄）
     · 减法有没有出现负数、除法有没有出现余数（三年级不该出现）
     · 选择题的正确选项下标在不在范围内、选项有没有重复
     · 填空题的答案是不是非空字符串
   ============================================================ */
const fs = require('fs');
const path = require('path');

global.window = {};
// 知识点总表：gen2 从里面派生题目
['syllabus-math', 'syllabus-chinese', 'syllabus-english', 'words-en'].forEach(function (n) {
  const p = path.join(__dirname, 'data', n + '.js');
  if (fs.existsSync(p)) eval(fs.readFileSync(p, 'utf8'));
});
eval(fs.readFileSync(path.join(__dirname, 'js', 'gen.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, 'js', 'gen2.js'), 'utf8'));
const GEN = window.GEN;

const N = parseInt(process.argv[2], 10) || 300;
let problems = 0;
function bad(tag, msg, q) {
  problems++;
  console.log('  ❌ [' + tag + '] ' + msg);
  if (q) console.log('       题：' + String(q.q).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').slice(0, 90));
}

/* ---------- 独立求值器：只认三年级会用的算式 ---------- */
function evalExpr(s) {
  // 去掉 HTML、全角、分数花括号
  s = String(s).replace(/<[^>]+>/g, '').replace(/[　\s]/g, '');
  s = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  if (!/^[\d+\-*/().]+$/.test(s)) return null;
  let v;
  try { v = Function('"use strict";return (' + s + ')')(); } catch (e) { return null; }
  return (typeof v === 'number' && isFinite(v)) ? v : null;
}

/* 从题干里抽出 "算式 = ___" 的算式部分 */
function exprsOf(qText) {
  const t = String(qText).replace(/<[^>]+>/g, '');
  const out = [];
  const re = /([\d\s+\-*/()×÷−]+?)\s*=\s*_{3,}/g;
  let m;
  while ((m = re.exec(t))) out.push(m[1]);
  return out;
}

console.log('每个知识点生成 ' + N + ' 道，逐题独立复核…\n');

const tags = GEN.tags();
let totalMade = 0;

tags.forEach(function (tag) {
  const seen = {};
  let dup = 0, checked = 0;

  for (let i = 0; i < N; i++) {
    const q = GEN.one(tag, i * 7919 + 13);
    if (!q) { bad(tag, '生成失败（返回 null）'); break; }
    totalMade++;

    const key = String(q.q);
    if (seen[key]) dup++; else seen[key] = 1;

    // —— 结构检查 ——
    if (!q.q || !String(q.q).trim()) bad(tag, '题干为空', q);
    if (!q.why || !String(q.why).trim()) bad(tag, '没有讲解', q);
    if (q.tag !== tag) bad(tag, 'tag 不一致：' + q.tag, q);

    if (q.type === 'choice') {
      if (!Array.isArray(q.o) || q.o.length < 2) bad(tag, '选项不足', q);
      else {
        if (typeof q.a !== 'number' || q.a < 0 || q.a >= q.o.length) bad(tag, '答案下标越界 ' + q.a, q);
        const u = {};
        q.o.forEach(function (x) {
          if (u[String(x)]) bad(tag, '选项重复：' + x, q);
          u[String(x)] = 1;
        });
      }
    } else if (q.type === 'fill') {
      if (!Array.isArray(q.a) || !q.a.length) bad(tag, '没有答案数组', q);
      else q.a.forEach(function (acc, k) {
        if (!Array.isArray(acc) || !acc.length) bad(tag, '第 ' + (k + 1) + ' 空没有可接受答案', q);
        else if (!String(acc[0]).trim()) bad(tag, '第 ' + (k + 1) + ' 空答案为空串', q);
      });
      // 题干里的 ___ 个数要和答案空数一致
      const marks = (String(q.q).replace(/<[^>]+>/g, '').match(/_{3,}/g) || []).length;
      if (marks && Array.isArray(q.a) && marks !== q.a.length) {
        bad(tag, '题干 ' + marks + ' 个空，却给了 ' + q.a.length + ' 组答案', q);
      }
      // —— 核心：把算式独立算一遍，和答案对照 ——
      const ex = exprsOf(q.q);
      if (ex.length && ex.length === q.a.length) {
        ex.forEach(function (e, k) {
          const v = evalExpr(e);
          if (v === null) return;                       // 不是纯算式（应用题等），跳过
          checked++;
          if (String(v) !== String(q.a[k][0])) {
            bad(tag, '答案对不上：' + e.trim() + ' 应为 ' + v + '，生成器给的是 ' + q.a[k][0], q);
          }
          if (v < 0) bad(tag, '出现负数 ' + v + '（三年级不该有）', q);
          if (!Number.isInteger(v)) bad(tag, '出现小数/余数 ' + v + '（三年级不该有）', q);
        });
      }
    } else {
      bad(tag, '未知题型：' + q.type, q);
    }
  }

  const uniq = Object.keys(seen).length;
  /* 判断标准不是「不重复率」——有些知识点本身变化就有限
     （比如「1 里面有几个几分之一」，分母只能是 2~9，穷尽就 8 种）。
     真正要看的是<b>绝对种数够不够反复练</b>：
       ≥30 种：够孩子刷很久，不会背下来
       10~29：够用，但同一天连做多轮会眼熟
       <10  ：太少，得给这个知识点加问法变体 */
  const flag = uniq >= 30 ? '✅' : uniq >= 10 ? '  ' : '⚠️';
  console.log(' ' + flag + ' ' + tag.padEnd(26) +
              String(uniq).padStart(5) + ' 种不同的题' +
              (checked ? '　　算式复核 ' + checked + ' 处' : ''));
  if (uniq < 10) console.log('      ⚠️ 变化太少（只有 ' + uniq + ' 种），该给这个知识点加问法变体');
});

console.log('\n共 ' + tags.length + ' 个知识点，生成 ' + totalMade + ' 道题');
console.log(problems ? '❌ 发现 ' + problems + ' 处问题' : '✅ 全部通过：答案与独立复算完全一致');
process.exit(problems ? 1 : 0);
