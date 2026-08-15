/* ============================================================
   flow.js —— 主页：一套一套往下做

   页面只回答一个问题：<b>现在该做哪一卷？</b>

     没做过        → 第 1 卷【全知识点】
     做完第 N 卷   → 先看【第 N 错题集】，再做第 N+1 卷【第 N 错题卷】
     错题集空了    → 这一科通关

   做题时一次一题、当场判对错。做不完可以停，进度存着，下次接着做。
   ============================================================ */
(function () {
  'use strict';

  var R = window.ROUNDS;
  var SUB = R.SUB;

  function el(t, c, h) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (h != null) n.innerHTML = h;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function rich(s) {
    return esc(s)
      .replace(/&lt;(\/?)(b|i|u|sup|sub|small|em|strong)&gt;/g, '<$1$2>')
      .replace(/&lt;br\s*\/?&gt;/g, '<br>')
      .replace(/\{(\d+)\/(\d+)\}/g,
        '<span class="frac"><span class="num">$1</span><span class="den">$2</span></span>')
      .replace(/_{3,}/g, '<span class="blank-mark"></span>');
  }
  function when(ts) {
    var d = new Date(ts), n = new Date();
    var hm = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    return d.toDateString() === n.toDateString() ? ('今天 ' + hm)
      : ((d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm);
  }

  /* ---------- 答案判定 ---------- */
  function norm(s) {
    if (s == null) return '';
    s = String(s).trim()
      .replace(/[！-～]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
      .replace(/　/g, '').replace(/\s+/g, '')
      .replace(/[。，,、；;：:！!？?]/g, '').replace(/\.+$/, '').replace(/÷/g, '/');
    var cn = { 零: '0', 一: '1', 二: '2', 两: '2', 三: '3', 四: '4', 五: '5',
               六: '6', 七: '7', 八: '8', 九: '9', 十: '10' };
    var m = s.match(/^([零一二两三四五六七八九十]+)分之([零一二两三四五六七八九十]+)$/);
    if (m && cn[m[1]] && cn[m[2]]) s = cn[m[2]] + '/' + cn[m[1]];
    return s.toLowerCase();
  }
  function blankOK(got, acc) {
    var g = norm(got);
    if (!g) return false;
    for (var i = 0; i < acc.length; i++) {
      var w = norm(acc[i]);
      if (g === w) return true;
      if (/^\d+$/.test(w) && new RegExp('^' + w + '[^\\d]*$').test(g)) return true;
    }
    return false;
  }

  /* ---------- 状态 ---------- */
  var subject = 'math';
  var paper = null;        // 正在做的卷子
  var at = 0, answers = [], startAt = 0, sid = null;

  var DRAFT = 'runrun.flow.draft.';      // 做到一半的草稿

  function saveDraft() {
    if (!paper) return;
    try {
      localStorage.setItem(DRAFT + subject, JSON.stringify({
        paper: paper, at: at, answers: answers, startAt: startAt, sid: sid
      }));
    } catch (e) {}
  }
  function loadDraft(s) {
    try {
      var raw = localStorage.getItem(DRAFT + s);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function clearDraft(s) { try { localStorage.removeItem(DRAFT + s); } catch (e) {} }

  /* ---------- 渲染入口 ---------- */
  function render() {
    var root = document.getElementById('view');
    root.innerHTML = '';
    root.appendChild(tabs());
    if (paper) { root.appendChild(at >= paper.items.length ? finish() : question()); return; }
    root.appendChild(home());
    window.scrollTo(0, 0);
  }

  function tabs() {
    var b = el('div', 'fl-tabs');
    Object.keys(SUB).forEach(function (k) {
      var t = el('button', 'tab' + (k === subject ? ' on' : ''), SUB[k].icon + ' ' + SUB[k].name);
      t.type = 'button';
      t.onclick = function () {
        if (k === subject) return;
        if (paper && !confirm('正在做「' + paper.title + '」，切换科目会把进度存着但先离开。确定吗？')) return;
        saveDraft();
        subject = k;
        try { localStorage.setItem('runrun.flow.subject', k); } catch (e) {}
        paper = null; render();
      };
      b.appendChild(t);
    });
    return b;
  }

  /* ---------- 主页：该做哪一卷 ---------- */
  function home() {
    var wrap = el('div');
    var nx = R.next(subject);
    var hist = R.history(subject);

    // 有没有做到一半的
    var d = loadDraft(subject);
    if (d && d.paper && d.at < d.paper.items.length) {
      var c0 = el('div', 'fl-card go');
      c0.innerHTML =
        '<div class="kk">做到一半</div>' +
        '<h2>' + esc(d.paper.title) + '</h2>' +
        '<p>已经做到第 <b>' + (d.at + 1) + '</b> 题，一共 <b>' + d.paper.items.length + '</b> 题。</p>';
      var b0 = el('button', 'btn btn-primary big', '接着做 →');
      b0.type = 'button';
      b0.onclick = function () {
        paper = d.paper; at = d.at; answers = d.answers || []; startAt = d.startAt || Date.now();
        sid = d.sid; render();
      };
      c0.appendChild(b0);
      var b0b = el('button', 'btn btn-ghost', '不做了，重新开始这一卷');
      b0b.type = 'button';
      b0b.style.marginLeft = '10px';
      b0b.onclick = function () { if (confirm('这一卷已做的部分会清掉，确定？')) { clearDraft(subject); render(); } };
      c0.appendChild(b0b);
      wrap.appendChild(c0);
    }

    // 该做哪一卷
    if (nx.todo === 'clear') {
      wrap.appendChild(el('div', 'fl-card clear',
        '<div class="big">🎉</div><h2>' + SUB[subject].name + '全部过关</h2>' +
        '<p>第 ' + nx.round + ' 卷做完，<b>错题集是空的</b> —— 所有知识点都掌握了。</p>'));
    } else if (!(d && d.at < (d.paper || {}).items.length)) {
      var c = el('div', 'fl-card go');
      if (nx.todo === 'full') {
        var n0 = R.allTags(subject).length;
        c.innerHTML = '<div class="kk">第 1 步</div><h2>第 1 卷 · 全知识点</h2>' +
          '<p>把这本书的 <b>' + n0 + ' 个知识点</b>全过一遍，' +
          '其中约四分之一的知识点会出 <b>2~3 道</b>，用来确认是不是真的会。</p>' +
          '<p class="dim">题量大，<b>做不完可以停</b>，进度存着，下次接着做。</p>';
      } else {
        c.innerHTML = '<div class="kk">第 ' + nx.round + ' 步</div>' +
          '<h2>第 ' + nx.round + ' 卷 · 第 ' + nx.prev + ' 错题卷</h2>' +
          '<p>针对<b>第 ' + nx.prev + ' 错题集</b>里的 <b>' + nx.wrongSet.tags.length + ' 个知识点</b>，' +
          '<b>重新出新题</b>（不是把错的原题再做一遍），另加约四分之一以前做对过的题来巩固。</p>';
      }
      var b = el('button', 'btn btn-primary big',
        nx.todo === 'full' ? '开始做第 1 卷 →' : ('开始做第 ' + nx.round + ' 卷 →'));
      b.type = 'button';
      b.onclick = function () { start(nx); };
      c.appendChild(b);
      wrap.appendChild(c);
    }

    // 上一卷的错题集
    if (nx.wrongSet && nx.wrongSet.items.length) wrap.appendChild(wrongSetCard(nx.wrongSet));

    // 走过的卷
    if (hist.length) {
      var h = el('div', 'fl-card');
      h.appendChild(el('h3', 'blk-h', '做过的卷子'));
      var tb = el('table', 'fl-hist');
      tb.innerHTML = '<thead><tr><th>卷</th><th>时间</th><th>得分</th><th>错</th></tr></thead>';
      var body = el('tbody');
      hist.slice().reverse().forEach(function (r) {
        var w = (r.items || []).filter(function (i) { return !i.ok; }).length;
        body.innerHTML += '<tr><td>' + esc(r.title) + '</td><td class="dim">' + when(r.at) + '</td>' +
          '<td class="num">' + r.score + '/' + r.total + '</td>' +
          '<td class="num">' + (w ? '<b style="color:var(--cinnabar)">' + w + '</b>' : '0') + '</td></tr>';
      });
      tb.appendChild(body);
      h.appendChild(tb);
      wrap.appendChild(h);
    }
    return wrap;
  }

  /* 错题集卡片 */
  function wrongSetCard(ws) {
    var c = el('div', 'fl-card ws');
    c.appendChild(el('h3', 'blk-h',
      '第 ' + ws.n + ' 错题集　·　错 ' + ws.items.length + ' 题，涉及 ' + ws.tags.length + ' 个知识点'));

    var chips = el('div', 'ws-tags');
    ws.tags.forEach(function (t) { chips.appendChild(el('span', 'chip', esc(t))); });
    c.appendChild(chips);

    var list = el('div', 'ws-list');
    ws.items.forEach(function (i) {
      list.appendChild(el('div', 'ws-item',
        '<div class="q">' + rich(i.q) + '</div>' +
        '<div class="a"><span class="no">填了：' + esc(i.got) + '</span>' +
        '<span class="ok">应为：' + esc(i.want) + '</span>' +
        '<span class="tg">' + esc(i.tag) + '</span></div>'));
    });
    c.appendChild(list);
    return c;
  }

  /* ---------- 开始一卷 ---------- */
  function start(nx) {
    var seed = Date.now();
    paper = (nx.todo === 'full')
      ? R.buildFull(subject, seed)
      : R.buildFix(subject, nx.wrongSet.tags, seed, nx.prev, prevItems(nx.prev));
    at = 0; answers = []; startAt = Date.now();
    sid = subject + '-r' + paper.round + '@' + seed;
    saveDraft();
    render();
  }

  /* 上一卷出过的题 —— 传给组卷器，保证新卷子里不再出现 */
  function prevItems(roundNo) {
    var h = R.history(subject);
    var rec = h.filter(function (r) { return r.round === roundNo; }).pop();
    return (rec && rec.items) || [];
  }

  /* ---------- 做题 ---------- */
  function question() {
    var q = paper.items[at];
    var wrap = el('div');

    var head = el('div', 'fl-head');
    head.innerHTML = '<div class="ttl">' + esc(paper.title) + '</div>' +
      '<div class="pg"><b>' + (at + 1) + '</b> / ' + paper.items.length + '</div>';
    var pb = el('div', 'fl-pb');
    pb.innerHTML = '<i style="width:' + Math.round(at / paper.items.length * 100) + '%"></i>';
    head.appendChild(pb);
    wrap.appendChild(head);

    var c = el('div', 'fl-q');
    c.appendChild(el('div', 'tag', esc(q.tag) +
      (q.from === 'review' ? '　·　巩固题' : '') +
      (q.reused ? '　·　这个知识点暂时没有新题了' : '')));
    c.appendChild(el('div', 'qt', rich(q.q)));

    var picked = null, inputs = [];
    if (q.type === 'choice' || q.type === 'listen') {
      var opts = el('div', 'opts');
      q.o.forEach(function (o, i) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.innerHTML = '<span class="key">' + 'ABCD'[i] + '</span><span class="txt">' + rich(o) + '</span>';
        b.onclick = function () {
          if (c.dataset.done) return;
          opts.querySelectorAll('.opt').forEach(function (n) { n.classList.remove('picked'); });
          b.classList.add('picked'); picked = i;
        };
        opts.appendChild(b);
      });
      c.appendChild(opts);
    } else {
      var row = el('div', 'blanks');
      q.a.forEach(function (acc, i) {
        if (q.a.length > 1) row.appendChild(el('span', 'bn', '(' + (i + 1) + ')'));
        var inp = el('input', 'blank');
        inp.type = 'text'; inp.autocomplete = 'off';
        var len = String((acc && acc[0]) || '').length;
        if (len > 3) inp.style.width = Math.min(420, 90 + len * 26) + 'px';
        inp.onkeydown = function (e) {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          var k = inputs.indexOf(inp);
          if (k >= 0 && k < inputs.length - 1) inputs[k + 1].focus(); else go.click();
        };
        inputs.push(inp); row.appendChild(inp);
      });
      c.appendChild(row);
    }

    var act = el('div', 'act');
    var go = el('button', 'btn btn-primary big', '检查');
    go.type = 'button';
    act.appendChild(go);
    var pause = el('button', 'btn btn-ghost', '先歇会儿');
    pause.type = 'button';
    pause.onclick = function () { saveDraft(); paper = null; render(); };
    act.appendChild(pause);
    c.appendChild(act);
    wrap.appendChild(c);

    go.onclick = function () {
      if (c.dataset.done) { at++; saveDraft(); render(); window.scrollTo(0, 0); return; }
      var ok, got;
      if (q.type === 'choice' || q.type === 'listen') {
        if (picked == null) { flash(go, '先选一个'); return; }
        ok = picked === q.a;
        got = 'ABCD'[picked] + '. ' + String(q.o[picked]).replace(/<[^>]+>/g, '');
      } else {
        var vals = inputs.map(function (n) { return n.value; });
        if (vals.every(function (v) { return !v.trim(); })) { flash(go, '先写答案'); return; }
        ok = q.a.every(function (acc, i) { return blankOK(vals[i], acc); });
        got = vals.map(function (v) { return v.trim() || '（空）'; }).join(' / ');
      }
      c.dataset.done = '1';
      c.classList.add(ok ? 'right' : 'wrong');
      inputs.forEach(function (n) { n.readOnly = true; });
      if (q.type === 'choice' || q.type === 'listen') {
        var os = c.querySelectorAll('.opt');
        os[q.a].classList.add('is-right');
        if (!ok && picked != null) os[picked].classList.add('is-wrong');
      }
      var want = (q.type === 'choice' || q.type === 'listen')
        ? 'ABCD'[q.a] + '. ' + String(q.o[q.a]).replace(/<[^>]+>/g, '')
        : q.a.map(function (acc) { return acc[0]; }).join(' / ');

      var fb = el('div', 'fb ' + (ok ? 'ok' : 'no'));
      fb.innerHTML = '<div class="hd">' + (ok ? '✅ 对了' : '❌ 错了') +
        (ok ? '' : '　正确答案：<b>' + esc(want) + '</b>') + '</div>' +
        (q.why ? '<div class="why">' + rich(q.why) + '</div>' : '');
      c.insertBefore(fb, act);

      answers[at] = { ok: ok, got: got, want: want };
      save();
      saveDraft();
      go.textContent = (at === paper.items.length - 1) ? '交卷，看错题集 →' : '下一题 →';
      go.focus();
      pb.innerHTML = '<i style="width:' + Math.round((at + 1) / paper.items.length * 100) + '%"></i>';
    };

    setTimeout(function () { if (inputs.length) inputs[0].focus(); else c.focus(); }, 30);
    c.tabIndex = -1;
    c.onkeydown = function (e) {
      if (c.dataset.done) { if (e.key === 'Enter') { e.preventDefault(); go.click(); } return; }
      if (/^[1-4]$/.test(e.key) && (q.type === 'choice' || q.type === 'listen')) {
        var b2 = c.querySelectorAll('.opt')[+e.key - 1]; if (b2) b2.click();
      } else if (e.key === 'Enter' && !inputs.length) { e.preventDefault(); go.click(); }
    };
    return wrap;
  }

  function flash(btn, msg) {
    var old = btn.textContent;
    btn.textContent = msg;
    setTimeout(function () { btn.textContent = old; }, 900);
  }

  /* ---------- 交卷 ---------- */
  function finish() {
    save();
    clearDraft(subject);
    var n = paper.round;
    var right = answers.filter(function (x) { return x && x.ok; }).length;
    var wrongs = [];
    paper.items.forEach(function (q, i) {
      var a = answers[i];
      if (a && !a.ok) wrongs.push({ q: q.q, got: a.got, want: a.want, tag: q.tag });
    });
    var tags = [], seen = {};
    wrongs.forEach(function (w) { var t = R.canon(w.tag); if (!seen[t]) { seen[t] = 1; tags.push(t); } });

    var box = el('div', 'fl-card done');
    var pct = Math.round(right / paper.items.length * 100);
    box.innerHTML =
      '<div class="big" style="color:' + (pct >= 85 ? 'var(--grass)' : pct >= 60 ? 'var(--gold-deep)' : 'var(--cinnabar)') + '">' +
      right + ' / ' + paper.items.length + '</div>' +
      '<div class="lb">' + esc(paper.title) + '　·　正确率 ' + pct + '%</div>';

    if (!wrongs.length) {
      box.appendChild(el('div', 'clear-note', '🎉 全对！<b>' + SUB[subject].name + '通关了。</b>'));
    } else {
      box.appendChild(el('h3', 'blk-h',
        '第 ' + n + ' 错题集　·　错 ' + wrongs.length + ' 题，涉及 ' + tags.length + ' 个知识点'));
      var chips = el('div', 'ws-tags');
      tags.forEach(function (t) { chips.appendChild(el('span', 'chip', esc(t))); });
      box.appendChild(chips);
      var list = el('div', 'ws-list');
      wrongs.forEach(function (w) {
        list.appendChild(el('div', 'ws-item',
          '<div class="q">' + rich(w.q) + '</div>' +
          '<div class="a"><span class="no">填了：' + esc(w.got) + '</span>' +
          '<span class="ok">应为：' + esc(w.want) + '</span>' +
          '<span class="tg">' + esc(w.tag) + '</span></div>'));
      });
      box.appendChild(list);
      box.appendChild(el('div', 'blk-note',
        '下一卷会针对<b>这 ' + tags.length + ' 个知识点重新出题</b>（不是把上面这些原题再做一遍），' +
        '再加约四分之一以前做对过的题来巩固。'));
    }

    var row = el('div', 'row');
    row.style.marginTop = '22px';
    if (wrongs.length) {
      var b = el('button', 'btn btn-primary big', '做第 ' + (n + 1) + ' 卷（第 ' + n + ' 错题卷）→');
      b.type = 'button';
      var justDid = paper.items.slice();          // 这一卷出过的题，下一卷要避开
      b.onclick = function () {
        paper = R.buildFix(subject, tags, Date.now(), n, justDid);
        at = 0; answers = []; startAt = Date.now();
        sid = subject + '-r' + paper.round + '@' + Date.now();
        saveDraft(); render(); window.scrollTo(0, 0);
      };
      row.appendChild(b);
    }
    var bk = el('button', 'btn btn-ghost', '回主页');
    bk.type = 'button';
    bk.onclick = function () { paper = null; render(); };
    row.appendChild(bk);
    box.appendChild(row);
    return box;
  }

  /* ---------- 存档 ---------- */
  function save() {
    if (!(window.Store && Store.recordExam) || !paper) return;
    var doneN = answers.filter(function (x) { return x; }).length;
    if (!doneN) return;
    try {
      Store.recordExam({
        id: sid, paper: subject + '-r' + paper.round, subject: subject,
        kind: paper.kind, round: paper.round,
        title: paper.title + (doneN < paper.items.length ? '（做了 ' + doneN + '/' + paper.items.length + ' 题）' : ''),
        ms: Date.now() - startAt,
        score: answers.filter(function (x) { return x && x.ok; }).length,
        total: doneN,
        items: paper.items.slice(0, doneN).map(function (q, i) {
          var a = answers[i] || {};
          return {
            qid: q.qid, no: i + 1, tag: q.tag, secName: q.unit || paper.title,
            type: q.type, per: 1, ok: !!a.ok,
            q: String(q.q).replace(/<[^>]+>/g, '').slice(0, 100),
            got: String(a.got || '（没答）').slice(0, 60),
            want: String(a.want || '').slice(0, 60),
            why: q.why || ''
          };
        })
      });
    } catch (e) { console.warn('记录没存上', e); }
  }

  /* ---------- 启动 ---------- */
  function boot() {
    try { subject = localStorage.getItem('runrun.flow.subject') || 'math'; } catch (e) {}
    if (!SUB[subject]) subject = 'math';
    var root = document.getElementById('view');
    root.innerHTML = '<div class="fl-card">正在准备…</div>';
    var go = function () { render(); };
    if (window.Store && Store.boot) {
      Store.boot((window.PROFILE && PROFILE.name) || '').then(go)
        .catch(function () { try { Store.load(); } catch (e) {} go(); });
    } else go();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
