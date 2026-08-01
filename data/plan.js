/* ============================================================
   plan.js —— 31 天总课表
   每天写清三科各学什么，地图和当日面板都从这里取标题。
   ============================================================ */

window.PLAN = {
  regions: [
    { id: 1, name: '第一关 · 开蒙', days: [1, 2, 3, 4, 5, 6, 7],       sub: '语文第一单元 · 观察物体与混合运算 · 英语 Unit 1' },
    { id: 2, name: '第二关 · 秋声', days: [8, 9, 10, 11, 12, 13, 14],  sub: '语文第二单元 · 长度与质量单位 · 英语 Unit 2-3' },
    { id: 3, name: '第三关 · 童话', days: [15, 16, 17, 18, 19, 20, 21],sub: '语文三、四单元 · 多位数乘一位数 · 英语 Unit 3-4' },
    { id: 4, name: '第四关 · 山河', days: [22, 23, 24, 25, 26, 27, 28],sub: '语文五、六单元 · 线和角 · 英语 Unit 5-6' },
    { id: 5, name: '第五关 · 登科', days: [29, 30, 31],                sub: '语文七、八单元 · 分数 · 总复习与开学挑战赛' }
  ],

  days: [
    null, // 占位，让下标 = 天数
    { d: 1,  date: '8/1',  chinese: '1 大青树下的小学',        math: '一·观察物体① 从不同位置看',   english: 'U1 Hello! I\'m…' },
    { d: 2,  date: '8/2',  chinese: '2 花的学校',              math: '观察物体② 立体图形与展开图',   english: 'U1 身体部位 eye/ear/hand' },
    { d: 3,  date: '8/3',  chinese: '3 不懂就要问',            math: '二·混合运算① 同级从左往右',    english: 'U1 Nice to meet you' },
    { d: 4,  date: '8/4',  chinese: '习作·猜猜他是谁 + 语文园地一', math: '混合运算② 先乘除后加减',   english: 'U1 Part B 好朋友' },
    { d: 5,  date: '8/5',  chinese: '4 古诗三首·望洞庭',       math: '混合运算③ 有括号先算括号',     english: 'U1 字母 Aa-Dd 与复习' },
    { d: 6,  date: '8/6',  chinese: '4 古诗三首·山行',         math: '混合运算④ 两步应用题',         english: 'U2 我的家人' },
    { d: 7,  date: '8/7',  chinese: '4 古诗三首·夜书所见',     math: '混合运算 整理与复习',          english: 'U2 This is my…', boss: true, bossName: '第一周大关' },

    { d: 8,  date: '8/8',  chinese: '5 铺满金色巴掌的水泥道',  math: '三·毫米、分米的认识',          english: 'U2 Is this your…?' },
    { d: 9,  date: '8/9',  chinese: '6 秋天的雨',              math: '千米的认识',                   english: 'U2 字母 Ee-Hh 与复习' },
    { d: 10, date: '8/10', chinese: '7 听听，秋的声音',        math: '长度单位换算与估测',           english: 'U3 动物园里的动物' },
    { d: 11, date: '8/11', chinese: '习作·写日记 + 语文园地二',math: '综合实践·曹冲称象：克与千克',  english: 'U3 Do you have a pet?' },
    { d: 12, date: '8/12', chinese: '8 总也倒不了的老屋',      math: '吨的认识与换算',               english: 'U3 大小与快慢' },
    { d: 13, date: '8/13', chinese: '9 犟龟',                  math: '质量单位综合练习',             english: 'U3 字母 Ii-Ll' },
    { d: 14, date: '8/14', chinese: '10 小狗学叫 + 预测策略',  math: '第 2 周整理复习',              english: 'U3 复习', boss: true, bossName: '第二周大关' },

    { d: 15, date: '8/15', chinese: '语文园地三 + 口语交际',   math: '四·多位数乘一位数：口算',      english: 'U4 植物的名字' },
    { d: 16, date: '8/16', chinese: '11 宝葫芦的秘密',         math: '笔算：不进位',                 english: 'U4 Do you like…?' },
    { d: 17, date: '8/17', chinese: '12 在牛肚子里旅行',       math: '笔算：一次进位',               english: 'U4 农场与果园' },
    { d: 18, date: '8/18', chinese: '13 一块奶酪',             math: '笔算：连续进位',               english: 'U4 字母 Mm-Pp' },
    { d: 19, date: '8/19', chinese: '习作·我来编童话',         math: '中间、末尾有 0 的乘法',        english: 'U4 复习' },
    { d: 20, date: '8/20', chinese: '语文园地四',              math: '乘法估算与解决问题',           english: 'U5 颜色' },
    { d: 21, date: '8/21', chinese: '14 搭船的鸟',             math: '多位数乘一位数 整理复习',      english: 'U5 What colour is it?', boss: true, bossName: '第三周大关' },

    { d: 22, date: '8/22', chinese: '15 金色的草地',           math: '综合实践·数字编码',            english: 'U5 颜色混合' },
    { d: 23, date: '8/23', chinese: '习作·我们眼中的缤纷世界', math: '五·线和角：线段射线直线',      english: 'U5 字母 Qq-Tt' },
    { d: 24, date: '8/24', chinese: '16 富饶的西沙群岛',       math: '角的认识与量角',               english: 'U5 复习' },
    { d: 25, date: '8/25', chinese: '17 海滨小城',             math: '锐角、直角、钝角',             english: 'U6 数字 1-10' },
    { d: 26, date: '8/26', chinese: '18 美丽的小兴安岭',       math: '画角与线和角复习',             english: 'U6 How old are you?' },
    { d: 27, date: '8/27', chinese: '19 香港，璀璨的明珠',     math: '六·分数：几分之一',            english: 'U6 生日与购物' },
    { d: 28, date: '8/28', chinese: '习作·这儿真美 + 语文园地六', math: '几分之几与比大小',          english: 'U6 字母 Uu-Zz', boss: true, bossName: '第四周大关' },

    { d: 29, date: '8/29', chinese: '20 古诗三首（鹿柴/望天门山/饮湖上初晴后雨）', math: '分数的简单计算', english: '6 个单元词汇总复习' },
    { d: 30, date: '8/30', chinese: '21-22 课 + 23-26 课速览', math: '七·复习与关联 + 数学广角',     english: '6 个单元句型总复习' },
    { d: 31, date: '8/31', chinese: '6 首古诗 + 日积月累 总背', math: '全册总复习',                  english: '全册总复习', exam: true, bossName: '开学挑战赛' }
  ]
};

/* 每天的关卡顺序 */
window.STAGES = [
  { key: 'review',  name: '昨日回顾', icon: '回', desc: '5 道闪卡，把昨天错的先补上' },
  { key: 'chinese', name: '语文关',   icon: '语', desc: '生字 · 课文 · 阅读 · 背诵' },
  { key: 'math',    name: '数学关',   icon: '数', desc: '讲解 · 例题 · 练习 · 应用题' },
  { key: 'english', name: '英语关',   icon: '英', desc: '单词 · 句型 · 听力 · 拼读' },
  { key: 'boss',    name: 'Boss 战',  icon: '战', desc: '三科综合，限时挑战' }
];
