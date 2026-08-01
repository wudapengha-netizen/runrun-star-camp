/* ============================================================
   第 7 关 · 8月7日
   语文 4 古诗三首·夜书所见 ｜ 数学 混合运算整理复习 ｜ 英语 U2 This is my…
   🏰 第一周大 Boss
   ============================================================ */
window.DAYS[7] = {

chinese: {
  goal: '背下《夜书所见》，会写"挑、深、落"，把三首古诗串起来复习',
  teach: [
    {
      title: '🏮 夜书所见',
      lang: 'zh',
      speak: '夜书所见，宋，叶绍翁。萧萧梧叶送寒声，江上秋风动客情。知有儿童挑促织，夜深篱落一灯明。',
      body: [
        '<div style="text-align:center;font-family:var(--font-brush);font-size:25px;line-height:2.1">' +
        '<b>夜书所见</b><br>' +
        '<span style="font-size:15px;color:var(--ink-soft)">［宋］叶绍翁</span><br>' +
        '萧萧梧叶送寒声，<br>江上秋风动客情。<br>知有儿童挑促织，<br>夜深篱落一灯明。</div>',
        '题目里的<b>"书"</b>是<span class="key">写</span>的意思。' +
        '"夜书所见"＝ 把夜里看到的写下来。'
      ]
    },
    {
      title: '📌 课本注释',
      points: [
        '<b>〔萧萧〕</b>这里形容<span class="key">风吹梧桐叶发出的声音</span>。',
        '<b>〔挑〕</b>（tiǎo）用细长的东西拨。',
        '<b>〔促织〕</b>就是<span class="key">蟋蟀</span>，也叫蛐蛐。',
        '<b>〔篱落〕</b>篱笆。'
      ]
    },
    {
      title: '💡 诗的意思',
      points: [
        '<b>萧萧梧叶送寒声</b>——秋风吹动梧桐叶，沙沙作响，送来阵阵寒意。',
        '<b>江上秋风动客情</b>——江上的秋风，勾起了<span class="hl">离家在外的人</span>的思乡之情。' +
        '（"客"就是漂泊在外的人，指诗人自己。）',
        '<b>知有儿童挑促织</b>——料想是有小孩在拨弄蟋蟀（斗蛐蛐）。',
        '<b>夜深篱落一灯明</b>——夜深了，篱笆旁边还亮着一盏灯。'
      ]
    },
    {
      title: '🔍 这首诗为什么动人',
      body: [
        '前两句是<span class="key">冷</span>的：秋风、寒声、想家。',
        '后两句是<span class="key">暖</span>的：小孩、蛐蛐、一盏灯。',
        '诗人一个人在外地，秋夜里正难过，忽然看见远处篱笆边有一盏灯，' +
        '猜到是小孩在斗蛐蛐——<b>那一瞬间他想起了自己的童年，想起了家。</b>' +
        '一冷一暖，思乡的味道就出来了。'
      ]
    },
    {
      title: '🖌️ 今天要会写的字',
      hanzi: [
        { zi: '挑', py: 'tiǎo', words: '挑促织、挑灯' },
        { zi: '深', py: 'shēn', words: '夜深、深浅' },
        { zi: '落', py: 'luò', words: '篱落、落叶' }
      ]
    },
    {
      title: '⚠️ 多音字：挑',
      points: [
        '<b>tiǎo</b>：挑促织、挑灯、挑衅　→　用细长的东西<b>拨</b>',
        '<b>tiāo</b>：挑水、挑担、挑选　→　用肩膀<b>担</b>，或者<b>选</b>',
        '诗里"挑促织"是用小棍拨弄蟋蟀，所以读 <b>tiǎo</b>。'
      ]
    },
    {
      title: '📚 三首古诗一起复习（课后练习）',
      points: [
        '<b>课后问：这三首诗写的是哪个季节？</b>——都是<span class="key">秋天</span>。',
        '怎么看出来的？<br>' +
        '《望洞庭》：<b>秋</b>月<br>' +
        '《山行》：寒山、<b>霜</b>叶、枫林<br>' +
        '《夜书所见》：<b>秋</b>风、寒声、梧叶',
        '<b>三首诗的心情各不相同：</b><br>' +
        '《望洞庭》——<b>宁静</b>、欣赏美景<br>' +
        '《山行》——<b>热烈</b>、赞美秋天<br>' +
        '《夜书所见》——<b>思乡</b>、有点孤单'
      ]
    }
  ],
  quiz: [
    { id: 'd7c1', type: 'recite', tags: ['古诗背诵·夜书所见'],
      q: '把《夜书所见》补完整',
      text: '{萧萧}梧叶送寒声，江上秋风动{客}情。知有儿童{挑}{促织}，夜{深}篱落一灯明。',
      explain: '「萧萧」是风吹树叶的声音，「客」指离家在外的人，「促织」就是蟋蟀。' },

    { id: 'd7c2', type: 'choice', tags: ['古诗·注释'],
      q: '"促织"指的是什么？',
      options: ['织布机', '蟋蟀（蛐蛐）', '一种鸟', '纺织娘'], answer: 1,
      explain: '课本注释：〔促织〕<b>蟋蟀</b>，也叫蛐蛐。' },

    { id: 'd7c3', type: 'choice', tags: ['古诗·题目'],
      q: '"夜书所见"的"书"是什么意思？',
      options: ['书本', '写', '读书', '书信'], answer: 1,
      explain: '"书"在这里是<b>写</b>。"夜书所见"＝把夜里看见的写下来。' },

    { id: 'd7c4', type: 'choice', tags: ['多音字·挑'],
      q: '"儿童<b>挑</b>促织"的"挑"读什么？',
      options: ['tiāo', 'tiǎo', 'tiào', 'táo'], answer: 1,
      explain: '课本注音是 <b>tiǎo</b>，意思是"用细长的东西拨"。' +
               '挑水、挑担、挑选读 tiāo。' },

    { id: 'd7c5', type: 'choice', tags: ['古诗·情感'],
      q: '"江上秋风动客情"里的"客"指的是谁？',
      options: ['来做客的人', '离家在外的人（诗人自己）', '商人', '小孩'], answer: 1,
      explain: '"客"指漂泊在外、离开家乡的人，这里就是诗人自己。' +
               '所以这句写的是<b>思乡之情</b>。' },

    { id: 'd7c6', type: 'choice', tags: ['古诗·写法'],
      q: '这首诗前两句和后两句给人的感觉有什么不同？',
      options: [
        '前两句冷清（秋风、寒声），后两句温暖（儿童、灯光）',
        '前两句温暖，后两句冷清',
        '都很冷清',
        '都很热闹'
      ], answer: 0,
      explain: '一冷一暖对照着写。看到远处那盏灯和斗蛐蛐的小孩，' +
               '诗人想起了自己的童年和家——这才是最打动人的地方。' },

    { id: 'd7c7', type: 'choice', tags: ['古诗·季节'],
      q: '第 4 课的三首古诗写的都是哪个季节？',
      options: ['春天', '夏天', '秋天', '冬天'], answer: 2,
      explain: '都是<b>秋天</b>：《望洞庭》有"秋月"，《山行》有"霜叶"，' +
               '《夜书所见》有"秋风"。' },

    { id: 'd7c8', type: 'match', tags: ['古诗·作者'],
      q: '把古诗和作者连起来',
      pairs: [ ['望洞庭', '［唐］刘禹锡'], ['山行', '［唐］杜牧'],
               ['夜书所见', '［宋］叶绍翁'], ['所见', '［清］袁枚'] ],
      explain: '前三首是第 4 课的，《所见》是语文园地一的日积月累。' },

    { id: 'd7c9', type: 'pinyin', tags: ['生字·写字表'],
      q: '看拼音写词语',
      items: [ { py: 'yè shēn', word: '夜深' }, { py: 'luò yè', word: '落叶' } ],
      explain: '「深」是三点水，「落」是草字头加"洛"。' },

    { id: 'd7c10', type: 'order', tags: ['古诗背诵·夜书所见'],
      q: '把《夜书所见》四句排好', joiner: '　',
      items: ['萧萧梧叶送寒声', '江上秋风动客情', '知有儿童挑促织', '夜深篱落一灯明'],
      answer: ['萧萧梧叶送寒声', '江上秋风动客情', '知有儿童挑促织', '夜深篱落一灯明'],
      explain: '先写听到的（风声）、感到的（思乡），再写看到的（灯光）、想到的（儿童斗蛐蛐）。' },

    { id: 'd7c11', type: 'multi', tags: ['古诗·综合'],
      q: '下面哪些词能说明《夜书所见》写的是秋天？（多选）',
      options: ['秋风', '寒声', '梧叶', '篱落'], answer: [0, 1, 2],
      explain: '秋风、寒声、梧叶（梧桐落叶）都是秋天的标志。' +
               '"篱落"是篱笆，一年四季都有。' },

    { id: 'd7c12', type: 'fill', tags: ['古诗·默写'],
      q: '默写《山行》的第一、二句',
      blanks: 2, wide: true,
      answer: [['远上寒山石径斜'], ['白云生处有人家']],
      explain: '课本要求默写《山行》，这两句一定要会写。' },

    { id: 'd7c13', type: 'readaloud', tags: ['朗读·古诗'], lang: 'zh',
      q: '读一读《夜书所见》',
      text: '萧萧梧叶送寒声，江上秋风动客情。知有儿童挑促织，夜深篱落一灯明。',
      explain: '前两句读得低一点、慢一点（有点冷清），后两句读得亮一点（看到了灯光）。' },

    { id: 'd7c14', type: 'choice', tags: ['古诗·对比'],
      q: '三首诗的心情，配对正确的是——',
      options: [
        '《望洞庭》宁静　《山行》热烈　《夜书所见》思乡',
        '《望洞庭》思乡　《山行》宁静　《夜书所见》热烈',
        '三首都是思乡',
        '三首都很开心'
      ], answer: 0,
      explain: '同样写秋天，心情完全不同：看湖是宁静的，看枫林是热烈的，' +
               '一个人在外地的秋夜是思乡的。' }
  ]
},

math: {
  goal: '把混合运算三条规则串起来，做整理与复习',
  teach: [
    {
      title: '🗂️ 本单元知识结构图（照着课本整理）',
      figure:
        '<div style="display:inline-block;text-align:left;font-size:16px;line-height:2.1;' +
        'border:2.5px solid var(--ink);border-radius:14px;padding:18px 24px;background:var(--azurite-wash);' +
        'box-shadow:3px 3px 0 var(--ink)">' +
        '<b style="font-family:var(--font-brush);font-size:20px">混合运算</b><br>' +
        '├─ <b>运算顺序</b><br>' +
        '│　├─ 没有括号<br>' +
        '│　│　├─ 只有加减 / 只有乘除 → <b>从左往右</b><br>' +
        '│　│　└─ 既有乘除又有加减 → <b>先乘除，后加减</b><br>' +
        '│　└─ 有括号 → <b>先算括号里的</b><br>' +
        '└─ <b>解决多步计算的实际问题</b><br>' +
        '　　├─ 分成几个小问题来解决<br>' +
        '　　└─ 列综合算式（该加括号就加）' +
        '</div>'
    },
    {
      title: '⭐ 三条规则一起记',
      points: [
        '<span class="key">先看括号，再看乘除，最后加减；同级从左往右。</span>',
        '这句话背下来，混合运算就不会错了。'
      ],
      calc: [
        { expr: '42 − 38 + 27 = 4 + 27 = <span class="mark">31</span>', note: '同级，从左往右' },
        { expr: '24 ÷ 6 × 5 = 4 × 5 = <span class="mark">20</span>', note: '同级，从左往右' },
        { expr: '35 − 14 ÷ 7 = 35 − 2 = <span class="mark">33</span>', note: '先除后减' },
        { expr: '8 × 9 + 41 = 72 + 41 = <span class="mark">113</span>', note: '先乘后加' },
        { expr: '25 ÷ (32 − 27) = 25 ÷ 5 = <span class="mark">5</span>', note: '先算括号' },
        { expr: '(3 + 5) × 8 = 8 × 8 = <span class="mark">64</span>', note: '先算括号' }
      ]
    },
    {
      title: '🚨 本单元最容易错的三处',
      points: [
        '① <b>看到乘法就先算</b>——错！<b>15 ÷ 5 × 7</b> 里只有乘除，要从左往右，先算 15÷5。',
        '② <b>觉得左边的先算</b>——错！<b>20 − 3 × 4</b> 里有乘法，要先算 3×4。',
        '③ <b>脱式抄漏了</b>——每一步只算一个，<b>没算的部分要原样抄下来</b>。'
      ]
    },
    {
      title: '💭 遇到应用题怎么想',
      points: [
        '把大问题<span class="key">拆成几个小问题</span>，一步解决一个。',
        '碰到"比……多/少"、"是……的几倍"，先<b>画线段图</b>。',
        '列综合算式时问自己：<b>我想先算哪一步？</b>' +
        '如果想先算加减，就必须给它加括号。'
      ]
    }
  ],
  quiz: [
    { id: 'd7m1', type: 'fill', tags: ['混合运算·同级运算'],
      q: '算一算：42 − 38 + 27 = ______', blanks: 1,
      answer: [['31']], explain: '同级从左往右：42−38=4，4+27=<b>31</b>。' },

    { id: 'd7m2', type: 'fill', tags: ['混合运算·同级运算'],
      q: '算一算：24 ÷ 6 × 5 = ______', blanks: 1,
      answer: [['20']], explain: '同级从左往右：24÷6=4，4×5=<b>20</b>。别先算 6×5！' },

    { id: 'd7m3', type: 'fill', tags: ['混合运算·先乘除后加减'],
      q: '算一算：35 − 14 ÷ 7 = ______', blanks: 1,
      answer: [['33']], explain: '先除后减：14÷7=2，35−2=<b>33</b>。' },

    { id: 'd7m4', type: 'fill', tags: ['混合运算·先乘除后加减'],
      q: '算一算：8 × 9 + 41 = ______', blanks: 1,
      answer: [['113']], explain: '先乘后加：8×9=72，72+41=<b>113</b>。' },

    { id: 'd7m5', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：25 ÷ (32 − 27) = ______', blanks: 1,
      answer: [['5']], explain: '先算括号：32−27=5，25÷5=<b>5</b>。' },

    { id: 'd7m6', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：(3 + 5) × 8 = ______', blanks: 1,
      answer: [['64']], explain: '先算括号：3+5=8，8×8=<b>64</b>。' },

    { id: 'd7m7', type: 'choice', tags: ['混合运算·运算顺序'],
      q: '完整的运算顺序口诀是——',
      options: [
        '先看括号，再看乘除，最后加减；同级从左往右',
        '从左往右一路算下去',
        '先加减，后乘除',
        '先算数字大的'
      ], answer: 0,
      explain: '这句口诀把本单元三条规则全包了，一定要背下来。' },

    { id: 'd7m8', type: 'multi', tags: ['混合运算·第一步'],
      q: '下面哪些算式<b>第一步算乘法或除法</b>？（多选）',
      options: ['20 − 3 × 4', '36 ÷ 4 ÷ 3', '(15 + 5) × 2', '7 + 8 × 2'],
      answer: [0, 1, 3],
      explain: 'A 先算 3×4；B 只有除法，从左往右先算 36÷4（也是除法）；' +
               'D 先算 8×2。C 有括号，第一步要算括号里的加法。' },

    { id: 'd7m9', type: 'order', tags: ['混合运算·脱式格式'],
      q: '把 60 − (18 + 22) 的脱式排好', joiner: '　',
      items: ['60 − (18 + 22)', '= 60 − 40', '= 20'],
      answer: ['60 − (18 + 22)', '= 60 − 40', '= 20'],
      explain: '先算括号里的 18+22=40，括号算完就去掉，再算 60−40=20。' },

    { id: 'd7m10', type: 'choice', tags: ['混合运算·比大小'],
      q: '比较：<b>72 ÷ 8 + 4</b>　○　<b>72 ÷ (8 + 4)</b>',
      options: ['>', '<', '=', '不能比'], answer: 0,
      explain: '左边：72÷8=9，9+4=13。右边：8+4=12，72÷12=6。13 > 6，填 <b>&gt;</b>。' },

    { id: 'd7m11', type: 'fill', tags: ['两步应用题·综合'],
      q: '书架上有 3 层，每层放 24 本书。借走 15 本后还剩多少本？（写得数）',
      blanks: 1,
      answer: [['57']],
      explain: '3×24=72（本），72−15=<b>57</b>（本）。综合算式：3×24−15=57。' },

    { id: 'd7m12', type: 'fill', tags: ['两步应用题·综合'],
      q: '小明有 36 张卡片，小红有 28 张。两人合起来平均分给 8 个人，每人几张？（写得数）',
      blanks: 1,
      answer: [['8']],
      explain: '(36+28)÷8 = 64÷8 = <b>8</b> 张。要先合起来，所以加括号。' },

    { id: 'd7m13', type: 'choice', tags: ['混合运算·纠错'],
      q: '小亮这样算：<b>48 ÷ 8 × 2 = 48 ÷ 16 = 3</b>。他错在哪？',
      options: [
        '48 ÷ 8 算错了',
        '只有乘除时要从左往右，应该先算 48÷8',
        '应该先算 48×2',
        '他没错'
      ], answer: 1,
      explain: '正确算法：48÷8=6，6×2=<b>12</b>。' +
               '只有乘除的时候，谁在左边先算谁——这是本单元最容易错的地方。' },

    { id: 'd7m14', type: 'choice', tags: ['两步应用题·加括号'],
      q: '"先求和，再平均分"这类问题，综合算式应该写成什么样？',
      options: ['a + b ÷ c', '(a + b) ÷ c', 'a ÷ c + b', 'a × b ÷ c'], answer: 1,
      explain: '想先算加法，就必须给加法加<b>括号</b>：(a + b) ÷ c。' },

    { id: 'd7m15', type: 'fill', tags: ['混合运算·综合'],
      q: '算一算：(56 − 20) ÷ 6 + 4 = ______', blanks: 1, hint: '三步！',
      answer: [['10']],
      explain: '先括号：56−20=36；再除：36÷6=6；最后加：6+4=<b>10</b>。' }
  ]
},

english: {
  goal: 'Unit 2 —— 会用 Is this/that your…? 问，把第一周英语串起来复习',
  teach: [
    {
      title: '❓ Part B  Is this your…?',
      body: [
        '想确认某个人是谁，就问：<span class="key">Is this your sister?</span>' +
        '（这是你姐姐吗？）'
      ],
      points: [
        '肯定回答：<b>Yes, it is.</b>　是的。',
        '否定回答：<b>No, it\'s my cousin.</b>　不，这是我的堂/表兄弟姐妹。',
        '<b>this</b> 指<span class="key">离得近</span>的（这个），' +
        '<b>that</b> 指<span class="key">离得远</span>的（那个）。<br>' +
        '<b>Is this</b> your brother?（近）　<b>Is that</b> your brother?（远）'
      ]
    },
    {
      title: '🔤 更多家庭成员',
      words: [
        { en: 'brother', ipa: '/ˈbrʌðə(r)/', cn: '哥哥；弟弟' },
        { en: 'uncle', ipa: '/ˈʌŋkl/', cn: '伯父；叔父；舅父；姑父；姨父' },
        { en: 'aunt', ipa: '/ɑːnt/', cn: '伯母；婶母；舅母；姑母；姨母' },
        { en: 'cousin', ipa: '/ˈkʌzn/', cn: '堂（表）兄弟姐妹' },
        { en: 'baby sister', ipa: '/ˈbeɪbi/', cn: '小妹妹' },
        { en: 'big', ipa: '/bɪɡ/', cn: '大的' },
        { en: 'small', ipa: '/smɔːl/', cn: '小的' },
        { en: 'have', ipa: '/hæv/', cn: '有' }
      ]
    },
    {
      title: '🎵 Listen and chant',
      lang: 'en',
      passage:
        'I have an uncle. I have an aunt. ' +
        'I have two cousins too. ' +
        'I have a brother, and a baby sister. ' +
        'They can play with me.'
    },
    {
      title: '🌏 英语的亲戚称呼比中文简单多了',
      points: [
        '中文里伯父、叔叔、舅舅、姑父、姨父分得清清楚楚，' +
        '英语<b>全叫 uncle</b>。',
        '伯母、婶婶、舅妈、姑妈、姨妈，英语<b>全叫 aunt</b>。',
        '堂哥、堂妹、表姐、表弟……英语<b>全叫 cousin</b>。',
        '所以背英语的时候反而轻松：<span class="key">uncle、aunt、cousin 三个词，' +
        '就把中文十几个称呼全包了。</span>'
      ]
    },
    {
      title: '🔁 第一周英语总复习',
      points: [
        '<b>问候</b>：Hello! / Hi! / How are you? / How do you do?',
        "<b>问名字</b>：What's your name? — My name is … / I'm …",
        '<b>见面</b>：Nice to meet you. — Nice to meet you <b>too</b>.',
        '<b>身体</b>：eye　ear　mouth　hand　arm',
        '<b>好朋友</b>：listen　smile　help　share',
        '<b>家人</b>：father(dad)　mother(mum)　grandfather(grandpa)　grandmother(grandma)　' +
        'sister　brother　uncle　aunt　cousin',
        '<b>介绍</b>：This is my …　<b>询问</b>：Is this/that your …? — Yes, it is. / No, it\'s my …',
        '<b>字母</b>：Aa /æ/　Bb /b/　Cc /k/　Dd /d/'
      ]
    }
  ],
  quiz: [
    { id: 'd7e1', type: 'listen', tags: ['听力·家庭成员'], lang: 'en',
      q: '听一听，这个词是什么意思？', audio: 'cousin',
      options: ['堂（表）兄弟姐妹', '叔叔', '姑姑', '弟弟'], answer: 0,
      explain: 'cousin /ˈkʌzn/ 堂或表的兄弟姐妹都叫 cousin。' },

    { id: 'd7e2', type: 'listen', tags: ['听力·句子'], lang: 'en',
      q: '听句子，对方在问什么？', audio: 'Is this your brother?',
      options: ['这是你哥哥/弟弟吗？', '你有哥哥吗？', '你哥哥叫什么？', '这是谁的书？'], answer: 0,
      explain: 'Is this your brother? = 这是你的哥哥/弟弟吗？' },

    { id: 'd7e3', type: 'choice', tags: ['句型·一般疑问句'],
      q: '别人问 "Is this your sister?"，如果<b>是</b>，怎么回答？',
      options: ['Yes, it is.', 'Yes, I am.', 'No, it is.', 'Yes, she does.'], answer: 0,
      explain: '用 Is this…? 问，就用 <b>Yes, it is.</b> 回答。' },

    { id: 'd7e4', type: 'choice', tags: ['语法·this 和 that'],
      q: 'this 和 that 有什么区别？',
      options: [
        'this 指近的，that 指远的',
        'this 指远的，that 指近的',
        '一样，随便用',
        'this 指人，that 指物'
      ], answer: 0,
      explain: '<b>this</b>（这个）指离得近的，<b>that</b>（那个）指离得远的。' },

    { id: 'd7e5', type: 'match', tags: ['词汇·亲戚称呼'],
      q: '把英语和中文连起来',
      pairs: [ ['uncle', '叔叔/舅舅/姑父'], ['aunt', '阿姨/舅妈/姑妈'],
               ['cousin', '堂表兄弟姐妹'], ['brother', '哥哥/弟弟'] ],
      explain: '英语的亲戚称呼比中文简单：uncle、aunt、cousin 三个词包办了中文十几种叫法。' },

    { id: 'd7e6', type: 'order', tags: ['连词成句'],
      q: '排成一句话：那是你弟弟吗？', joiner: ' ',
      items: ['Is', 'that', 'your', 'brother'],
      answer: ['Is', 'that', 'your', 'brother'],
      explain: 'Is that your brother? 疑问句 Is 要放在最前面，句末加问号。' },

    { id: 'd7e7', type: 'listen', tags: ['听力·歌谣'], lang: 'en',
      q: '听一听，说话人有几个 cousin？', audio: 'I have two cousins.',
      options: ['一个', '两个', '三个', '没有'], answer: 1,
      explain: 'two cousins = 两个。注意 cousin 后面加了 <b>s</b>，表示不止一个。' },

    { id: 'd7e8', type: 'choice', tags: ['语法·名词复数'],
      q: '"我有两个表兄弟。" 应该怎么说？',
      options: ['I have two cousin.', 'I have two cousins.', 'I has two cousins.', 'I have two cousines.'],
      answer: 1,
      explain: '两个以上要在名词后加 <b>s</b>：two cousin<b>s</b>。而且 I 后面用 have，不用 has。' },

    { id: 'd7e9', type: 'choice', tags: ['复习·问候'],
      q: '（复习）"Nice to meet you." 的正确回答是——',
      options: ['Nice to meet you too.', 'Yes, it is.', 'Thank you.', 'This is my mum.'], answer: 0,
      explain: '加 <b>too</b>，表示"我也很高兴见到你"。' },

    { id: 'd7e10', type: 'choice', tags: ['复习·身体部位'],
      q: '（复习）"Point to your eye." 让你做什么？',
      options: ['指一指眼睛', '指一指耳朵', '挥挥手', '张开嘴'], answer: 0,
      explain: 'eye 是眼睛。ear 才是耳朵。' },

    { id: 'd7e11', type: 'choice', tags: ['复习·好朋友'],
      q: '（复习）好朋友之间会 "share"，这是什么意思？',
      options: ['吵架', '分享；一起用', '比赛', '睡觉'], answer: 1,
      explain: 'share = 分享。We can share. = 我们可以一起用。' },

    { id: 'd7e12', type: 'fill', tags: ['句型·介绍家人'],
      q: '补全：______ ______ my grandma.（这是我奶奶。）',
      blanks: 2, hint: '两个词',
      answer: [['This'], ['is']],
      explain: '<b>This is</b> my grandma. 介绍一个人固定用 This is。' },

    { id: 'd7e13', type: 'readaloud', tags: ['朗读·歌谣'], lang: 'en',
      q: '读一读 Part B 的 chant',
      text: 'I have an uncle. I have an aunt. I have two cousins too. I have a brother, and a baby sister. They can play with me.',
      explain: 'aunt / uncle / cousin 三个词多读几遍，这一周英语就算过关了。' },

    { id: 'd7e14', type: 'choice', tags: ['文化·中英对比'],
      q: '中文里"舅舅、叔叔、姑父、姨父"，英语都叫什么？',
      options: ['aunt', 'uncle', 'cousin', 'brother'], answer: 1,
      explain: '英语里男性长辈（父母的兄弟、姐妹的丈夫）统统叫 <b>uncle</b>，' +
               '女性长辈统统叫 <b>aunt</b>。比中文简单多了。' }
  ]
},

/* ══════════════════ 🏰 第一周大 Boss ══════════════════ */
boss: {
  name: '开蒙关守将 · 大青树妖',
  face: '🌳',
  quiz: [
    { subject: 'chinese', id: 'b1q1', type: 'choice', tags: ['Boss·语文'],
      q: '"凤尾竹的影子，在洁白的墙上摇<b>晃</b>"，"晃"读什么？',
      options: ['huǎng', 'huàng', 'guāng', 'huáng'], answer: 1,
      explain: '摇晃读 huàng（第四声）。' },

    { subject: 'math', id: 'b1q2', type: 'fill', tags: ['Boss·数学'],
      q: '算一算：15 ÷ 5 × 7 = ______', blanks: 1,
      answer: [['21']], explain: '同级从左往右：15÷5=3，3×7=21。' },

    { subject: 'english', id: 'b1q3', type: 'listen', tags: ['Boss·英语'], lang: 'en',
      q: '听句子，是什么意思？', audio: 'Nice to meet you too.',
      options: ['见到你我也很高兴。', '你叫什么名字？', '这是我妈妈。', '我们可以一起用。'], answer: 0,
      explain: '句末的 too 是"也"。' },

    { subject: 'chinese', id: 'b1q4', type: 'recite', tags: ['Boss·古诗'],
      q: '背一背《山行》的后两句',
      text: '停车{坐}爱枫林晚，霜叶{红于}二月花。',
      explain: '「坐」是因为，「红于」是比……更红。' },

    { subject: 'math', id: 'b1q5', type: 'fill', tags: ['Boss·数学'],
      q: '算一算：(25 + 15) ÷ 8 = ______', blanks: 1,
      answer: [['5']], explain: '先算括号：25+15=40，40÷8=5。' },

    { subject: 'english', id: 'b1q6', type: 'choice', tags: ['Boss·英语'],
      q: '"这是我爷爷。" 用英语怎么说？',
      options: ['This is my grandpa.', 'This my grandpa.', 'He is grandpa.', 'This is grandpa my.'],
      answer: 0, explain: 'This is my grandpa.' },

    { subject: 'chinese', id: 'b1q7', type: 'choice', tags: ['Boss·语文'],
      q: '"停车<b>坐</b>爱枫林晚"的"坐"是什么意思？',
      options: ['坐下', '因为', '座位', '停下'], answer: 1,
      explain: '课本注释：〔坐〕因为。' },

    { subject: 'math', id: 'b1q8', type: 'choice', tags: ['Boss·数学'],
      q: '把一个没有开口的长方体纸盒剪开铺平，要剪几条边？',
      options: ['5 条', '6 条', '7 条', '12 条'], answer: 2,
      explain: '12 条边 − 5 处不剪 = 7 条。' },

    { subject: 'english', id: 'b1q9', type: 'match', tags: ['Boss·英语'],
      q: '把单词和中文连起来',
      pairs: [ ['share', '分享'], ['listen', '听'], ['mouth', '嘴'], ['sister', '姐妹'] ],
      explain: '第一周的核心词。' },

    { subject: 'chinese', id: 'b1q10', type: 'fill', tags: ['Boss·语文'],
      q: '填空：学问学问，____就要____。', blanks: 2,
      answer: [['不懂'], ['问']], explain: '孙中山说的话，要记住。' },

    { subject: 'math', id: 'b1q11', type: 'fill', tags: ['Boss·数学'],
      q: '小明做了 12 朵花，小红比小明少 4 朵，小军是小红的 3 倍。小军做了几朵？（写得数）',
      blanks: 1, answer: [['24']],
      explain: '(12−4)×3 = 8×3 = 24 朵。' },

    { subject: 'english', id: 'b1q12', type: 'order', tags: ['Boss·英语'],
      q: '排成一句话：你叫什么名字？', joiner: ' ',
      items: ["What's", 'your', 'name'], answer: ["What's", 'your', 'name'],
      explain: "What's your name?" },

    { subject: 'chinese', id: 'b1q13', type: 'choice', tags: ['Boss·语文'],
      q: '下面哪个成语<b>不含</b>两个身体部位？',
      options: ['摇头晃脑', '手忙脚乱', '五颜六色', '面红耳赤'], answer: 2,
      explain: '五颜六色里是数字和颜色，没有身体部位。' },

    { subject: 'math', id: 'b1q14', type: 'fill', tags: ['Boss·数学'],
      q: '算一算：8 × 9 + 41 = ______', blanks: 1,
      answer: [['113']], explain: '先乘后加：72+41=113。' },

    { subject: 'chinese', id: 'b1q15', type: 'choice', tags: ['Boss·语文'],
      q: '第 4 课三首古诗写的是哪个季节？',
      options: ['春天', '夏天', '秋天', '冬天'], answer: 2,
      explain: '都是秋天：秋月、霜叶、秋风。' },

    { subject: 'english', id: 'b1q16', type: 'choice', tags: ['Boss·英语'],
      q: '字母 <b>c</b> 发的音出现在哪个词的开头？',
      options: ['dog', 'bed', 'cat', 'apple'], answer: 2,
      explain: 'cat /kæt/ 开头是 /k/。' },

    { subject: 'math', id: 'b1q17', type: 'choice', tags: ['Boss·数学'],
      q: '正方体骰子朝上是 3，朝下是几？',
      options: ['3', '4', '5', '6'], answer: 1,
      explain: '相对两面和是 7，7−3=4。' },

    { subject: 'chinese', id: 'b1q18', type: 'pinyin', tags: ['Boss·语文'],
      q: '看拼音写词语',
      items: [ { py: 'piāo yáng', word: '飘扬' }, { py: 'shī rùn', word: '湿润' } ],
      explain: '「飘」是风字旁，「湿润」都是三点水。' },

    { subject: 'english', id: 'b1q19', type: 'choice', tags: ['Boss·英语'],
      q: '中文的"舅舅、叔叔、姑父"，英语都叫——',
      options: ['aunt', 'uncle', 'cousin', 'father'], answer: 1,
      explain: '男性长辈统统叫 uncle。' },

    { subject: 'math', id: 'b1q20', type: 'fill', tags: ['Boss·数学'],
      q: '最后一题！算一算：(56 − 20) ÷ 6 + 4 = ______', blanks: 1,
      answer: [['10']],
      explain: '先括号 36，再除得 6，最后加 4 = 10。打败大青树妖！' }
  ]
}
};
