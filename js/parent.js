/* ============================================================
   parent.js —— 家长端：打卡日历 / 各科正确率 / 每日小结 / 错题汇总 / 薄弱点
   ============================================================ */
(function () {
  'use strict';

  var el, esc;

  function boot() {
    el = Quiz.el; esc = Quiz.esc;
    var root = document.getElementById('view');
    root.innerHTML = '<div class="wrap"><div class="empty"><div class="ic">📜</div>' +
                     '<h2>正在读取存档…</h2></div></div>';
    Store.boot((window.PROFILE && PROFILE.name) || 'default').then(function () {
      document.documentElement.dataset.motion = Store.state.settings.motion === false ? 'off' : 'on';
      render();
    });
  }

  function render() {
    var root = document.getElementById('view');
    root.innerHTML = '';
    var wrap = el('div', 'wrap');

    wrap.appendChild(header());
    wrap.appendChild(saveStatus());
    wrap.appendChild(overview());
    wrap.appendChild(calendar());
    wrap.appendChild(subjectTrend());
    wrap.appendChild(dailySummaries());
    wrap.appendChild(weakPoints());
    wrap.appendChild(masteryHistory());
    wrap.appendChild(wrongBook());
    wrap.appendChild(tools());

    root.appendChild(wrap);
  }

  /* ---------- 存档状态 ---------- */
  function saveStatus() {
    var st = window.Storage2 ? Storage2.status : { mode: 'local' };
    var box = el('div', 'card');
    box.style.cssText = 'margin-bottom:24px;border-left:9px solid ' +
      (st.mode === 'server' ? 'var(--grass)' : 'var(--gold-deep)');

    var n = Store.state.journal ? Store.state.journal.length : 0;
    if (st.mode === 'cloud') {
      box.style.borderLeftColor = 'var(--jade)';
      box.innerHTML =
        '<div style="display:flex;gap:16px;align-items:flex-start">' +
        '<div style="font-size:34px">☁️</div><div style="flex:1">' +
        '<h2>云端存档已开启</h2>' +
        '<p style="margin:6px 0 0">进度存在云端，<b>任何电脑、平板、手机打开网址都是最新的</b>。' +
        '已经记下 <b class="num">' + n + '</b> 条答题流水。</p>' +
        '<p style="margin:6px 0 0;color:var(--ink-soft);font-size:15px">' +
        '断网也能继续做题，记录先存本机、联网后自动补传。' +
        '云端每次覆盖前都会留一份快照（保留 20 份 / 90 天）。' +
        '保险起见，还是建议每周点一次下面的「导出存档」，在自己电脑上留个底。</p>' +
        '</div></div>';
    } else if (st.mode === 'server') {
      box.innerHTML =
        '<div style="display:flex;gap:16px;align-items:flex-start">' +
        '<div style="font-size:34px">🗄️</div><div style="flex:1">' +
        '<h2>文件存档已开启</h2>' +
        '<p style="margin:6px 0 0">记录写在 <b>study\\save\\' + esc(PROFILE.name) + '.json</b>，' +
        '每次保存前自动备份到 <b>save\\backup\\</b>（保留最近 40 份）。' +
        '已经记下 <b class="num">' + n + '</b> 条答题流水。</p>' +
        '<p style="margin:6px 0 0;color:var(--ink-soft);font-size:15px">' +
        '把整个 study 文件夹放进云盘同步目录，另一台电脑装同一个云盘 + 双击 start.bat，记录就自动跟过去。' +
        '两台电脑请错开用，别同时开。</p>' +
        '</div></div>';
    } else {
      box.innerHTML =
        '<div style="display:flex;gap:16px;align-items:flex-start">' +
        '<div style="font-size:34px">📌</div><div style="flex:1">' +
        '<h2>目前只存在这个浏览器里</h2>' +
        '<p style="margin:6px 0 0">你是直接双击 index.html 打开的，记录存在 Chrome 本地存储中——' +
        '<b>换电脑带不走，清缓存会丢</b>。已记下 <b class="num">' + n + '</b> 条答题流水。</p>' +
        '<p style="margin:6px 0 0">想跨电脑用：改成双击 <b>study\\start.bat</b> 打开，' +
        '记录会变成 save 文件夹里的真文件。现在的记录不会丢，切过去时自动带走。</p>' +
        '</div></div>';
    }
    if (st.error) {
      var w = el('div', 'comment');
      w.innerHTML = '⚠️ ' + esc(st.error);
      box.appendChild(w);
    }
    return box;
  }

  /* ---------- 知识点掌握历程（基于逐题流水账） ---------- */
  function masteryHistory() {
    var box = el('div', 'card');
    box.style.marginBottom = '24px';
    box.appendChild(el('div', 'seal-title', '知识点掌握历程'));
    box.appendChild(el('hr', 'rule'));

    var j = Store.state.journal || [];
    if (!j.length) {
      box.appendChild(emptyNote('还没有答题流水。孩子做过题以后，这里会按知识点显示练了多少、什么时候练稳的。'));
      return box;
    }

    var p = el('div', 'q-sub');
    p.innerHTML = '这里的数据来自<b>逐题流水账</b>：每答一道题都记了时间、知识点和对错。' +
                  '<b>最近 5 题</b>能看出现在稳不稳，<b>累计</b>能看出练了多少。';
    box.appendChild(p);

    // 按知识点聚合，保留时间顺序以便算"最近 5 题"
    var byTag = {};
    j.forEach(function (r) {
      (r.tags || []).forEach(function (t) {
        (byTag[t] = byTag[t] || { tag: t, subject: r.subject, seq: [] }).seq.push(r);
      });
    });

    var rows = Object.keys(byTag).map(function (t) {
      var x = byTag[t];
      x.seq.sort(function (a, b) { return a.ts - b.ts; });
      var total = x.seq.length;
      var right = x.seq.filter(function (r) { return r.ok; }).length;
      var last5 = x.seq.slice(-5);
      var last5Right = last5.filter(function (r) { return r.ok; }).length;
      return {
        tag: t, subject: x.subject, total: total, right: right,
        pct: Math.round(right / total * 100),
        recent: last5.map(function (r) { return r.ok; }),
        recentPct: Math.round(last5Right / last5.length * 100),
        lastTs: x.seq[x.seq.length - 1].ts
      };
    }).sort(function (a, b) { return a.recentPct - b.recentPct || b.total - a.total; });

    var NAME = { chinese: '语文', math: '数学', english: '英语', boss: 'Boss', review: '回顾' };
    var tbl = el('table', 'score-table');
    tbl.innerHTML = '<thead><tr><th>知识点</th><th>科目</th><th>练了</th>' +
                    '<th>累计正确率</th><th>最近 5 题</th></tr></thead>';
    var tb = el('tbody');
    rows.slice(0, 30).forEach(function (x) {
      var dots = x.recent.map(function (ok) {
        return '<span style="display:inline-block;width:14px;height:14px;border-radius:4px;' +
               'border:2px solid var(--ink);margin-right:3px;background:' +
               (ok ? 'var(--grass)' : 'var(--cinnabar)') + '"></span>';
      }).join('');
      var tr = el('tr');
      tr.innerHTML =
        '<td><b>' + esc(x.tag) + '</b></td>' +
        '<td>' + (NAME[x.subject] || '') + '</td>' +
        '<td class="num">' + x.total + ' 题</td>' +
        '<td class="pct" style="color:' + Summary.pctColor(x.pct) + '">' + x.pct + '%</td>' +
        '<td>' + dots + '</td>';
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);

    var scroll = el('div');
    scroll.style.cssText = 'overflow-x:auto';
    scroll.appendChild(tbl);
    box.appendChild(scroll);

    if (rows.length > 30) {
      box.appendChild(el('div', 'q-sub', '（共 ' + rows.length + ' 个知识点，按最近表现最差的排在前面，这里显示前 30 个）'));
    }
    return box;
  }

  /* ---------- 页头 ---------- */
  function header() {
    var h = el('div', 'map-head');
    h.innerHTML =
      '<div><h1 class="map-title">' + esc(PROFILE.name) + '的学习报告' +
      '<small>家长查看 · 数据全部存在本机浏览器里，不会上传到任何地方</small></h1></div>';
    var b = el('button', 'btn', '← 回孩子的闯关页');
    b.type = 'button';
    b.onclick = function () { location.href = 'index.html'; };
    h.appendChild(b);
    return h;
  }

  /* ---------- 总览数字 ---------- */
  function overview() {
    var s = Store.state;
    var lv = Store.level();
    var doneDays = 0, totalQ = 0, totalRight = 0, totalMin = 0;

    for (var i = 1; i <= 31; i++) {
      var r = Store.dayRec(i);
      if (r.finishedAt) doneDays++;
      Object.keys(r.stats).forEach(function (k) {
        var st = r.stats[k];
        totalQ += st.total || 0;
        totalRight += st.right || 0;
        totalMin += (st.seconds || 0) / 60;
      });
    }
    var pct = totalQ ? Math.round(totalRight / totalQ * 100) : 0;

    var box = el('div', 'card');
    box.style.marginBottom = '24px';
    var grid = el('div');
    grid.style.cssText =
      'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:18px;text-align:center';

    [
      ['已通关', doneDays + ' / 31', '天'],
      ['累计做题', totalQ, '道'],
      ['总正确率', pct + '%', '', Summary.pctColor(pct)],
      ['累计用时', Math.round(totalMin), '分钟'],
      ['连续打卡', s.streak, '天'],
      ['当前称号', lv.title, '', 'var(--cinnabar)']
    ].forEach(function (x) {
      var d = el('div');
      d.innerHTML =
        '<div style="font-size:14px;color:var(--ink-soft)">' + x[0] + '</div>' +
        '<div class="num" style="font-size:32px;font-weight:700;line-height:1.3;color:' +
        (x[3] || 'var(--ink)') + '">' + x[1] + '</div>' +
        '<div style="font-size:13px;color:var(--ink-faint)">' + (x[2] || '') + '</div>';
      grid.appendChild(d);
    });
    box.appendChild(grid);
    return box;
  }

  /* ---------- 打卡日历 ---------- */
  function calendar() {
    var box = el('div', 'card');
    box.style.marginBottom = '24px';
    box.appendChild(el('div', 'seal-title', '八月打卡日历'));
    box.appendChild(el('hr', 'rule'));

    var grid = el('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:8px;max-width:560px';

    ['日', '一', '二', '三', '四', '五', '六'].forEach(function (w) {
      var d = el('div', '', w);
      d.style.cssText = 'text-align:center;font-weight:700;color:var(--ink-soft);font-size:14px';
      grid.appendChild(d);
    });

    // 2026-08-01 是星期六
    var firstDow = new Date('2026-08-01T00:00:00').getDay();
    for (var i = 0; i < firstDow; i++) grid.appendChild(el('div'));

    var today = Store.dayNumberFor();
    for (var n = 1; n <= 31; n++) {
      var rec = Store.dayRec(n);
      var done = !!rec.finishedAt;
      var partial = !done && Object.keys(rec.stats).length > 0;
      var cell = el('div');
      var bg = done ? 'var(--cinnabar)' : partial ? 'var(--gold-wash)' : 'var(--paper)';
      var fg = done ? '#fff3ec' : 'var(--ink)';
      cell.style.cssText =
        'aspect-ratio:1;display:grid;place-items:center;border:2.5px solid var(--ink);' +
        'border-radius:9px;font-family:var(--font-num);font-weight:700;font-size:17px;' +
        'background:' + bg + ';color:' + fg +
        (n === today ? ';box-shadow:0 0 0 3px var(--gold)' : '');
      cell.textContent = n;
      cell.title = '8月' + n + '日' + (done ? ' · 已通关' : partial ? ' · 做了一部分' : ' · 未开始');
      grid.appendChild(cell);
    }
    box.appendChild(grid);

    var legend = el('div');
    legend.style.cssText = 'margin-top:14px;font-size:14px;color:var(--ink-soft);display:flex;gap:20px;flex-wrap:wrap';
    legend.innerHTML =
      '<span><span style="display:inline-block;width:14px;height:14px;background:var(--cinnabar);' +
      'border:2px solid var(--ink);border-radius:4px;vertical-align:-2px"></span> 已通关</span>' +
      '<span><span style="display:inline-block;width:14px;height:14px;background:var(--gold-wash);' +
      'border:2px solid var(--ink);border-radius:4px;vertical-align:-2px"></span> 做了一部分</span>' +
      '<span><span style="display:inline-block;width:14px;height:14px;background:var(--paper);' +
      'border:2px solid var(--ink);border-radius:4px;vertical-align:-2px"></span> 未开始</span>';
    box.appendChild(legend);
    return box;
  }

  /* ---------- 各科正确率趋势 ---------- */
  function subjectTrend() {
    var box = el('div', 'card');
    box.style.marginBottom = '24px';
    box.appendChild(el('div', 'seal-title', '各科正确率趋势'));
    box.appendChild(el('hr', 'rule'));

    var subs = [
      { k: 'chinese', n: '语文', c: 'var(--s-chinese)' },
      { k: 'math', n: '数学', c: 'var(--s-math)' },
      { k: 'english', n: '英语', c: 'var(--s-english)' }
    ];

    var any = false;
    subs.forEach(function (s) {
      var pts = [];
      for (var n = 1; n <= 31; n++) {
        var st = Store.dayRec(n).stats[s.k];
        if (st && st.total) pts.push({ d: n, pct: Math.round(st.right / st.total * 100) });
      }
      if (!pts.length) return;
      any = true;

      var avg = Math.round(pts.reduce(function (a, p) { return a + p.pct; }, 0) / pts.length);
      var row = el('div');
      row.style.cssText = 'margin-bottom:20px';
      row.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">' +
        '<b style="font-family:var(--font-brush);font-size:19px;color:' + s.c + '">' + s.n + '</b>' +
        '<span style="font-size:14px;color:var(--ink-soft)">平均正确率 ' +
        '<b class="num" style="font-size:19px;color:' + Summary.pctColor(avg) + '">' + avg + '%</b>' +
        '　共 ' + pts.length + ' 天</span></div>';

      // 柱状图（纯 CSS）
      var bars = el('div');
      bars.style.cssText = 'display:flex;gap:5px;align-items:flex-end;height:74px;' +
                           'border-bottom:2.5px solid var(--ink);padding-bottom:2px';
      pts.forEach(function (p) {
        var b = el('div');
        b.style.cssText =
          'flex:1;max-width:34px;height:' + Math.max(6, p.pct * 0.7) + 'px;' +
          'background:' + s.c + ';border:2px solid var(--ink);border-radius:5px 5px 0 0;' +
          'opacity:' + (0.45 + p.pct / 200) + ';position:relative';
        b.title = '第 ' + p.d + ' 关：' + p.pct + '%';
        bars.appendChild(b);
      });
      row.appendChild(bars);

      var labels = el('div');
      labels.style.cssText = 'display:flex;gap:5px;font-size:11px;color:var(--ink-faint);margin-top:3px';
      pts.forEach(function (p) {
        var l = el('div', '', String(p.d));
        l.style.cssText = 'flex:1;max-width:34px;text-align:center';
        labels.appendChild(l);
      });
      row.appendChild(labels);
      box.appendChild(row);
    });

    if (!any) box.appendChild(emptyNote('还没有做题记录。'));
    return box;
  }

  /* ---------- 每日掌握小结存档 ---------- */
  function dailySummaries() {
    var box = el('div', 'card');
    box.style.marginBottom = '24px';
    box.appendChild(el('div', 'seal-title', '每日掌握情况小结'));
    box.appendChild(el('hr', 'rule'));

    var found = 0;
    for (var n = 31; n >= 1; n--) {
      var rec = Store.dayRec(n);
      if (!rec.summary) continue;
      found++;
      var sum = rec.summary;
      var p = PLAN.days[n] || {};

      var d = el('details');
      d.style.cssText = 'border:2.5px solid var(--ink);border-radius:12px;margin-bottom:11px;' +
                        'background:var(--paper);overflow:hidden';
      if (found === 1) d.open = true;

      var sm = el('summary');
      sm.style.cssText = 'padding:13px 18px;cursor:pointer;font-family:var(--font-brush);font-size:18px;' +
                         'display:flex;justify-content:space-between;gap:14px;align-items:center;' +
                         'background:var(--paper-warm)';
      sm.innerHTML =
        '<span>第 ' + n + ' 关 · ' + esc(p.date || '') + '</span>' +
        '<span style="font-family:var(--font-num);font-size:20px;color:' +
        Summary.pctColor(sum.pct) + '">' + sum.pct + '%　' +
        '<span style="font-size:14px;color:var(--ink-soft);font-family:var(--font-body)">' +
        sum.totalRight + '/' + sum.totalQ + ' 题</span></span>';
      d.appendChild(sm);

      var body = el('div');
      body.style.cssText = 'padding:16px 18px';
      body.appendChild(Summary.render(sum));
      d.appendChild(body);
      box.appendChild(d);
    }

    if (!found) box.appendChild(emptyNote('孩子完成一整天的关卡后，这里会出现当天的掌握情况小结。'));
    return box;
  }

  /* ---------- 薄弱知识点 Top 5 ---------- */
  function weakPoints() {
    var box = el('div', 'card');
    box.style.marginBottom = '24px';
    box.appendChild(el('div', 'seal-title', '最需要补的知识点'));
    box.appendChild(el('hr', 'rule'));

    var tags = {};
    for (var n = 1; n <= 31; n++) {
      var rec = Store.dayRec(n);
      Object.keys(rec.stats).forEach(function (k) {
        (rec.stats[k].log || []).forEach(function (item) {
          (item.tags || []).forEach(function (t) {
            if (!tags[t]) tags[t] = { right: 0, total: 0, subject: item.subject };
            tags[t].total++;
            if (item.ok) tags[t].right++;
          });
        });
      });
    }

    var list = Object.keys(tags).map(function (t) {
      var x = tags[t];
      return { tag: t, right: x.right, total: x.total, pct: Math.round(x.right / x.total * 100), subject: x.subject };
    }).filter(function (x) { return x.pct < 100; })
      .sort(function (a, b) { return a.pct - b.pct || b.total - a.total; })
      .slice(0, 8);

    if (!list.length) {
      box.appendChild(emptyNote(
        Object.keys(tags).length
          ? '👏 目前所有知识点都是全对，暂时没有需要补的。'
          : '还没有做题记录。'));
      return box;
    }

    var tbl = el('table', 'score-table');
    tbl.innerHTML = '<thead><tr><th>知识点</th><th>科目</th><th>正确率</th><th>对/总</th></tr></thead>';
    var tb = el('tbody');
    var NAME = { chinese: '语文', math: '数学', english: '英语', boss: 'Boss', review: '回顾' };
    list.forEach(function (x) {
      var tr = el('tr');
      tr.innerHTML =
        '<td><b>' + esc(x.tag) + '</b></td>' +
        '<td>' + (NAME[x.subject] || '') + '</td>' +
        '<td class="pct" style="color:' + Summary.pctColor(x.pct) + '">' + x.pct + '%</td>' +
        '<td class="num">' + x.right + ' / ' + x.total + '</td>';
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    box.appendChild(tbl);

    var tip = el('div', 'comment');
    tip.innerHTML = '<b>建议：</b>这几个知识点孩子反复出错，可以在他做完当天关卡后，' +
      '口头再问一遍最上面两条。系统也会在第二天的「昨日回顾」里自动重出这些题。';
    box.appendChild(tip);
    return box;
  }

  /* ---------- 错题本 ---------- */
  function wrongBook() {
    var box = el('div', 'card');
    box.style.marginBottom = '24px';
    var wb = Store.state.wrongBook;
    box.appendChild(el('div', 'seal-title', '错题本（' + wb.length + ' 题）'));
    box.appendChild(el('hr', 'rule'));

    if (!wb.length) {
      box.appendChild(emptyNote('错题本是空的 —— 要么还没做题，要么错题都已经"毕业"了。'));
      return box;
    }

    var note = el('div', 'q-sub');
    note.style.marginBottom = '12px';
    note.innerHTML = '规则：答错自动进错题本，第二天的「昨日回顾」优先出这些题，' +
                     '<b>连续答对 2 次就自动移出</b>。';
    box.appendChild(note);

    var NAME = { chinese: '语文', math: '数学', english: '英语', boss: 'Boss', review: '回顾' };
    var COLOR = { chinese: 'var(--s-chinese)', math: 'var(--s-math)', english: 'var(--s-english)' };

    var byS = {};
    wb.forEach(function (w) {
      var k = w.subject || 'other';
      (byS[k] = byS[k] || []).push(w);
    });

    Object.keys(byS).forEach(function (k) {
      var h = el('div');
      h.style.cssText = 'font-family:var(--font-brush);font-size:18px;margin:14px 0 8px;color:' +
                        (COLOR[k] || 'var(--ink)');
      h.textContent = (NAME[k] || k) + '（' + byS[k].length + '）';
      box.appendChild(h);

      byS[k].forEach(function (w) {
        var it = el('div');
        it.style.cssText = 'border:2px solid var(--paper-edge);border-left:6px solid ' +
          (COLOR[k] || 'var(--ink-soft)') + ';border-radius:9px;padding:11px 15px;margin-bottom:8px;' +
          'background:#fffdf5';
        it.innerHTML =
          '<div style="font-size:16px">' + Quiz.rich(w.q.q || '（图形题）') + '</div>' +
          '<div style="font-size:13px;color:var(--ink-soft);margin-top:4px">' +
          '第 ' + w.day + ' 关　·　知识点：' + esc((w.tags || []).join('、') || '未标注') +
          '　·　已连对 ' + w.streak + '/2 次</div>';
        box.appendChild(it);
      });
    });
    return box;
  }

  /* ---------- 工具 ---------- */
  function tools() {
    var box = el('div', 'card');
    box.appendChild(el('div', 'seal-title', '存档管理'));
    box.appendChild(el('hr', 'rule'));

    var p = el('div', 'q-sub');
    p.innerHTML = '学习记录只存在你自己的电脑上，不会上传到任何地方。' +
      '换电脑、或者担心误操作，随时可以导出一份备份。' +
      (window.Storage2 && Storage2.mode === 'server'
        ? '<br>（文件存档模式下，系统已经在 save\\backup\\ 里自动滚动备份了。）'
        : '');
    box.appendChild(p);

    var bar = el('div');
    bar.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;margin-top:14px';

    var exp = el('button', 'btn', '⬇ 导出存档');
    exp.type = 'button';
    exp.onclick = function () { Store.exportSave(); };

    var imp = el('button', 'btn btn-ghost', '⬆ 导入存档');
    imp.type = 'button';
    var file = el('input');
    file.type = 'file'; file.accept = '.json'; file.style.display = 'none';
    file.onchange = function () {
      if (!file.files[0]) return;
      Store.importSave(file.files[0], function (err) {
        if (err) { alert('导入失败：文件格式不对'); return; }
        alert('导入成功！');
        location.reload();
      });
    };
    imp.onclick = function () { file.click(); };

    var reset = el('button', 'btn btn-ghost', '🗑 清空所有记录');
    reset.type = 'button';
    reset.style.marginLeft = 'auto';
    reset.onclick = function () {
      if (!confirm('确定要清空' + PROFILE.name + '的全部学习记录吗？\n\n' +
                   '经验、等级、打卡、错题本都会被删除，而且无法恢复。\n' +
                   '建议先点「导出存档」备份一份。')) return;
      if (!confirm('再确认一次：真的要清空吗？')) return;
      Store.resetAll();
      location.reload();
    };

    bar.appendChild(exp); bar.appendChild(imp); bar.appendChild(file); bar.appendChild(reset);
    box.appendChild(bar);
    return box;
  }

  function emptyNote(txt) {
    var d = el('div', 'empty');
    d.innerHTML = '<div class="ic">📭</div><p>' + esc(txt) + '</p>';
    return d;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
