/* ============================================================
   等级称号（科举主题）与徽章
   ============================================================ */

window.LEVELS = [
  { title: '蒙童', xp: 0,     desc: '刚刚启蒙，字还认不全' },
  { title: '学童', xp: 220,   desc: '坐得住了，能自己念课文' },
  { title: '童生', xp: 560,   desc: '过了第一道门槛' },
  { title: '秀才', xp: 1050,  desc: '识字过百，出口成章' },
  { title: '廪生', xp: 1750,  desc: '功课扎实，先生点头' },
  { title: '举人', xp: 2800,  desc: '乡试得中，名声在外' },
  { title: '贡士', xp: 4200,  desc: '会试上榜，进京面圣' },
  { title: '进士', xp: 6200,  desc: '金榜题名' },
  { title: '榜眼', xp: 8800,  desc: '天下第二' },
  { title: '状元', xp: 12000, desc: '独占鳌头，天下第一' }
];

window.BADGES = [
  { id: 'first',      ic: '🌱', name: '开学第一课', hint: '完成第 1 天的全部关卡' },
  { id: 'streak3',    ic: '🔥', name: '三日连击',   hint: '连续 3 天打卡' },
  { id: 'streak7',    ic: '🔥', name: '七日连击',   hint: '连续 7 天打卡' },
  { id: 'streak14',   ic: '⚡', name: '半月不断',   hint: '连续 14 天打卡' },
  { id: 'streak31',   ic: '👑', name: '整月全勤',   hint: '连续 31 天打卡' },
  { id: 'perfect',    ic: '💯', name: '零错题日',   hint: '一整天一道题都没错' },
  { id: 'combo10',    ic: '🎯', name: '十连击',     hint: '一次连对 10 题' },
  { id: 'hanzi100',   ic: '🖌️', name: '生字小能手', hint: '认识 100 个生字' },
  { id: 'hanzi250',   ic: '📜', name: '识字二百五', hint: '认识全部 250 个生字' },
  { id: 'mathking',   ic: '🧮', name: '口算王',     hint: '数学关卡累计答对 200 题' },
  { id: 'wordmaster', ic: '🔤', name: '单词达人',   hint: '英语单词累计答对 150 题' },
  { id: 'reciter',    ic: '🎋', name: '背诵之星',   hint: '完整背下 6 首古诗' },
  { id: 'bossweek',   ic: '🏰', name: '周关斩将',   hint: '通关一次周末大 Boss' },
  { id: 'examdone',   ic: '📝', name: '开学挑战赛', hint: '完成三科全部试卷' },
  { id: 'zhuangyuan', ic: '🏆', name: '状元及第',   hint: '达到最高等级' }
];
