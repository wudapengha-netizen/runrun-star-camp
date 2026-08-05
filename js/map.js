/* ============================================================
   map.js —— 31 天闯关地图
   ============================================================ */
(function () {
  'use strict';

  function render() {
    var el = Quiz.el, esc = Quiz.esc;
    var root = document.getElementById('view');
    root.innerHTML = '';
    var wrap = el('div', 'wrap');
    var today = Store.dayNumberFor();
    var lv = Store.level();

    // —— 页头 ——
    var head = el('div', 'map-head');
    var doneCount = 0;
    for (var i = 1; i <= 31; i++) if (Store.isDayDone(i)) doneCount++;

    head.innerHTML =
      '<div><h1 class="map-title">' + esc(PROFILE.siteName || (PROFILE.name + '的三年级闯关营')) +
      '<small>八月三十一关 · 语文 数学 英语 · 已通 ' + doneCount + ' / 31 关</small></h1></div>';

    var right = el('div');
    right.style.cssText = 'text-align:right';
    right.innerHTML =
      '<div style="font-size:14px;color:var(--ink-soft)">当前称号</div>' +
      '<div class="rank-seal" style="font-size:25px;margin:5px 0">' + esc(lv.title) + '</div>' +
      '<div style="font-size:13px;color:var(--ink-soft)">' +
      (lv.next ? '距「' + esc(lv.next.title) + '」还差 ' + (lv.next.xp - Store.state.xp) + ' XP' : '已达最高等级') +
      '</div>';
    head.appendChild(right);
    wrap.appendChild(head);

    // —— 今日快捷入口 ——
    if (today >= 1 && today <= 31) {
      var p = PLAN.days[today] || {};
      var jump = el('div', 'card card--fold');
      jump.style.cssText = 'margin-bottom:26px;background:linear-gradient(135deg,#fdf3dc,#f6e6c2)';
      jump.innerHTML =
        '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">' +
        '<div style="font-size:50px">' + esc(PROFILE.avatar || '🐯') + '</div>' +
        '<div style="flex:1;min-width:230px">' +
        '<h2 style="font-size:26px">今天是第 ' + today + ' 关（' + esc(p.date || '') + '）</h2>' +
        '<div style="color:var(--ink-soft);margin-top:3px">' +
        esc(p.chinese || '') + '　｜　' + esc(p.math || '') + '　｜　' + esc(p.english || '') +
        '</div></div></div>';
      var b = el('button', 'btn btn-primary', Store.isDayDone(today) ? '再练一遍今天的 →' : '开始今天的闯关 →');
      b.type = 'button';
      b.style.cssText = 'margin-top:16px;font-size:21px;padding:14px 34px';
      b.onclick = function () { SFX.unlock(); SFX.play('tap'); Day.open(today); };
      jump.appendChild(b);
      wrap.appendChild(jump);
    }

    // —— 五个关区 ——
    PLAN.regions.forEach(function (reg) {
      var box = el('div', 'region');
      box.dataset.region = reg.id;

      var nm = el('div', 'region-name');
      nm.innerHTML =
        '<span class="roman">' + ['', '一', '二', '三', '四', '五'][reg.id] + '</span>' +
        '<span>' + esc(reg.name) + '</span>' +
        '<span class="sub">' + esc(reg.sub) + '</span>';
      box.appendChild(nm);

      var row = el('div', 'day-row');
      reg.days.forEach(function (n) {
        row.appendChild(seal(n, today));
      });
      box.appendChild(row);
      wrap.appendChild(box);
    });

    // —— 单科总测入口 ——
    var tests = el('div', 'card card--fold');
    tests.style.cssText = 'margin-bottom:26px;background:linear-gradient(135deg,#e9f0f6,#dbe7f1)';
    tests.appendChild(el('div', 'seal-title', '整册总测'));
    tests.appendChild(el('hr', 'rule'));
    var tp = el('div', 'q-sub');
    tp.innerHTML = '不按天走，直接考<b>一整本书</b>的知识点。' +
                   '想摸底、或者学完想检验一下，就来做这个。选择题点选，填空和计算直接打字，交卷马上出分。';
    tests.appendChild(tp);
    var trow = el('div');
    trow.style.cssText = 'display:flex;gap:14px;flex-wrap:wrap;margin-top:16px';
    var tmath = el('button', 'btn btn-primary', '📐 数学期末测试（一）· 全册 150 分');
    tmath.type = 'button';
    tmath.style.fontSize = '18px';
    tmath.onclick = function () { SFX.play('tap'); location.href = 'exam-math.html'; };
    trow.appendChild(tmath);
    var tcn = el('button', 'btn btn-primary', '📖 语文期末测试（一）· 全册 152 分');
    tcn.type = 'button';
    tcn.style.cssText = 'font-size:18px;background:var(--cinnabar)';
    tcn.onclick = function () { SFX.play('tap'); location.href = 'exam-chinese.html'; };
    trow.appendChild(tcn);
    var ten = el('button', 'btn btn-primary', '🔤 英语期末测试（一）· 全册 162 分');
    ten.type = 'button';
    ten.style.cssText = 'font-size:18px;background:var(--jade)';
    ten.onclick = function () { SFX.play('tap'); location.href = 'exam-english.html'; };
    trow.appendChild(ten);
    tests.appendChild(trow);
    wrap.appendChild(tests);

    // —— 徽章墙 ——
    var bwrap = el('div', 'card');
    bwrap.style.marginTop = '10px';
    bwrap.appendChild(el('div', 'seal-title', '徽章墙'));
    bwrap.appendChild(el('hr', 'rule'));
    var grid = el('div', 'badge-grid');
    (window.BADGES || []).forEach(function (b) {
      var got = Store.hasBadge(b.id);
      var it = el('div', 'badge-item' + (got ? '' : ' locked'));
      it.innerHTML = '<div class="ic">' + b.ic + '</div><div class="nm">' + esc(b.name) + '</div>';
      it.title = b.hint;
      grid.appendChild(it);
    });
    bwrap.appendChild(grid);
    wrap.appendChild(bwrap);

    root.appendChild(wrap);
    window.scrollTo(0, 0);
  }

  function seal(n, today) {
    var el = Quiz.el, esc = Quiz.esc;
    var p = PLAN.days[n] || {};
    var unlocked = Store.isUnlocked(n);
    var done = Store.isDayDone(n);
    var isBoss = !!(p.boss || p.exam);

    var cls = 'day-seal';
    if (isBoss) cls += ' boss';
    if (done) cls += ' done';
    else if (n === today) cls += ' today';
    if (!unlocked) cls += ' locked';

    var d = el('div', cls);
    var tag = p.exam ? '开学挑战' : p.boss ? esc(p.bossName || '周关') : (done ? '已通关' : unlocked ? '去闯关' : '未解锁');

    d.innerHTML =
      '<span class="d-date">' + esc(p.date || '') + '</span>' +
      '<span class="d-num">' + n + '</span>' +
      '<span class="d-tag">' + tag + '</span>';

    d.title = unlocked
      ? (p.chinese || '') + ' / ' + (p.math || '') + ' / ' + (p.english || '')
      : '先通过第 ' + (n - 1) + ' 关';

    if (unlocked) {
      d.onclick = function () {
        SFX.unlock();
        SFX.play('tap');
        if (p.exam && window.Exam) { location.href = 'exam.html'; return; }
        Day.open(n);
      };
    }
    return d;
  }

  window.MapView = { render: render };
})();
