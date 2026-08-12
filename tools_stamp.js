/* ============================================================
   tools_stamp.js —— 给 HTML 里引用的 js/css 打内容指纹
   用法：node tools_stamp.js

   把 <script src="js/exam.js"> 改写成 <script src="js/exam.js?v=a1b2c3d4">，
   v 是这个文件内容的哈希前 8 位。<b>内容不变，指纹就不变</b>，
   所以不会白白让浏览器重下。

   为什么需要：
     改完 JS 之后，浏览器仍会用磁盘里缓存的旧版，页面行为和代码对不上。
     本地调试时我为此白查过半天「数据是不是错了」，而线上更糟 ——
     孩子的浏览器可能一直跑着旧代码，修好的 bug 在他那儿还在。

   每次改完 js/css，跑一遍这个再提交。
   ============================================================ */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const htmls = fs.readdirSync(ROOT).filter(function (f) { return f.endsWith('.html'); });

function hash(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
}

let changed = 0, stamped = 0, missing = [];
htmls.forEach(function (f) {
  const p = path.join(ROOT, f);
  let s = fs.readFileSync(p, 'utf8');
  const before = s;

  // src="js/xxx.js" 或 src="data/xxx.js" 或 href="css/xxx.css"，可能已带 ?v=
  s = s.replace(/(\s(?:src|href)=")((?:js|css|data|vendor)\/[^"?]+\.(?:js|css))(\?v=[0-9a-f]+)?(")/g,
    function (m, pre, rel, old, post) {
      const h = hash(rel);
      if (!h) { missing.push(f + ' → ' + rel); return m; }
      stamped++;
      return pre + rel + '?v=' + h + post;
    });

  if (s !== before) { fs.writeFileSync(p, s); changed++; console.log('  ✅ ' + f); }
});

console.log('\n打了指纹：' + stamped + ' 处引用，改写了 ' + changed + ' 个 HTML');
if (missing.length) {
  console.log('\n⚠️ 引用了不存在的文件：');
  missing.forEach(function (m) { console.log('   ' + m); });
  process.exit(1);
}
