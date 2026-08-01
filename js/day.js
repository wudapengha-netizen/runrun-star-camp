/* ============================================================
   day.js —— 单日闯关流程编排
   签到 → 昨日回顾 → 语文 → 数学 → 英语 → Boss → 结算小结
   ============================================================ */
(function () {
  'use strict';

  var el, esc;
  var cur = { day: 1, stage: null };

  function init() { el = Quiz.el; esc = Quiz.esc; }

  function data(n) { return (window.DAYS && window.DAYS[n]) || null; }
  function planFor(n) { return PLAN.days[n] || {}; }

  /* ============================================================
     当日总览
     ============================================================ */
  function openDay(n) {
    init();
    cur.day = n;
    TTS.stop();

    var d = data(n);
    var p = planFor(n);
    var root = document.getElementById('view');
    root.innerHTML = '';

    var wrap = el('div', 'wrap wrap-narrow');

    // —— 返回 + 标题 ——
    var back = el('button', 'btn btn-sm btn-ghost', '← 回闯关地图');
    back.type = 'button';
    back.onclick = function () { App.go('map'); };
    wrap.appendChild(back);

    var head = el('div');
    head.style.cssText = 'margin:18px 0 22px';
    head.innerHTML =
      '<h1 style="font-size:38px">第 ' + n + ' 关 · <span style="color:var(--cinnabar)">' + esc(p.date || '') + '</span></h1>' +
      '<div style="color:var(--ink-soft);margin-top:4px">' +
      esc(PROFILE.name) + '，今天要闯这三科：' + esc(p.chinese || '') + '　｜　' +
      esc(p.math || '') + '　｜　' + esc(p.english || '') + '</div>';
    wrap.appendChild(head);

    if (!d) {
      var em = el('div', 'card');
      em.innerHTML =
        '<div class="empty"><div class="ic">🚧</div>' +
        '<h2>第 ' + n + ' 关的内容还在准备中</h2>' +
        '<p>这一关的讲解和练习题正在编写。先去把已经开放的关卡刷熟吧！</p></div>';
      wrap.appendChild(em);
      root.appendChild(wrap);
      return;
    }

    // —— 签到 ——
    var ci = Store.checkIn();
    if (!ci.already) {
      SFX.play('stamp');
      FX.burst(innerWidth / 2, 200, 40);
    }

    var checkCard = el('div', 'card card--fold');
    checkCard.style.marginBottom = '22px';
    checkCard.innerHTML =
      '<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">' +
      '<div style="font-size:44px">' + (ci.already ? '📅' : '✅') + '</div>' +
      '<div style="flex:1;min-width:190px">' +
      '<h2>' + (ci.already ? '今天已经打过卡啦' : '打卡成功！') + '</h2>' +
      '<div style="color:var(--ink-soft)">连续打卡 <b class="num" style="font-size:22px;color:var(--cinnabar)">' +
      ci.streak + '</b> 天 🔥</div></div>' +
      '<div style="font-family:var(--font-brush);font-size:19px;text-align:right">' +
      '当前称号<br><span class="rank-seal" style="margin-top:4px">' + esc(Store.level().title) + '</span></div>' +
      '</div>';
    wrap.appendChild(checkCard);

    // —— 关卡列表 ——
    // 先算好今天到底有哪几关，后面"是否全通"要用同一份名单
    var stageKeys = STAGES.filter(function (st) { return needStage(n, st.key, d); })
                          .map(function (st) { return st.key; });

    var list = el('div', 'subject-list stagger');
    STAGES.forEach(function (st) {
      if (stageKeys.indexOf(st.key) < 0) return;

      var done = Store.isStageDone(n, st.key);
      var row = el('div', 'subject-row' + (done ? ' done' : ''));
      row.dataset.s = st.key;

      var stat = Store.dayRec(n).stats[st.key];
      var statTxt = stat ? ('　✔ ' + stat.right + '/' + stat.total + ' 题') : '';

      row.innerHTML =
        '<div class="badge">' + st.icon + '</div>' +
        '<div class="meta"><b>' + esc(st.name) + subtitle(st.key, p) + '</b>' +
        '<span>' + esc(st.desc) + esc(statTxt) + '</span></div>' +
        '<div class="chk">' + (done ? '✅' : '▶️') + '</div>';

      row.onclick = function () { SFX.play('tap'); startStage(n, st.key); };
      list.appendChild(row);
    });
    wrap.appendChild(list);

    // —— 全部完成 → 看小结 ——
    var allDone = stageKeys.every(function (k) { return Store.isStageDone(n, k); });

    var bar = el('div', 'actionbar');
    if (allDone) {
      var b = el('button', 'btn btn-gold', '📜 看今天的掌握情况');
      b.type = 'button';
      b.onclick = function () { showSummary(n); };
      bar.appendChild(b);
    } else {
      var hint = el('div', 'left');
      hint.style.color = 'var(--ink-soft)';
      hint.textContent = '把上面的关卡都通了，就能看今天的掌握情况小结。';
      bar.appendChild(hint);
    }
    wrap.appendChild(bar);

    root.appendChild(wrap);
    App.refreshHUD();
  }

  /* 今天需要哪些关卡 */
  function needStage(n, key, d) {
    if (key === 'boss') return !!d.boss;
    // 没有可复习的旧错题就不出「昨日回顾」这一关
    if (key === 'review') return Store.reviewQueue(n, 5).length > 0;
    return true;
  }

  function subtitle(key, p) {
    var t = key === 'chinese' ? p.chinese : key === 'math' ? p.math : key === 'english' ? p.english : '';
    return t ? ' <span style="font-family:var(--font-body);font-size:14px;font-weight:400;color:var(--ink-soft)">· ' + esc(t) + '</span>' : '';
  }

  /* ============================================================
     进入某个关卡
     ============================================================ */
  function startStage(n, stage) {
    init();
    cur.day = n; cur.stage = stage;
    TTS.stop();
    var root = document.getElementById('view');
    root.innerHTML = '';
    var wrap = el('div', 'wrap wrap-narrow');
    root.appendChild(wrap);
    window.scrollTo(0, 0);

    if (stage === 'review') return runReview(n, wrap);
    if (stage === 'boss') return runBoss(n, wrap);
    return runSubject(n, stage, wrap);
  }

  function stageHead(wrap, stage, title, sub) {
    var st = STAGES.filter(function (s) { return s.key === stage; })[0] || { icon: '?', name: stage };
    var h = el('div', 'stage-head');
    h.dataset.s = stage;
    h.innerHTML =
      '<div class="badge">' + st.icon + '</div>' +
      '<div style="flex:1"><h2>' + esc(title) + '</h2>' +
      '<div style="font-size:14px;color:var(--ink-soft)">' + esc(sub || st.desc) + '</div></div>';
    var back = el('button', 'btn btn-sm btn-ghost', '← 返回');
    back.type = 'button';
    back.onclick = function () { TTS.stop(); openDay(cur.day); };
    h.appendChild(back);
    wrap.appendChild(h);
    return h;
  }

  /* ============================================================
     昨日回顾 —— 艾宾浩斯闪卡
     ============================================================ */
  function runReview(n, wrap) {
    stageHead(wrap, 'review', '昨日回顾', '先把昨天错的和几天前学的过一遍，答对两次就从错题本毕业');
    var qs = Store.reviewQueue(n, 5);

    if (!qs.length) {
      var c = el('div', 'card');
      c.innerHTML = '<div class="empty"><div class="ic">🎉</div><h2>错题本是空的！</h2>' +
        '<p>' + esc(PROFILE.name) + '，你没有需要复习的题，直接去闯语文关吧。</p></div>';
      wrap.appendChild(c);
      var bar = el('div', 'actionbar');
      var go = el('button', 'btn btn-primary', '好，继续 →');
      go.type = 'button';
      go.onclick = function () {
        Store.markStage(n, 'review', { right: 0, total: 0, seconds: 0, log: [] });
        Store.addXP(20);
        openDay(n);
      };
      bar.appendChild(go);
      wrap.appendChild(bar);
      return;
    }

    var mount = el('div');
    wrap.appendChild(mount);
    new Quiz.Runner({
      questions: qs, mount: mount, subject: 'review', dayNum: n, isReview: true,
      onDone: function (r) { finishStage(n, 'review', r, wrap, mount); }
    }).start();
  }

  /* ============================================================
     学科关卡：讲解 → 练习
     ============================================================ */
  function runSubject(n, subject, wrap) {
    var d = data(n);
    var sec = d[subject];
    var p = planFor(n);
    var title = subject === 'chinese' ? p.chinese : subject === 'math' ? p.math : p.english;
    stageHead(wrap, subject, title, sec.goal || '');

    var mount = el('div');
    var teachBox = el('div', 'stagger');
    wrap.appendChild(teachBox);
    wrap.appendChild(mount);

    // —— 讲解区 ——
    (sec.teach || []).forEach(function (t) {
      teachBox.appendChild(renderTeach(t, subject));
    });

    // —— 开始练习 ——
    var bar = el('div', 'actionbar');
    var go = el('button', 'btn btn-primary', '我看懂了，开始练习 →（' + (sec.quiz || []).length + ' 题）');
    go.type = 'button';
    go.onclick = function () {
      SFX.play('stage');
      TTS.stop();
      teachBox.style.display = 'none';
      bar.style.display = 'none';
      var qs = (sec.quiz || []).map(function (q) { return Object.assign({ subject: subject }, q); });
      new Quiz.Runner({
        questions: qs, mount: mount, subject: subject, dayNum: n,
        onDone: function (r) { finishStage(n, subject, r, wrap, mount); }
      }).start();
      mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    bar.appendChild(go);
    wrap.appendChild(bar);
  }

  /* ============================================================
     讲解块渲染 —— 支持多种内容类型
     ============================================================ */
  function renderTeach(t, subject) {
    var box = el('div', 'teach');
    box.dataset.s = subject;

    if (t.title) {
      var h = el('h3', '', esc(t.title));
      // 有朗读内容就加个喇叭
      if (t.speak || t.text || t.passage) {
        var sp = el('button', 'btn btn-sm btn-ghost', '🔊 读一读');
        sp.type = 'button';
        sp.style.marginLeft = 'auto';
        sp.onclick = function () {
          TTS.speak(t.speak || t.text || t.passage, { lang: t.lang || (subject === 'english' ? 'en' : 'zh') });
        };
        h.appendChild(sp);
      }
      box.appendChild(h);
    }

    // 正文段落（允许简单 HTML：<b> <span class=key/hl>）
    (t.body || []).forEach(function (p) { box.appendChild(el('p', '', p)); });

    // 要点列表
    if (t.points) {
      var ul = el('ul');
      t.points.forEach(function (x) { ul.appendChild(el('li', '', x)); });
      box.appendChild(ul);
    }

    // 生字卡
    if (t.hanzi) box.appendChild(Hanzi.cards(t.hanzi));

    // 英语单词卡
    if (t.words) box.appendChild(wordCards(t.words));

    // 数学分步演示
    if (t.calc) box.appendChild(calcSteps(t.calc));

    // 课文（逐句朗读高亮）
    if (t.passage) box.appendChild(passage(t.passage, t.lang || 'zh'));

    // 词语表
    if (t.phrases) {
      var ph = el('div');
      ph.style.cssText = 'display:flex;flex-wrap:wrap;gap:9px;margin-top:6px';
      t.phrases.forEach(function (w) {
        var c = el('button', 'chip');
        c.type = 'button';
        c.style.fontSize = '17px';
        c.textContent = w;
        c.onclick = function () { TTS.speak(w, { lang: 'zh' }); SFX.play('tap'); };
        ph.appendChild(c);
      });
      box.appendChild(ph);
    }

    // 图示（纯 CSS/emoji，不用图片文件）
    if (t.figure) {
      var f = el('div');
      f.style.cssText = 'margin:14px 0;text-align:center';
      f.innerHTML = t.figure;
      box.appendChild(f);
    }

    return box;
  }

  function wordCards(words) {
    var g = el('div', 'word-grid');
    words.forEach(function (w) {
      var c = el('div', 'word-card');
      c.innerHTML =
        '<span class="spk">🔊</span>' +
        '<div class="w">' + esc(w.en) + '</div>' +
        '<div class="ipa">' + esc(w.ipa || '') + '</div>' +
        '<div class="cn">' + esc(w.cn) + '</div>';
      c.onclick = function () { SFX.play('tap'); TTS.speak(w.en, { lang: 'en' }); };
      c.title = '点一点听发音';
      g.appendChild(c);
    });
    return g;
  }

  function calcSteps(steps) {
    var box = el('div', 'calc-steps');
    steps.forEach(function (s) {
      var line = el('div', 'step');
      line.innerHTML = s.expr ? s.expr : esc(s);
      if (s.note) line.appendChild(el('span', 'note', s.note));
      box.appendChild(line);
    });
    return box;
  }

  function passage(text, lang) {
    var box = el('div', 'passage');
    var sents = lang === 'en'
      ? text.split(/(?<=[.!?])\s+/).filter(Boolean)
      : TTS.splitSentences(text);

    sents.forEach(function (s, i) {
      var sp = el('span', 'sent');
      sp.textContent = s;
      sp.dataset.i = i;
      sp.title = '点这句，读给我听';
      sp.onclick = function () { TTS.speak(s, { lang: lang }); };
      box.appendChild(sp);
    });

    var tool = el('div');
    tool.style.cssText = 'margin-top:14px;display:flex;gap:10px;flex-wrap:wrap';
    var play = el('button', 'btn btn-sm btn-gold', '▶ 逐句朗读（跟着读）');
    play.type = 'button';
    var stop = el('button', 'btn btn-sm btn-ghost', '⏹ 停');
    stop.type = 'button';
    var seq = null;

    play.onclick = function () {
      if (seq) seq.cancel();
      seq = TTS.speakSequence(sents, function (idx) {
        box.querySelectorAll('.sent').forEach(function (nd) { nd.classList.remove('reading'); });
        if (idx >= 0) {
          var nd = box.querySelector('.sent[data-i="' + idx + '"]');
          if (nd) { nd.classList.add('reading'); nd.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
        }
      }, { lang: lang });
    };
    stop.onclick = function () { if (seq) seq.cancel(); TTS.stop(); };
    tool.appendChild(play); tool.appendChild(stop);

    var holder = el('div');
    holder.appendChild(box);
    holder.appendChild(tool);
    return holder;
  }

  /* ============================================================
     Boss 战
     ============================================================ */
  function runBoss(n, wrap) {
    var d = data(n);
    var boss = d.boss;
    var p = planFor(n);
    stageHead(wrap, 'boss', boss.name || (p.bossName || 'Boss 战'), '三科综合，答错 Boss 会回血，加油！');

    SFX.play('boss');

    var hpMax = (boss.quiz || []).length;
    var hp = hpMax;

    var barBox = el('div', 'boss-bar');
    barBox.innerHTML =
      '<div class="face">' + (boss.face || '👹') + '</div>' +
      '<div class="hp-wrap"><div class="hp-name">' + esc(boss.name || 'Boss') + '</div>' +
      '<div class="hp"><i style="width:100%"></i></div></div>' +
      '<div class="num" style="font-size:22px"><span id="hpNum">' + hp + '</span>/' + hpMax + '</div>';
    wrap.appendChild(barBox);

    var api = {
      hit: function () {
        hp = Math.max(0, hp - 1);
        paint();
        SFX.play('hit');
        barBox.classList.add('boss-hit');
        setTimeout(function () { barBox.classList.remove('boss-hit'); }, 380);
      },
      heal: function () {
        hp = Math.min(hpMax, hp + 1);
        paint();
      }
    };
    function paint() {
      barBox.querySelector('.hp i').style.width = (hp / hpMax * 100) + '%';
      barBox.querySelector('#hpNum').textContent = hp;
    }

    var mount = el('div');
    wrap.appendChild(mount);

    var qs = (boss.quiz || []).map(function (q) { return Object.assign({}, q); });
    new Quiz.Runner({
      questions: qs, mount: mount, subject: 'boss', dayNum: n, boss: api,
      onDone: function (r) {
        if (hp === 0) { SFX.play('chest'); FX.celebrate(); FX.coins(40); }
        finishStage(n, 'boss', r, wrap, mount, hp === 0);
      }
    }).start();
  }

  /* ============================================================
     关卡结算
     ============================================================ */
  function finishStage(n, stage, r, wrap, mount, bossKilled) {
    Store.markStage(n, stage, {
      right: r.right, total: r.total, seconds: r.seconds, log: r.log
    });

    // 关卡奖励
    var bonus = 0;
    if (!Store.dayRec(n).stats[stage] || true) {
      bonus += (stage === 'boss') ? 100 : 50;
    }
    if (r.total > 0 && r.right === r.total) bonus += 30;
    var xpRes = Store.addXP(r.xp + bonus);

    // 徽章
    if (r.maxCombo >= 10) grant('combo10');
    if (stage === 'boss' && bossKilled) grant('bossweek');

    mount.innerHTML = '';
    var card = el('div', 'card');
    var pct = r.total ? Math.round(r.right / r.total * 100) : 100;

    card.innerHTML =
      '<div class="result-hero">' +
      '<div class="big">' + (pct === 100 ? '完美通关' : pct >= 80 ? '通关！' : '闯过去了') + '</div>' +
      '<div class="sub">答对 <b class="num">' + r.right + '</b> / ' + r.total +
      ' 题　·　最高连对 <b class="num">' + r.maxCombo + '</b>　·　用时 ' +
      Math.max(1, Math.round(r.seconds / 60)) + ' 分钟</div>' +
      '<div class="xp-gain">+' + (r.xp + bonus) + ' XP</div>' +
      '</div>';

    if (r.wrong.length) {
      var w = el('div');
      w.style.cssText = 'margin-top:8px;padding-top:14px;border-top:2px solid var(--paper-edge)';
      w.innerHTML = '<b style="font-family:var(--font-brush);font-size:18px">错了 ' + r.wrong.length +
        ' 题，已经放进错题本</b><div style="color:var(--ink-soft);font-size:15px;margin-top:4px">' +
        '明天开场的「昨日回顾」会再考你一遍，连着答对两次就算真会了。</div>';
      card.appendChild(w);
    }

    var bar = el('div', 'actionbar');
    var next = el('button', 'btn btn-primary', '继续 →');
    next.type = 'button';
    next.onclick = function () { openDay(n); };
    bar.appendChild(next);
    card.appendChild(bar);

    mount.appendChild(card);
    SFX.play('stage');
    FX.burst(innerWidth / 2, innerHeight * 0.35, 60);
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (xpRes.leveledUp) setTimeout(function () { levelUp(xpRes.level); }, 700);
    App.refreshHUD();
  }

  function grant(id) {
    if (Store.grantBadge(id)) {
      var b = (window.BADGES || []).filter(function (x) { return x.id === id; })[0];
      if (b) setTimeout(function () { toast(b.ic + ' 获得徽章：' + b.name); }, 400);
    }
  }

  function toast(msg) {
    var t = el('div');
    t.style.cssText =
      'position:fixed;left:50%;top:88px;transform:translateX(-50%);z-index:400;' +
      'background:var(--gold);color:var(--ink);border:3px solid var(--ink);border-radius:14px;' +
      'padding:12px 26px;font-family:var(--font-brush);font-size:20px;font-weight:700;' +
      'box-shadow:4px 4px 0 var(--ink);animation:popIn .4s cubic-bezier(.34,1.56,.64,1)';
    t.textContent = msg;
    document.body.appendChild(t);
    SFX.play('coin');
    setTimeout(function () { t.remove(); }, 2600);
  }

  function levelUp(lv) {
    SFX.play('levelup');
    FX.celebrate();
    var mask = el('div', 'levelup');
    var s = el('div', 'levelup-scroll');
    s.innerHTML =
      '<div class="lv-k">晋 升</div>' +
      '<div class="lv-t">' + esc(lv.title) + '</div>' +
      '<div class="lv-n">' + esc(PROFILE.name) + '　·　' + esc(lv.desc || '') + '</div>';
    var b = el('button', 'btn btn-gold', '收下！');
    b.type = 'button';
    b.style.marginTop = '18px';
    b.onclick = function () { mask.remove(); };
    s.appendChild(b);
    mask.appendChild(s);
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
    document.body.appendChild(mask);
    if (lv.title === '状元') grant('zhuangyuan');
  }

  /* ============================================================
     今日掌握情况小结
     ============================================================ */
  function showSummary(n) {
    init();
    TTS.stop();
    var sum = Summary.build(n);
    var firstTime = !Store.isDayDone(n);

    if (firstTime) {
      Store.addXP(100);
      Store.markDayDone(n, sum);
      if (n === 1) grant('first');
      if (sum.bands.r.length === 0 && sum.totalQ > 0) grant('perfect');
      var s = Store.state.streak;
      if (s >= 3) grant('streak3');
      if (s >= 7) grant('streak7');
      if (s >= 14) grant('streak14');
      if (s >= 31) grant('streak31');
      SFX.play('finish');
      FX.celebrate();
      FX.coins(46);
    } else {
      Store.markDayDone(n, sum);
    }

    var root = document.getElementById('view');
    root.innerHTML = '';
    var wrap = el('div', 'wrap wrap-narrow');

    var hero = el('div', 'card card--fold');
    hero.innerHTML =
      '<div class="result-hero" style="padding-top:12px">' +
      '<div class="big">第 ' + n + ' 关 · 通关</div>' +
      '<div class="sub">' + esc(PROFILE.name) + '，今天一共做对 <b class="num">' + sum.totalRight +
      '</b> / ' + sum.totalQ + ' 题，正确率 <b class="num" style="color:' +
      Summary.pctColor(sum.pct) + '">' + sum.pct + '%</b></div>' +
      (firstTime ? '<div class="xp-gain">+100 XP 全天完成奖励</div>' : '') +
      '</div>';
    wrap.appendChild(hero);

    var card = el('div', 'card');
    card.style.marginTop = '20px';
    card.appendChild(el('div', 'seal-title', '今天的掌握情况'));
    card.appendChild(el('hr', 'rule'));
    card.appendChild(Summary.render(sum));
    wrap.appendChild(card);

    var bar = el('div', 'actionbar');
    var again = el('button', 'btn btn-ghost', '再练一遍今天的题');
    again.type = 'button';
    again.onclick = function () { openDay(n); };
    var nextDay = el('button', 'btn btn-primary', n < 31 ? '看看第 ' + (n + 1) + ' 关 →' : '回地图');
    nextDay.type = 'button';
    nextDay.onclick = function () {
      if (n < 31 && Store.isUnlocked(n + 1)) openDay(n + 1);
      else App.go('map');
    };
    bar.appendChild(again);
    bar.appendChild(nextDay);
    wrap.appendChild(bar);

    root.appendChild(wrap);
    window.scrollTo(0, 0);
    App.refreshHUD();
  }

  window.Day = { open: openDay, startStage: startStage, showSummary: showSummary, toast: toast };
})();
