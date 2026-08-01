/* ============================================================
   store.js —— 存档。全部数据都在 localStorage，离线可用。
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'runrun.grade3.v1';

  var BLANK = {
    schema: 2,
    xp: 0,
    createdAt: null,
    days: {},          // { "1": {done:[...], stats:{...}, summary:{...}, finishedAt} }
    wrongBook: [],     // [{id, q, subject, tags, day, streak, addedAt}]
    badges: [],        // [badgeId]
    streak: 0,
    lastCheckIn: null, // "2026-08-01"
    checkIns: [],      // ["2026-08-01", ...]
    exams: {},         // { chinese:{score, detail, at}, ... }
    /* 逐题流水账 —— 每答一题记一条，这是"记忆数据库"的本体。
       {ts, day, stage, subject, qid, type, tags[], ok, ms} 全月约 1400 条。 */
    journal: [],
    settings: { sound: true, bgm: false, motion: true, ttsRate: 0.85 }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var state = null;

  function hydrate(parsed) {
    if (parsed && typeof parsed === 'object') {
      state = Object.assign(clone(BLANK), parsed);
      state.settings = Object.assign(clone(BLANK.settings), parsed.settings || {});
      if (!Array.isArray(state.journal)) state.journal = [];
    } else {
      state = clone(BLANK);
      state.createdAt = todayStr();
    }
    return state;
  }

  /**
   * 启动存档层。异步：服务器模式要先去读文件、和本地记录比时间戳。
   * @returns Promise<state>
   */
  function boot(profileName) {
    if (!window.Storage2) {           // 兜底：没加载 storage.js 就退回纯 localStorage
      return Promise.resolve(load());
    }
    return Storage2.init(profileName).then(function (data) {
      hydrate(data);
      if (!data) save();
      return state;
    });
  }

  /** 同步读取（只看 localStorage）。给不需要等服务器的场景用。 */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return hydrate(raw ? JSON.parse(raw) : null);
    } catch (e) {
      console.warn('存档读取失败，已重置', e);
      return hydrate(null);
    }
  }

  function save(opt) {
    if (window.Storage2) Storage2.save(state, opt);
    else {
      try { localStorage.setItem(KEY, JSON.stringify(state)); }
      catch (e) { console.warn('存档写入失败', e); }
    }
  }

  /** 冲突时被另一台设备的存档接管 */
  function adopt(data) {
    hydrate(data);
    if (window.App && App.refreshHUD) App.refreshHUD();
  }

  /* ---------- 逐题流水账 ---------- */
  function logAnswer(entry) {
    state.journal.push({
      ts: Date.now(),
      day: entry.day,
      stage: entry.stage,
      subject: entry.subject,
      qid: entry.qid,
      type: entry.type,
      tags: entry.tags || [],
      ok: !!entry.ok,
      ms: entry.ms || 0
    });
    // 上限保护：正常一个暑假 1400 条左右，留 20000 足够反复重刷
    if (state.journal.length > 20000) state.journal.splice(0, state.journal.length - 20000);
  }

  /** 按知识点汇总流水，可选只看某段时间 */
  function journalByTag(sinceTs) {
    var out = {};
    state.journal.forEach(function (j) {
      if (sinceTs && j.ts < sinceTs) return;
      (j.tags || []).forEach(function (t) {
        if (!out[t]) out[t] = { tag: t, right: 0, total: 0, subject: j.subject, first: j.ts, last: j.ts };
        out[t].total++;
        if (j.ok) out[t].right++;
        out[t].last = Math.max(out[t].last, j.ts);
        out[t].first = Math.min(out[t].first, j.ts);
      });
    });
    return Object.keys(out).map(function (k) {
      var x = out[k];
      x.pct = x.total ? Math.round(x.right / x.total * 100) : 0;
      return x;
    });
  }

  function todayStr(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + dd;
  }

  /* —— 今天是第几关 —— 8月1日 = 第1关 —— */
  function dayNumberFor(dateStr) {
    var d = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
    if (d.getFullYear() === 2026 && d.getMonth() === 7) return d.getDate();  // 8月
    // 不在 8 月：8月前 → 第1关；8月后 → 第31关
    if (d < new Date('2026-08-01T00:00:00')) return 1;
    return 31;
  }

  /* ============ 关卡进度 ============ */

  function dayRec(n) {
    var k = String(n);
    if (!state.days[k]) state.days[k] = { done: [], stats: {}, summary: null, finishedAt: null };
    return state.days[k];
  }

  function isStageDone(n, stage) {
    return dayRec(n).done.indexOf(stage) >= 0;
  }

  function isDayDone(n) {
    return !!dayRec(n).finishedAt;
  }

  /* 解锁规则：第1关永远开；今天及之前的关都开；前一关通了也开（可提前刷） */
  function isUnlocked(n) {
    if (n <= 1) return true;
    if (n <= dayNumberFor()) return true;
    return isDayDone(n - 1);
  }

  function markStage(n, stage, stats) {
    var r = dayRec(n);
    if (r.done.indexOf(stage) < 0) r.done.push(stage);
    if (stats) {
      var prev = r.stats[stage];
      // 重做时保留更好的成绩，但用时取最近一次
      if (!prev || stats.right > prev.right) r.stats[stage] = stats;
      else r.stats[stage] = Object.assign({}, prev, { seconds: stats.seconds });
    }
    save();
  }

  function markDayDone(n, summary) {
    var r = dayRec(n);
    r.finishedAt = new Date().toISOString();
    r.summary = summary || r.summary;
    save();
  }

  /* ============ 经验与等级 ============ */

  function addXP(amount) {
    var before = levelOf(state.xp);
    state.xp += amount;
    var after = levelOf(state.xp);
    save();
    return { gained: amount, total: state.xp, leveledUp: after.idx > before.idx, level: after, from: before };
  }

  function levelOf(xp) {
    var L = window.LEVELS || [];
    var idx = 0;
    for (var i = 0; i < L.length; i++) if (xp >= L[i].xp) idx = i;
    var cur = L[idx] || { title: '蒙童', xp: 0 };
    var next = L[idx + 1] || null;
    var base = cur.xp;
    var span = next ? next.xp - base : 1;
    return {
      idx: idx,
      title: cur.title,
      desc: cur.desc || '',
      cur: cur,
      next: next,
      into: xp - base,
      span: span,
      pct: next ? Math.min(100, Math.round(((xp - base) / span) * 100)) : 100
    };
  }

  function level() { return levelOf(state.xp); }

  /* ============ 打卡 ============ */

  function checkIn() {
    var t = todayStr();
    if (state.lastCheckIn === t) return { already: true, streak: state.streak };
    var y = new Date(); y.setDate(y.getDate() - 1);
    state.streak = (state.lastCheckIn === todayStr(y)) ? state.streak + 1 : 1;
    state.lastCheckIn = t;
    if (state.checkIns.indexOf(t) < 0) state.checkIns.push(t);
    save();
    return { already: false, streak: state.streak };
  }

  /* ============ 错题本 ============ */

  function addWrong(q, dayNum) {
    var id = q.id || (q.subject + ':' + (q.q || '').slice(0, 24));
    var hit = state.wrongBook.filter(function (w) { return w.id === id; })[0];
    if (hit) { hit.streak = 0; hit.addedAt = Date.now(); }
    else {
      state.wrongBook.push({
        id: id, q: q, subject: q.subject, tags: q.tags || [],
        day: dayNum, streak: 0, addedAt: Date.now()
      });
    }
    save();
  }

  /* 答对一次 streak+1，连对 2 次移出错题本 */
  function reviewWrong(id, correct) {
    var i = -1;
    state.wrongBook.forEach(function (w, k) { if (w.id === id) i = k; });
    if (i < 0) return;
    if (correct) {
      state.wrongBook[i].streak++;
      if (state.wrongBook[i].streak >= 2) state.wrongBook.splice(i, 1);
    } else {
      state.wrongBook[i].streak = 0;
    }
    save();
  }

  /* 艾宾浩斯：昨天错题优先，再补 3 天前 / 7 天前的题 */
  function reviewQueue(dayNum, want) {
    want = want || 5;
    var out = [];
    var seen = {};
    function push(q) {
      var id = q.id || (q.subject + ':' + (q.q || '').slice(0, 24));
      if (seen[id]) return;
      seen[id] = 1; out.push(q);
    }
    // 1) 错题本，最近错的排前面。
    //    只收「以前的天」错的题 —— 今天刚错的留到明天再考，
    //    否则同一天里刚做错马上又考一遍，既没有间隔效果，关卡列表还会中途变样。
    state.wrongBook
      .filter(function (w) { return w.day < dayNum; })
      .sort(function (a, b) { return b.addedAt - a.addedAt; })
      .forEach(function (w) { if (out.length < want) push(w.q); });
    // 2) 从 1/3/7 天前的题库补齐
    [1, 3, 7].forEach(function (back) {
      var d = window.DAYS && window.DAYS[dayNum - back];
      if (!d || out.length >= want) return;
      allQuestions(d).forEach(function (q) { if (out.length < want) push(q); });
    });
    return out.slice(0, want);
  }

  function allQuestions(dayData) {
    var qs = [];
    ['chinese', 'math', 'english'].forEach(function (s) {
      var sec = dayData[s];
      if (sec && sec.quiz) sec.quiz.forEach(function (q) { qs.push(Object.assign({ subject: s }, q)); });
    });
    return qs;
  }

  /* ============ 徽章 ============ */

  function grantBadge(id) {
    if (state.badges.indexOf(id) >= 0) return false;
    state.badges.push(id);
    save();
    return true;
  }
  function hasBadge(id) { return state.badges.indexOf(id) >= 0; }

  /* ============ 设置 ============ */

  function setSetting(k, v) {
    state.settings[k] = v;
    save();
    if (k === 'motion') document.documentElement.dataset.motion = v ? 'on' : 'off';
  }

  /* ============ 导入导出 ============ */

  function exportSave() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '润润学习存档_' + todayStr() + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function importSave(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        hydrate(JSON.parse(fr.result));
        save({ immediate: true });
        cb(null);
      } catch (e) { cb(e); }
    };
    fr.readAsText(file);
  }

  function resetAll() {
    state = clone(BLANK);
    state.createdAt = todayStr();
    save();
  }

  window.Store = {
    load: load, boot: boot, save: save, adopt: adopt,
    logAnswer: logAnswer, journalByTag: journalByTag,
    get state() { return state; },
    todayStr: todayStr, dayNumberFor: dayNumberFor,
    dayRec: dayRec, isStageDone: isStageDone, isDayDone: isDayDone, isUnlocked: isUnlocked,
    markStage: markStage, markDayDone: markDayDone,
    addXP: addXP, level: level, levelOf: levelOf,
    checkIn: checkIn,
    addWrong: addWrong, reviewWrong: reviewWrong, reviewQueue: reviewQueue, allQuestions: allQuestions,
    grantBadge: grantBadge, hasBadge: hasBadge,
    setSetting: setSetting,
    exportSave: exportSave, importSave: importSave, resetAll: resetAll
  };
})();
