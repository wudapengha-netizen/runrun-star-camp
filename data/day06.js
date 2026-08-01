/* ============================================================
   第 6 关 · 8月6日
   语文 4 古诗三首·山行 ｜ 数学 混合运算④ 两步应用题 ｜ 英语 U2 我的家人
   ============================================================ */
window.DAYS[6] = {

chinese: {
  goal: '背下并会默写《山行》，会写"寒、径、斜、枫、霜"',
  teach: [
    {
      title: '🍁 山行',
      lang: 'zh',
      speak: '山行，唐，杜牧。远上寒山石径斜，白云生处有人家。停车坐爱枫林晚，霜叶红于二月花。',
      body: [
        '<div style="text-align:center;font-family:var(--font-brush);font-size:25px;line-height:2.1">' +
        '<b>山　行</b><br>' +
        '<span style="font-size:15px;color:var(--ink-soft)">［唐］杜牧</span><br>' +
        '远上寒山石径斜，<br>白云生处有人家。<br>停车坐爱枫林晚，<br>霜叶红于二月花。</div>',
        '⚠️ 课本要求：<span class="key">这首诗要会默写</span>（不只是背，还要能写出来）。'
      ]
    },
    {
      title: '📌 课本注释（一定要记）',
      points: [
        '<b>〔寒山〕</b><span class="key">深秋时节</span>的山。（不是"冷的山"，是秋天的山）',
        '<b>〔斜〕</b>（xié）曲折向前延伸。',
        '<b>〔生〕</b>产生，生出。（白云"生"处 = 白云生出来的地方）',
        '<b>〔坐〕</b><span class="key">因为</span>。（不是"坐下"！这是最容易考错的一个字）'
      ]
    },
    {
      title: '💡 诗的意思',
      points: [
        '<b>远上寒山石径斜</b>——一条石头小路弯弯曲曲地伸向深秋的远山。',
        '<b>白云生处有人家</b>——在白云生出来的地方，隐隐约约有几户人家。',
        '<b>停车坐爱枫林晚</b>——<span class="hl">因为</span>喜爱这傍晚的枫树林，' +
        '我停下了车子。',
        '<b>霜叶红于二月花</b>——经霜的枫叶，<span class="hl">比二月的春花还要红</span>。'
      ]
    },
    {
      title: '🔍 这首诗最好的一句',
      body: [
        '<span class="key">霜叶红于二月花</span>——这是千古名句。',
        '为什么好？因为一般人觉得秋天是萧条的、凋零的，' +
        '可杜牧说：秋天被霜打过的枫叶，<b>比春天的花还红还美</b>！',
        '"<b>红于</b>"就是"比……更红"。他用一个"比"字，' +
        '把秋天写得比春天还热闹、还有生命力。'
      ]
    },
    {
      title: '⚠️ 三个最容易错的地方',
      points: [
        '<b>坐</b> ≠ 坐下，这里是<span class="key">因为</span>。' +
        '"停车坐爱枫林晚" = 停下车子<b>因为</b>喜爱傍晚的枫林。',
        '<b>斜</b> 读 <span class="key">xié</span>（新教材注音就是 xié，不读 xiá）。',
        '<b>红于</b> = 比……更红。不是"红色的"。'
      ]
    },
    {
      title: '🖌️ 今天要会写的字',
      hanzi: [
        { zi: '寒', py: 'hán', words: '寒山、寒冷' },
        { zi: '径', py: 'jìng', words: '石径、小径' },
        { zi: '斜', py: 'xié', words: '斜坡、倾斜' },
        { zi: '枫', py: 'fēng', words: '枫林、枫叶' },
        { zi: '霜', py: 'shuāng', words: '霜叶、霜冻' }
      ]
    },
    {
      title: '✏️ 写字提醒',
      points: [
        '<b>寒</b>：宝盖头下面是"三横两竖"再加两点，笔画多，慢慢写。',
        '<b>枫</b>：木字旁 + 风。跟树有关，所以是木字旁。',
        '<b>霜</b>：雨字头 + 相。跟天气有关，所以是雨字头。' +
        '（同样是雨字头的还有：雪、雷、雾、露。）'
      ]
    }
  ],
  quiz: [
    { id: 'd6c1', type: 'recite', tags: ['古诗背诵·山行'],
      q: '把《山行》补完整（这首要默写！）',
      text: '远上{寒}山石{径}{斜}，白云生处有人家。停车{坐}爱{枫}林晚，{霜}叶红于二月花。',
      explain: '「坐」是"因为"，「斜」读 xié。这四个字都是默写必考。' },

    { id: 'd6c2', type: 'choice', tags: ['古诗·注释'],
      q: '"停车<b>坐</b>爱枫林晚"的"坐"是什么意思？',
      options: ['坐下来', '因为', '座位', '停留'], answer: 1,
      explain: '课本注释：〔坐〕<b>因为</b>。整句意思是"<b>因为</b>喜爱傍晚的枫树林，' +
               '所以停下了车"。这是全诗最容易考错的字！' },

    { id: 'd6c3', type: 'choice', tags: ['古诗·注释'],
      q: '"远上<b>寒山</b>石径斜"的"寒山"是什么意思？',
      options: ['很冷的山', '深秋时节的山', '有雪的山', '一座叫寒山的山'], answer: 1,
      explain: '课本注释：〔寒山〕<b>深秋时节</b>的山。' },

    { id: 'd6c4', type: 'choice', tags: ['古诗·名句理解'],
      q: '"霜叶红于二月花"是什么意思？',
      options: [
        '霜打的叶子和二月的花一样红',
        '霜打的枫叶比二月的春花还要红',
        '二月的花比霜叶红',
        '霜叶和花都不红'
      ], answer: 1,
      explain: '"红<b>于</b>"就是"比……更红"。杜牧觉得秋天的枫叶比春花更美，' +
               '这是这首诗最有名的一句。' },

    { id: 'd6c5', type: 'choice', tags: ['古诗·作者'],
      q: '《山行》的作者是——',
      options: ['［唐］刘禹锡', '［唐］杜牧', '［宋］叶绍翁', '［清］袁枚'], answer: 1,
      explain: '《山行》是唐代<b>杜牧</b>写的。昨天学的《望洞庭》是刘禹锡写的。' },

    { id: 'd6c6', type: 'choice', tags: ['古诗·读音'],
      q: '"石径<b>斜</b>"的"斜"，按新教材应该读——',
      options: ['xié', 'xiá', 'yé', 'shé'], answer: 0,
      explain: '课本给的注音是 <b>xié</b>，意思是"曲折向前延伸"。' },

    { id: 'd6c7', type: 'pinyin', tags: ['生字·写字表'],
      q: '看拼音写词语',
      items: [ { py: 'fēng lín', word: '枫林' }, { py: 'shuāng yè', word: '霜叶' } ],
      explain: '「枫」是木字旁（跟树有关），「霜」是雨字头（跟天气有关）。' },

    { id: 'd6c8', type: 'choice', tags: ['汉字·偏旁'],
      q: '"霜"是雨字头。下面哪个字<b>也是</b>雨字头？',
      options: ['相', '枫', '雪', '寒'], answer: 2,
      explain: '雨字头的字大多和天气有关：<b>雪、雷、雾、露、霜</b>。' },

    { id: 'd6c9', type: 'order', tags: ['古诗背诵·山行'],
      q: '把《山行》四句排好', joiner: '　',
      items: ['远上寒山石径斜', '白云生处有人家', '停车坐爱枫林晚', '霜叶红于二月花'],
      answer: ['远上寒山石径斜', '白云生处有人家', '停车坐爱枫林晚', '霜叶红于二月花'],
      explain: '前两句写<b>远景</b>（山路、白云、人家），后两句写<b>近景</b>（枫林、霜叶）。' },

    { id: 'd6c10', type: 'multi', tags: ['古诗·景物'],
      q: '《山行》里写到了哪些景物？（多选）',
      options: ['寒山、石径', '白云、人家', '枫林、霜叶', '荷花、蜻蜓'], answer: [0, 1, 2],
      explain: '荷花蜻蜓是夏天的景物，这首诗写的是<b>深秋</b>。' },

    { id: 'd6c11', type: 'choice', tags: ['古诗·情感'],
      q: '这首诗表达了诗人什么样的感情？',
      options: [
        '对秋天的喜爱和赞美',
        '因为天冷而难过',
        '想家',
        '觉得山路太难走'
      ], answer: 0,
      explain: '"<b>坐爱</b>枫林晚"（因为喜爱而停车）、"霜叶<b>红于</b>二月花"（比春花还美）' +
               '——满满都是对秋景的喜爱和赞美。' },

    { id: 'd6c12', type: 'fill', tags: ['古诗·默写'],
      q: '默写《山行》的后两句',
      blanks: 2, wide: true, hint: '停车…… / 霜叶……',
      answer: [['停车坐爱枫林晚'], ['霜叶红于二月花']],
      explain: '课本明确要求"默写《山行》"，这两句一定要能写出来。' },

    { id: 'd6c13', type: 'readaloud', tags: ['朗读·古诗'], lang: 'zh',
      q: '有感情地读《山行》',
      text: '远上寒山石径斜，白云生处有人家。停车坐爱枫林晚，霜叶红于二月花。',
      explain: '最后一句"霜叶红于二月花"要读得高一点、慢一点，把那种惊喜和赞美读出来。' },

    { id: 'd6c14', type: 'choice', tags: ['古诗·对比'],
      q: '《望洞庭》和《山行》都写秋天，它们最大的不同是什么？',
      options: [
        '《望洞庭》写<b>湖</b>的宁静，《山行》写<b>山</b>的火红',
        '两首诗一模一样',
        '《望洞庭》写春天',
        '《山行》没写景物'
      ], answer: 0,
      explain: '《望洞庭》是<b>安静</b>的（湖光、秋月、白银盘），' +
               '《山行》是<b>热烈</b>的（枫林、霜叶、比春花还红）。同一个秋天，两种感觉。' }
  ]
},

math: {
  goal: '会用画图的办法分析两步应用题，会列综合算式解决问题',
  teach: [
    {
      title: '🎯 解决问题的三步法（课本方法）',
      points: [
        '① <b>阅读与理解</b>：题目告诉了我什么？要我求什么？',
        '② <b>分析与解答</b>：想清楚<span class="key">先求什么，再求什么</span>，然后列式。',
        '③ <b>回顾与反思</b>：算完检查一下，答案合不合理？'
      ]
    },
    {
      title: '✂️ 例题一：剪窗花',
      body: [
        '<span class="hl">剪纸小组要剪 100 张窗花。第一天剪了 38 张，第二天剪了 42 张，' +
        '还剩多少张没剪？</span>',
        '这题有<b>两种</b>想法，都对：'
      ],
      calc: [
        { expr: '<b>想法一：</b>先算两天一共剪了多少' },
        { expr: '100 − (38 + 42) = 100 − 80 = <span class="mark">20</span>（张）', note: '要先加，所以用括号' },
        { expr: '<b>想法二：</b>一天一天地减' },
        { expr: '100 − 38 − 42 = 62 − 42 = <span class="mark">20</span>（张）', note: '同级运算，从左往右' }
      ]
    },
    {
      title: '🌸 例题二：做花（画线段图！）',
      body: [
        '<span class="hl">小明做了 12 朵花，小红做的比小明少 4 朵，' +
        '小军做的是小红的 3 倍。小军做了多少朵？</span>',
        '这种题<span class="key">一定要画线段图</span>，画出来就不会绕晕了：'
      ],
      figure:
        '<div style="text-align:left;display:inline-block;font-size:15px;line-height:2.2">' +
        '<div>小明：<span style="display:inline-block;width:120px;height:20px;background:var(--azurite);' +
        'border:2px solid var(--ink);border-radius:4px;vertical-align:middle"></span> 12 朵</div>' +
        '<div>小红：<span style="display:inline-block;width:80px;height:20px;background:var(--jade);' +
        'border:2px solid var(--ink);border-radius:4px;vertical-align:middle"></span> 比小明少 4 朵</div>' +
        '<div>小军：<span style="display:inline-block;width:240px;height:20px;background:var(--cinnabar);' +
        'border:2px solid var(--ink);border-radius:4px;vertical-align:middle"></span> 是小红的 3 倍，? 朵</div>' +
        '</div>',
      calc: [
        { expr: '12 − 4 = 8（朵）', note: '先求小红做了多少' },
        { expr: '8 × 3 = 24（朵）', note: '再求小军做了多少' },
        { expr: '综合算式：(12 − 4) × 3 = <span class="mark">24</span>（朵）' }
      ]
    },
    {
      title: '📿 例题三：穿手链',
      body: [
        '<span class="hl">红珠子有 24 颗，黄珠子有 18 颗，6 颗同色的珠子穿一条手链。' +
        '红珠子比黄珠子可以多穿几条？</span>'
      ],
      calc: [
        { expr: '24 − 18 = 6（颗）', note: '先求红珠子比黄珠子多几颗' },
        { expr: '6 ÷ 6 = <span class="mark">1</span>（条）', note: '再求多穿几条' },
        { expr: '综合算式：(24 − 18) ÷ 6 = 1（条）' }
      ],
      points: [
        '也可以分别算：24÷6=4 条，18÷6=3 条，4−3=1 条。<b>两种想法都对。</b>'
      ]
    },
    {
      title: '🔑 什么时候要加括号？',
      points: [
        '<span class="key">当你想"先算加减、后算乘除"的时候，就必须加括号。</span>',
        '比如"先求和，再平均分" → <b>(a + b) ÷ c</b>',
        '比如"先求差，再求几倍" → <b>(a − b) × c</b>'
      ]
    }
  ],
  quiz: [
    { id: 'd6m1', type: 'fill', tags: ['两步应用题·括号'],
      q: '剪纸小组要剪 100 张窗花，第一天剪了 38 张，第二天剪了 42 张。还剩多少张？（写得数）',
      blanks: 1,
      answer: [['20']],
      explain: '100 − (38+42) = 100 − 80 = <b>20</b> 张。也可以 100−38−42 = 20。' },

    { id: 'd6m2', type: 'choice', tags: ['两步应用题·列式'],
      q: '小明做了 12 朵花，小红比小明少 4 朵，小军做的是小红的 3 倍。求小军做了几朵，正确算式是——',
      options: [
        '(12 − 4) × 3',
        '12 − 4 × 3',
        '12 × 3 − 4',
        '(12 + 4) × 3'
      ], answer: 0,
      explain: '要<b>先</b>求小红（12−4=8），<b>再</b>求小军（8×3=24），所以减法要加括号。' +
               '答案是 <b>24</b> 朵。' },

    { id: 'd6m3', type: 'fill', tags: ['两步应用题·倍数'],
      q: '接上题：小军做了多少朵花？（写得数）',
      blanks: 1,
      answer: [['24']],
      explain: '(12−4)×3 = 8×3 = <b>24</b> 朵。' },

    { id: 'd6m4', type: 'choice', tags: ['两步应用题·列式'],
      q: '红珠子 24 颗，黄珠子 18 颗，6 颗同色珠子穿一条手链。红珠子比黄珠子多穿几条？',
      options: [
        '(24 − 18) ÷ 6 = 1（条）',
        '24 − 18 ÷ 6 = 21（条）',
        '(24 + 18) ÷ 6 = 7（条）',
        '24 ÷ 6 + 18 = 22（条）'
      ], answer: 0,
      explain: '先求多几颗（24−18=6），再求多几条（6÷6=1）。也可以 24÷6−18÷6 = 4−3 = 1。' },

    { id: 'd6m5', type: 'fill', tags: ['两步应用题·平均分'],
      q: '一年级有 26 人，二年级有 22 人，每 8 人分一组。一共能分多少组？（写得数）',
      blanks: 1,
      answer: [['6']],
      explain: '(26+22)÷8 = 48÷8 = <b>6</b> 组。要先合起来，所以加括号。' },

    { id: 'd6m6', type: 'choice', tags: ['两步应用题·画图'],
      q: '碰到"比……多／少……"和"是……的几倍"这类题，最好用什么办法帮忙？',
      options: ['背公式', '画线段图', '猜答案', '用计算器'], answer: 1,
      explain: '课本反复强调画<b>线段图</b>。把关系画出来，先算什么后算什么一眼就看明白了。' },

    { id: 'd6m7', type: 'fill', tags: ['混合运算·综合'],
      q: '算一算：(45 − 27) ÷ 9 = ______',
      blanks: 1,
      answer: [['2']],
      explain: '先算括号 45−27=18，再算 18÷9=<b>2</b>。' },

    { id: 'd6m8', type: 'fill', tags: ['混合运算·综合'],
      q: '算一算：63 ÷ 7 + 5 × 4 = ______',
      blanks: 1, hint: '两边都要先算',
      answer: [['29']],
      explain: '63÷7=9，5×4=20，9+20=<b>29</b>。先乘除后加减。' },

    { id: 'd6m9', type: 'choice', tags: ['两步应用题·列式'],
      q: '书店进了 80 本书，上周卖了 25 本，这周卖了 35 本，还剩多少本？下面哪个算式<b>不对</b>？',
      options: [
        '80 − 25 − 35',
        '80 − (25 + 35)',
        '80 − 25 + 35',
        '以上都对'
      ], answer: 2,
      explain: '第三个错了——这周卖出去也要<b>减</b>，不能加。前两个都得 20 本。' },

    { id: 'd6m10', type: 'fill', tags: ['两步应用题·倍数'],
      q: '妈妈买了 5 千克苹果，梨的重量是苹果的 3 倍。苹果和梨一共多少千克？（写得数）',
      blanks: 1,
      answer: [['20']],
      explain: '梨：5×3=15（千克），一共：5+15=<b>20</b>（千克）。综合算式：5+5×3=20。' },

    { id: 'd6m11', type: 'order', tags: ['解决问题·步骤'],
      q: '把解决问题的三个步骤排好', joiner: ' → ',
      items: ['阅读与理解', '分析与解答', '回顾与反思'],
      answer: ['阅读与理解', '分析与解答', '回顾与反思'],
      explain: '这是课本教的解题三步：先看懂题，再动手算，最后检查。' },

    { id: 'd6m12', type: 'fill', tags: ['混合运算·综合'],
      q: '算一算：100 − 6 × 8 = ______',
      blanks: 1,
      answer: [['52']],
      explain: '先算 6×8=48，再算 100−48=<b>52</b>。' },

    { id: 'd6m13', type: 'choice', tags: ['两步应用题·列式'],
      q: '三（1）班有 24 人，三（2）班比三（1）班多 6 人。两个班一共多少人？',
      options: [
        '24 + (24 + 6) = 54（人）',
        '24 + 6 = 30（人）',
        '24 × 2 + 6 = 54（人）',
        'A 和 C 都对'
      ], answer: 3,
      explain: '三（2）班：24+6=30 人。两班共：24+30=54 人。' +
               '写成 24+(24+6) 或 24×2+6 都能得 <b>54</b>，两种想法都对。' },

    { id: 'd6m14', type: 'fill', tags: ['两步应用题·剩余'],
      q: '果园摘了 9 筐苹果，每筐 7 千克。卖出 40 千克后，还剩多少千克？（写得数）',
      blanks: 1,
      answer: [['23']],
      explain: '9×7=63（千克），63−40=<b>23</b>（千克）。综合算式：9×7−40=23。' }
  ]
},

english: {
  goal: 'Unit 2 Different families —— 会说 6 个家庭成员，会介绍自己的家人',
  teach: [
    {
      title: '👨‍👩‍👧 Unit 2  Different families',
      body: [
        '新单元的大问题：<span class="key">What makes a family?</span>（什么让一群人成为一家人？）',
        '还有一个问题：<span class="key">How are families different?</span>（每家有什么不一样？）',
        '答案在课文最后：不管家里人多还是人少，' +
        '<b>They love each other.</b>（他们互相关爱。）'
      ]
    },
    {
      title: '🔤 家庭成员（每个词都有"正式"和"口语"两种说法）',
      words: [
        { en: 'father', ipa: '/ˈfɑːðə(r)/', cn: '父亲（口语：dad 爸爸）' },
        { en: 'mother', ipa: '/ˈmʌðə(r)/', cn: '母亲（口语：mum 妈妈）' },
        { en: 'grandfather', ipa: '/ˈɡrænfɑːðə(r)/', cn: '（外）祖父（口语：grandpa 爷爷/姥爷）' },
        { en: 'grandmother', ipa: '/ˈɡrænmʌðə(r)/', cn: '（外）祖母（口语：grandma 奶奶/姥姥）' },
        { en: 'sister', ipa: '/ˈsɪstə(r)/', cn: '姐姐；妹妹' },
        { en: 'me', ipa: '/miː/', cn: '我' },
        { en: 'family', ipa: '/ˈfæməli/', cn: '家；家庭' }
      ]
    },
    {
      title: '🎵 Listen and chant —— 课本歌谣',
      lang: 'en',
      passage:
        'This is my mum. Hello, hello, hello! ' +
        'This is my dad. Hi, hi, hi! ' +
        'This is my sister. How are you? ' +
        'This is my grandma. Nice to meet you. ' +
        'This is my grandpa. How do you do?'
    },
    {
      title: '💬 Let\'s talk —— 课本原文',
      lang: 'en',
      passage:
        'Mum! Dad! This is my friend, Sarah Miller. ' +
        'Hi, Sarah. Nice to meet you. ' +
        'This is my grandma. This is my grandpa.'
    },
    {
      title: '🔑 今天最重要的句型',
      points: [
        '<span class="key">This is my …</span>　这是我的……',
        '介绍<b>一个人</b>的时候用 This is，不要说 He is。<br>' +
        '<b>This is my</b> mum.　这是我妈妈。<br>' +
        '<b>This is my</b> grandpa.　这是我爷爷。',
        '把朋友介绍给家人也一样：<b>This is my friend, Sarah Miller.</b>'
      ]
    },
    {
      title: '🗣️ 三种打招呼，用在不同的人身上',
      points: [
        '<b>Hello! / Hi!</b>　最普通，谁都能用。',
        '<b>How are you?</b>　你好吗？（问对方近况，熟人之间）',
        '<b>Nice to meet you.</b>　见到你很高兴。（第一次见面）',
        '<b>How do you do?</b>　您好。（比较正式，对长辈用；' +
        '别人这么说，你也回一句 <b>How do you do?</b>）'
      ]
    },
    {
      title: '📖 Start to read（课本小短文）',
      lang: 'en',
      passage:
        'This family is small. They love each other. ' +
        'This family is big. They love each other too.'
    }
  ],
  quiz: [
    { id: 'd6e1', type: 'listen', tags: ['听力·家庭成员'], lang: 'en',
      q: '听一听，这个词是什么意思？', audio: 'grandmother',
      options: ['祖母；奶奶', '祖父；爷爷', '母亲', '姐妹'], answer: 0,
      explain: 'grandmother /ˈɡrænmʌðə(r)/ （外）祖母。口语常说 <b>grandma</b>。' },

    { id: 'd6e2', type: 'listen', tags: ['听力·家庭成员'], lang: 'en',
      q: '听一听，这个词是什么意思？', audio: 'sister',
      options: ['哥哥；弟弟', '姐姐；妹妹', '妈妈', '阿姨'], answer: 1,
      explain: 'sister /ˈsɪstə(r)/ 姐姐或妹妹（英语里不分大小）。' },

    { id: 'd6e3', type: 'match', tags: ['词汇·家庭成员'],
      q: '把英语和中文连起来',
      pairs: [
        ['father', '父亲'], ['mother', '母亲'],
        ['grandfather', '祖父'], ['grandmother', '祖母'], ['sister', '姐妹']
      ],
      explain: 'Unit 2 Part A 的五个核心词。' },

    { id: 'd6e4', type: 'match', tags: ['词汇·正式与口语'],
      q: '把"正式说法"和"口语说法"连起来',
      pairs: [
        ['father', 'dad'], ['mother', 'mum'],
        ['grandfather', 'grandpa'], ['grandmother', 'grandma']
      ],
      explain: '正式场合用 father/mother，平时在家说 dad/mum，就像中文的"父亲"和"爸爸"。' },

    { id: 'd6e5', type: 'choice', tags: ['句型·介绍家人'],
      q: '"这是我妈妈。" 用英语怎么说？',
      options: ['This is my mum.', 'This my mum.', 'She my mum.', 'This is mum my.'], answer: 0,
      explain: 'This is my mum. 介绍一个人用 <b>This is</b>，中间的 is 不能少。' },

    { id: 'd6e6', type: 'order', tags: ['连词成句'],
      q: '排成一句话：这是我爷爷。', joiner: ' ',
      items: ['This', 'is', 'my', 'grandpa'],
      answer: ['This', 'is', 'my', 'grandpa'],
      explain: 'This is my grandpa. 课本 Let\'s talk 的原句。' },

    { id: 'd6e7', type: 'listen', tags: ['听力·句子'], lang: 'en',
      q: '听句子，说话人在介绍谁？', audio: 'This is my friend, Sarah Miller.',
      options: ['他的朋友萨拉', '他的妈妈', '他的姐姐', '他的老师'], answer: 0,
      explain: 'This is my <b>friend</b>, Sarah Miller. = 这是我的朋友，萨拉·米勒。' },

    { id: 'd6e8', type: 'choice', tags: ['句型·问候'],
      q: '第一次见到朋友的奶奶，说哪句最合适？',
      options: ["How do you do?", "Oh no!", "What's this?", "Bye!"], answer: 0,
      explain: 'How do you do? 是比较正式、有礼貌的问候，对长辈用很合适。' +
               '对方也会回一句 How do you do?' },

    { id: 'd6e9', type: 'fill', tags: ['词汇·拼写'],
      q: '写出英语单词：家庭 = ______',
      blanks: 1, wide: true, hint: '6 个字母，f 开头',
      answer: [['family']],
      explain: 'family /ˈfæməli/ 家；家庭。' },

    { id: 'd6e10', type: 'choice', tags: ['课文理解·主题'],
      q: '课本说：有的家庭人多，有的家庭人少，但它们有什么共同点？',
      options: [
        'They love each other.（他们互相关爱）',
        '他们都住在城市里',
        '他们都有三个孩子',
        '他们都养宠物'
      ], answer: 0,
      explain: '课本原句："This family is small. They love each other. ' +
               'This family is big. <b>They love each other too.</b>" 这就是这一单元想说的。' },

    { id: 'd6e11', type: 'listen', tags: ['听力·歌谣'], lang: 'en',
      q: '听歌谣的一句，说的是谁？', audio: 'This is my sister. How are you?',
      options: ['姐姐／妹妹', '爸爸', '奶奶', '爷爷'], answer: 0,
      explain: 'sister 是姐姐或妹妹。' },

    { id: 'd6e12', type: 'choice', tags: ['词汇·构词'],
      q: 'grandfather 这个词是由哪两部分组成的？',
      options: ['grand + father', 'gran + father', 'grandf + ather', 'g + randfather'],
      answer: 0,
      explain: '<b>grand</b>（表示"祖辈"）+ <b>father</b>（父亲）= 祖父。' +
               '同样：grand + mother = grandmother。这样记就好记多了。' },

    { id: 'd6e13', type: 'readaloud', tags: ['朗读·歌谣'], lang: 'en',
      q: '大声读 Unit 2 的 chant',
      text: 'This is my mum. Hello! This is my dad. Hi! This is my sister. How are you? This is my grandma. Nice to meet you.',
      explain: '一边读一边想象你在给别人介绍自己的家人，感觉会很不一样。' },

    { id: 'd6e14', type: 'choice', tags: ['复习·Unit 1'],
      q: '（复习）字母 <b>C</b> 发的音，出现在下面哪个词的开头？',
      options: ['dog', 'bed', 'cat', 'apple'], answer: 2,
      explain: 'cat /kæt/ 开头是 /k/，正是字母 c 的音。' }
  ]
}
};
