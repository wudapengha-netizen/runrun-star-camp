/* ============================================================
   第 4 关 · 8月4日
   语文 习作·猜猜他是谁 + 语文园地一 ｜ 数学 混合运算② 先乘除后加减
   英语 U1 Part B 好朋友
   ============================================================ */
window.DAYS[4] = {

chinese: {
  goal: '会写"猜猜他是谁"，掌握语文园地一的成语、朗读方法和日积月累《所见》',
  teach: [
    {
      title: '✏️ 习作：猜猜他是谁',
      body: [
        '游戏规则：选一个同学，用几句话写一写他，' +
        '<span class="key">文中不能出现他的名字</span>，但要让别人读完能猜出是谁。'
      ],
      points: [
        '<b>写什么？</b>挑一两点最特别的写：长相、爱好、性格、常做的事。',
        '<b>格式</b>：一段话的开头要<span class="key">空两格</span>。',
        '<b>课本给的四个例子</b>：<br>' +
        '　「他的头发又黑又硬，一根根向上竖着……」（长相）<br>' +
        '　「他特别爱笑，一个小笑话就能让他笑个不停……」（性格）<br>' +
        '　「他关心班里的每个人，不管是谁遇到困难，他都会主动帮忙。有一次……」（品质＋举例）<br>' +
        '　「他酷爱踢足球，也喜欢跑步，经常能在操场上看到他奔跑的身影……」（爱好）'
      ]
    },
    {
      title: '💡 写得像不像，关键在这里',
      points: [
        '别写<b>人人都有</b>的：「他有两只眼睛，一个鼻子」——这样谁都猜不出来。',
        '要写<b>只有他才有</b>的：「他笑起来右边有个小酒窝」「他每天第一个到教室」。',
        '写性格、品质的时候，最好<span class="hl">举一件具体的事</span>，' +
        '像课本第三个例子那样加上"有一次……"。'
      ]
    },
    {
      title: '🎨 语文园地一 · 词句段运用（成语的秘密）',
      body: [
        '看看这八个成语，你发现它们有什么共同点？'
      ],
      phrases: ['摇头晃脑', '披头散发', '张牙舞爪', '提心吊胆', '面红耳赤', '手忙脚乱', '手疾眼快', '口干舌燥'],
      points: [
        '发现了吗？每个成语里都藏着<span class="key">两个身体部位</span>！',
        '摇<b>头</b>晃<b>脑</b>、披<b>头</b>散<b>发</b>、张<b>牙</b>舞<b>爪</b>、提<b>心</b>吊<b>胆</b>、' +
        '面<b>红</b><b>耳</b>赤、<b>手</b>忙<b>脚</b>乱、<b>手</b>疾<b>眼</b>快、<b>口</b>干<b>舌</b>燥。'
      ]
    },
    {
      title: '🗣️ 语文园地一 · 怎样朗读更好',
      points: [
        '「妈妈，我真的觉得那些花朵是在地下的学校里上学。」' +
        '——"<b>真的</b>"要读重一点，才有那种认真、肯定的语气。',
        '「书里说的是什么意思，他<b>一点儿也不懂</b>。」' +
        '——"一点儿也不懂"要读得慢一点，读出那种困惑。',
        '「学问学问，<b>不懂就要问</b>。」' +
        '——要读得干脆、坚定，像下定了决心。'
      ]
    },
    {
      title: '🎋 日积月累（要背下来）',
      lang: 'zh',
      speak: '所见，清，袁枚。牧童骑黄牛，歌声振林樾。意欲捕鸣蝉，忽然闭口立。',
      body: [
        '<div style="text-align:center;font-family:var(--font-brush);font-size:24px;line-height:2">' +
        '<b>所　见</b><br>' +
        '<span style="font-size:15px;color:var(--ink-soft)">［清］袁　枚</span><br>' +
        '牧童骑黄牛，<br>歌声振林樾。<br>意欲捕鸣蝉，<br>忽然闭口立。</div>'
      ],
      points: [
        '<b>樾</b>（yuè）：树荫。<b>振林樾</b>＝歌声在树林里回荡。',
        '<b>意欲</b>：心里想要。<b>鸣蝉</b>：正在叫的知了。',
        '意思：一个放牛的小孩骑在黄牛背上，唱歌的声音在树林里回荡。' +
        '忽然他想去捉那只正在叫的知了，就<b>立刻闭上嘴，一动不动地站住了</b>。',
        '最妙的是最后一句——从"大声唱歌"到"忽然闭口立"，' +
        '这个突然的安静，把小孩子的机灵写活了。'
      ]
    }
  ],
  quiz: [
    { id: 'd4c1', type: 'choice', tags: ['语文园地·成语规律'],
      q: '"摇头晃脑、披头散发、张牙舞爪、面红耳赤"这些成语有什么共同点？',
      options: [
        '都是形容心情的',
        '每个成语里都有两个身体部位',
        '都是四个字',
        '都带有数字'
      ], answer: 1,
      explain: '头—脑、头—发、牙—爪、面—耳，每个都藏着两个身体部位。' +
               '（"都是四个字"虽然没错，但所有成语都是四个字，不算这组的特点。）' },

    { id: 'd4c2', type: 'multi', tags: ['语文园地·成语规律'],
      q: '下面哪些成语也含有<b>两个身体部位</b>？（多选）',
      options: ['手忙脚乱', '口干舌燥', '五颜六色', '提心吊胆'], answer: [0, 1, 3],
      explain: '手—脚、口—舌、心—胆都是身体部位。"五颜六色"里是数字和颜色，不是身体部位。' },

    { id: 'd4c3', type: 'recite', tags: ['日积月累·所见'],
      q: '把《所见》补完整',
      text: '牧童骑黄牛，歌声{振}林{樾}。意欲{捕}鸣蝉，忽然{闭}口立。',
      explain: '「振」是回荡，「樾」是树荫，「捕」是捉，「闭」是闭上。' },

    { id: 'd4c4', type: 'choice', tags: ['日积月累·所见'],
      q: '《所见》的作者是谁？',
      options: ['［唐］杜牧', '［清］袁枚', '［宋］叶绍翁', '［唐］刘禹锡'], answer: 1,
      explain: '《所见》是清代<b>袁枚</b>写的。（杜牧写《山行》，刘禹锡写《望洞庭》，' +
               '叶绍翁写《夜书所见》——这三首后面几天要学。）' },

    { id: 'd4c5', type: 'choice', tags: ['日积月累·所见'],
      q: '"忽然闭口立"，牧童为什么突然不唱了？',
      options: [
        '嗓子哑了',
        '他想去捉树上正在叫的知了，怕出声把知了吓跑',
        '看见大人来了',
        '牛不走了'
      ], answer: 1,
      explain: '前一句"意欲捕鸣蝉"——他想捉知了，所以立刻闭嘴站住，怕出声惊跑了蝉。' },

    { id: 'd4c6', type: 'choice', tags: ['习作·猜猜他是谁'],
      q: '写"猜猜他是谁"，下面哪一句<b>最没用</b>？',
      options: [
        '他笑起来右边脸上有个小酒窝。',
        '他有两只眼睛和一个鼻子。',
        '他每天都是第一个到教室开窗。',
        '他一说话就爱把手插在口袋里。'
      ], answer: 1,
      explain: '每个人都有两只眼睛一个鼻子，这样写谁也猜不出来。' +
               '要写<b>只有他才有</b>的特点。' },

    { id: 'd4c7', type: 'choice', tags: ['习作·格式'],
      q: '写一段话的时候，开头要怎么办？',
      options: ['顶格写', '空两格', '空四格', '随便'], answer: 1,
      explain: '中文写段落，开头要<b>空两格</b>。这是课本里明确提醒的。' },

    { id: 'd4c8', type: 'fill', tags: ['成语积累'],
      q: '补全成语：手（　）眼快　　面红耳（　）　　张牙（　）爪',
      blanks: 3, hint: '都是园地一里的成语',
      answer: [['疾'], ['赤'], ['舞']],
      explain: '手<b>疾</b>眼快（动作快）、面红耳<b>赤</b>（脸红了）、张牙<b>舞</b>爪（凶狠的样子）。' },

    { id: 'd4c9', type: 'choice', tags: ['成语理解'],
      q: '"手忙脚乱"是什么意思？',
      options: [
        '做事很有条理',
        '事情太多太急，忙得没有章法',
        '手和脚受伤了',
        '在跳舞'
      ], answer: 1,
      explain: '形容做事慌张、没有条理。比如："闹钟没响，我起床后手忙脚乱地穿衣服。"' },

    { id: 'd4c10', type: 'order', tags: ['日积月累·所见'],
      q: '把《所见》的四句排好', joiner: '　',
      items: ['牧童骑黄牛', '歌声振林樾', '意欲捕鸣蝉', '忽然闭口立'],
      answer: ['牧童骑黄牛', '歌声振林樾', '意欲捕鸣蝉', '忽然闭口立'],
      explain: '先写看到牧童骑牛唱歌，再写他忽然安静下来要捉蝉。' },

    { id: 'd4c11', type: 'readaloud', tags: ['朗读·语气'], lang: 'zh',
      q: '读出坚定的语气',
      text: '学问学问，不懂就要问。',
      explain: '"不懂就要问"五个字要一字一顿，读出下定决心的感觉。' },

    { id: 'd4c12', type: 'choice', tags: ['习作·猜猜他是谁'],
      q: '写同学的性格或品质时，怎样写才让人信服？',
      options: [
        '只写"他很热心"',
        '写"他很热心"，再举一件具体的事',
        '写他考试考了多少分',
        '写他家住在哪里'
      ], answer: 1,
      explain: '课本例子就是这么做的："他关心班里的每个人……<b>有一次</b>……"' +
               '——先说品质，再举一件事，别人才信。' },

    { id: 'd4c13', type: 'choice', tags: ['日积月累·所见'],
      q: '"歌声振林樾"的"樾"（yuè）是什么意思？',
      options: ['月亮', '树荫', '山谷', '院子'], answer: 1,
      explain: '"樾"是树荫。"振林樾"就是歌声在树林里回荡。' }
  ]
},

math: {
  goal: '会算既有乘除又有加减的算式：先算乘除，再算加减',
  teach: [
    {
      title: '🥛 从一道酸奶的题说起',
      body: [
        '<span class="hl">一箱里有 6 排，每排 3 盒，旁边还散着 4 盒。一共有多少盒酸奶？</span>'
      ],
      calc: [
        { expr: '6 × 3 = 18（盒）', note: '先算一箱里有多少盒' },
        { expr: '18 + 4 = 22（盒）', note: '再加上散着的 4 盒' }
      ]
    },
    {
      title: '✏️ 合并成综合算式',
      calc: [
        { expr: '&nbsp;&nbsp;6 × 3 + 4' },
        { expr: '= 18 + 4', note: '先算乘法' },
        { expr: '= 22（盒）' }
      ],
      points: [
        '换个写法也一样：<b>4 + 6 × 3</b>，还是<span class="key">先算 6×3</span>，再加 4。',
        '⚠️ 千万别因为 4 在前面就先算 4+6！'
      ]
    },
    {
      title: '⭐ 今天最重要的一条规则',
      body: [
        '<span class="key">既有乘、除法，又有加、减法的算式，要先算乘、除法，再算加、减法。</span>'
      ],
      points: [
        '记成一句口诀：<span class="hl">先乘除，后加减。</span>',
        '<b>不管乘除法在算式的哪个位置</b>，都要先算它。'
      ]
    },
    {
      title: '📝 一起算三道（先画线标出第一步）',
      calc: [
        { expr: '32 − <u>18 ÷ 2</u> = 32 − 9 = <span class="mark">23</span>', note: '先算除法' },
        { expr: '<u>81 ÷ 9</u> + 54 = 9 + 54 = <span class="mark">63</span>', note: '先算除法' },
        { expr: '<u>4 × 9</u> − <u>5 × 3</u> = 36 − 15 = <span class="mark">21</span>', note: '两个乘法都要先算' }
      ]
    },
    {
      title: '🔍 考试常考的小技巧',
      points: [
        '拿到题<b>先画线</b>：把要先算的那部分用横线划出来，就不会算错顺序了。',
        '像 <b>4 × 9 − 5 × 3</b> 这种两边都是乘法的，' +
        '<b>两个乘法可以同时算完</b>，再做减法。',
        '写脱式的时候，没算的部分要<b>原样抄下来</b>，别抄漏了。'
      ]
    }
  ],
  quiz: [
    { id: 'd4m1', type: 'choice', tags: ['混合运算·先乘除后加减'],
      q: '既有乘除法、又有加减法的算式，应该先算什么？',
      options: ['先算加减法', '先算乘除法', '从左往右算', '从右往左算'], answer: 1,
      explain: '口诀：<b>先乘除，后加减。</b>不管乘除在哪个位置。' },

    { id: 'd4m2', type: 'fill', tags: ['混合运算·先乘除后加减'],
      q: '算一算：6 × 3 + 4 = ______',
      blanks: 1,
      answer: [['22']],
      explain: '6×3=18，18+4=<b>22</b>。' },

    { id: 'd4m3', type: 'fill', tags: ['混合运算·先乘除后加减'],
      q: '算一算：4 + 6 × 3 = ______',
      blanks: 1, hint: '乘法在后面，还是先算它',
      answer: [['22']],
      explain: '先算 6×3=18，再算 4+18=<b>22</b>。和上一题得数一样！' +
               '这说明乘法在前在后都要先算。' },

    { id: 'd4m4', type: 'fill', tags: ['混合运算·先乘除后加减'],
      q: '算一算：32 − 18 ÷ 2 = ______',
      blanks: 1,
      answer: [['23']],
      explain: '先算 18÷2=9，再算 32−9=<b>23</b>。' },

    { id: 'd4m5', type: 'fill', tags: ['混合运算·先乘除后加减'],
      q: '算一算：81 ÷ 9 + 54 = ______',
      blanks: 1,
      answer: [['63']],
      explain: '先算 81÷9=9，再算 9+54=<b>63</b>。' },

    { id: 'd4m6', type: 'fill', tags: ['混合运算·两个乘法'],
      q: '算一算：4 × 9 − 5 × 3 = ______',
      blanks: 1, hint: '两个乘法都先算',
      answer: [['21']],
      explain: '4×9=36，5×3=15，36−15=<b>21</b>。' },

    { id: 'd4m7', type: 'choice', tags: ['混合运算·易错点'],
      q: '算 4 + 6 × 3 时，小红先算了 4 + 6 = 10，再算 10 × 3 = 30。她错在哪？',
      options: [
        '算错了加法',
        '有乘法就要先算乘法，应该先算 6×3',
        '应该先算 4×3',
        '她没错'
      ], answer: 1,
      explain: '这是最常见的错误。正确答案是 22，不是 30。<b>先乘除，后加减！</b>' },

    { id: 'd4m8', type: 'choice', tags: ['混合运算·第一步'],
      q: '算式 <b>56 − 7 × 6</b> 的<b>第一步</b>算什么？',
      options: ['56 − 7', '7 × 6', '56 × 6', '56 − 6'], answer: 1,
      explain: '先算乘法 7×6=42，再算 56−42=14。' },

    { id: 'd4m9', type: 'order', tags: ['混合运算·脱式格式'],
      q: '把 25 + 8 × 4 的脱式排好', joiner: '　',
      items: ['25 + 8 × 4', '= 25 + 32', '= 57'],
      answer: ['25 + 8 × 4', '= 25 + 32', '= 57'],
      explain: '先把 8×4 算成 32，前面的 25+ 原样抄下来，最后得 57。' },

    { id: 'd4m10', type: 'choice', tags: ['混合运算·解决问题'],
      q: '每支铅笔 3 元，妈妈买了 7 支，又买了一个 15 元的笔记本。一共花了多少钱？',
      options: ['3 × 7 + 15 = 36（元）', '3 + 7 × 15 = 108（元）', '(3 + 7) × 15 = 150（元）', '3 × 7 − 15 = 6（元）'],
      answer: 0,
      explain: '先算铅笔的钱：3×7=21 元，再加笔记本 15 元，一共 <b>36</b> 元。' },

    { id: 'd4m11', type: 'fill', tags: ['混合运算·解决问题'],
      q: '一盒鸡蛋 12 个，妈妈买了 4 盒，用掉了 9 个。还剩多少个？（写得数）',
      blanks: 1,
      answer: [['39']],
      explain: '12×4=48（个），48−9=<b>39</b>（个）。综合算式：12×4−9=39。' },

    { id: 'd4m12', type: 'tf', tags: ['混合运算·先乘除后加减'],
      q: '判断：算 20 − 3 × 4 时，因为 20 − 3 在左边，所以要先算 20 − 3。',
      answer: false,
      explain: '不对！有乘法就要先算乘法：3×4=12，20−12=<b>8</b>。' +
               '"从左往右"只适用于<b>同级</b>运算。' },

    { id: 'd4m13', type: 'choice', tags: ['混合运算·比大小'],
      q: '比较：<b>6 × 5 + 10</b>　○　<b>6 × (5 + 10)</b>，圆圈里填什么？',
      options: ['>', '<', '=', '无法比较'], answer: 1,
      explain: '左边：6×5=30，30+10=40。右边有括号，先算 5+10=15，6×15=90。' +
               '40 < 90，所以填 <b>&lt;</b>。（括号的用法明天专门学！）' },

    { id: 'd4m14', type: 'fill', tags: ['混合运算·综合练习'],
      q: '算一算：7 × 8 − 20 = ______',
      blanks: 1,
      answer: [['36']],
      explain: '7×8=56，56−20=<b>36</b>。' }
  ]
},

english: {
  goal: 'Unit 1 Part B —— 会说好朋友之间做的四件事',
  teach: [
    {
      title: '🤝 Part B  How can we be a good friend?',
      body: [
        '课本 Part B 讲的是：<span class="key">怎样做一个好朋友？</span>',
        '故事情节：陈杰的东西掉了（<b>Oh no!</b>），萨拉说<b>It\'s OK, Chen Jie. We can share.</b>' +
        '（没关系，陈杰，我们可以一起用。）'
      ]
    },
    {
      title: '🔤 好朋友的四个动作',
      words: [
        { en: 'listen', ipa: '/ˈlɪsn/', cn: '听；倾听' },
        { en: 'smile', ipa: '/smaɪl/', cn: '微笑；笑' },
        { en: 'help', ipa: '/help/', cn: '帮助' },
        { en: 'share', ipa: '/ʃeə(r)/', cn: '分享；共用' },
        { en: 'can', ipa: '/kæn/', cn: '可以；能' },
        { en: 'nice', ipa: '/naɪs/', cn: '友好的' }
      ]
    },
    {
      title: '🎵 Listen and chant —— 课本歌谣',
      lang: 'en',
      passage:
        'Am I a good friend? Yes, I am! ' +
        'I listen and say "Hi!" I smile too. ' +
        'Am I a good friend? Yes, I am! ' +
        'I help and share. I play fair too.'
    },
    {
      title: '💬 Let\'s talk —— 课本原文对话',
      lang: 'en',
      passage:
        'Oh no! ' +
        "It's OK, Chen Jie. We can share. " +
        'Hey, Sarah! We can share. ' +
        'Thanks, Sarah. ' +
        'Thank you, Chen Jie.'
    },
    {
      title: '📖 Start to read —— 小海报',
      lang: 'en',
      passage:
        'I listen. I say "Hi!" I share. I help. I am nice to my friends.',
      points: [
        '<b>I am nice to my friends.</b>　我对我的朋友们很友好。',
        '注意 <b>nice to</b>（对……友好）后面跟人。'
      ]
    },
    {
      title: '🔑 三句要会用的话',
      points: [
        "<b>Oh no!</b>　噢，不！（东西掉了、出岔子时说）",
        "<b>It's OK.</b>　没关系。（安慰别人）",
        "<b>We can share.</b>　我们可以一起用。（share 是分享）",
        "别人帮了你，说 <b>Thanks.</b> 或 <b>Thank you.</b>"
      ]
    }
  ],
  quiz: [
    { id: 'd4e1', type: 'listen', tags: ['听力·动词'], lang: 'en',
      q: '听一听，这个词是什么意思？', audio: 'share',
      options: ['分享；一起用', '微笑', '帮助', '听'], answer: 0,
      explain: 'share /ʃeə(r)/ 分享。We can share. = 我们可以一起用。' },

    { id: 'd4e2', type: 'listen', tags: ['听力·动词'], lang: 'en',
      q: '听一听，这个词是什么意思？', audio: 'listen',
      options: ['说', '听；倾听', '看', '笑'], answer: 1,
      explain: 'listen /ˈlɪsn/ 听。注意中间的 t <b>不发音</b>。' },

    { id: 'd4e3', type: 'match', tags: ['词汇·好朋友的动作'],
      q: '把英语和中文连起来',
      pairs: [ ['listen', '听'], ['smile', '微笑'], ['help', '帮助'], ['share', '分享'] ],
      explain: '这四个词是 Part B 的核心，都是好朋友会做的事。' },

    { id: 'd4e4', type: 'choice', tags: ['句型·安慰别人'],
      q: '朋友的铅笔掉了，他说 "Oh no!"，你该怎么安慰他？',
      options: ["It's OK. We can share.", "Thank you.", "What's your name?", "Nice to meet you."],
      answer: 0,
      explain: "It's OK.（没关系）+ We can share.（我们可以一起用）——这正是课本里萨拉说的话。" },

    { id: 'd4e5', type: 'choice', tags: ['句型·道谢'],
      q: '别人帮了你，你应该说什么？',
      options: ["Oh no!", "Thanks. / Thank you.", "It's OK.", "Bye!"], answer: 1,
      explain: 'Thanks. 或 Thank you. 都是谢谢。Thanks 更口语一点。' },

    { id: 'd4e6', type: 'order', tags: ['连词成句'],
      q: '排成一句话：我们可以一起用。', joiner: ' ',
      items: ['We', 'can', 'share'],
      answer: ['We', 'can', 'share'],
      explain: 'We can share. can 是"可以"，后面直接跟动词。' },

    { id: 'd4e7', type: 'order', tags: ['连词成句'],
      q: '排成一句话：我对我的朋友们很友好。', joiner: ' ',
      items: ['I', 'am', 'nice', 'to', 'my', 'friends'],
      answer: ['I', 'am', 'nice', 'to', 'my', 'friends'],
      explain: 'I am nice to my friends. 课本 Start to read 的原句。' },

    { id: 'd4e8', type: 'listen', tags: ['听力·句子'], lang: 'en',
      q: '听句子，说话人在做什么？', audio: "It's OK, Chen Jie. We can share.",
      options: ['安慰陈杰，说可以一起用', '问陈杰的名字', '和陈杰说再见', '批评陈杰'], answer: 0,
      explain: "It's OK 是「没关系」，We can share 是「我们可以一起用」——在安慰朋友。" },

    { id: 'd4e9', type: 'multi', tags: ['主题·好朋友'],
      q: '根据课本，好朋友之间会做哪些事？（多选）',
      options: ['listen（倾听）', 'smile（微笑）', 'help（帮助）', 'share（分享）'],
      answer: [0, 1, 2, 3],
      explain: '课本歌谣唱的就是这四件："I listen and say Hi! I smile too. I help and share."' +
               '四个都对！' },

    { id: 'd4e10', type: 'fill', tags: ['词汇·拼写'],
      q: '写出英语单词：帮助 = ______',
      blanks: 1, wide: true, hint: '4 个字母',
      answer: [['help']],
      explain: 'help /help/ 帮助。' },

    { id: 'd4e11', type: 'choice', tags: ['发音·易错'],
      q: 'listen 这个词里，哪个字母<b>不发音</b>？',
      options: ['l', 'i', 't', 'n'], answer: 2,
      explain: 'listen /ˈlɪsn/ 中间的 <b>t</b> 不发音，读起来像"利森"。' },

    { id: 'd4e12', type: 'readaloud', tags: ['朗读·歌谣'], lang: 'en',
      q: '大声读 Part B 的 chant',
      text: 'Am I a good friend? Yes, I am! I listen and say "Hi!" I smile too. I help and share. I play fair too.',
      explain: '这首歌谣里 am / Hi / share / fair 读起来有节奏，跟着拍手读更好玩。' },

    { id: 'd4e13', type: 'choice', tags: ['复习·身体部位'],
      q: '（复习）下面哪个词是"眼睛"？',
      options: ['ear', 'eye', 'arm', 'mouth'], answer: 1,
      explain: 'eye /aɪ/ 眼睛，ear /ɪə(r)/ 耳朵。这两个最容易混。' },

    { id: 'd4e14', type: 'choice', tags: ['句型·can'],
      q: 'can 后面应该跟什么？',
      options: ['名词', '动词', '形容词', '数字'], answer: 1,
      explain: 'can（可以/能）后面直接跟<b>动词</b>：We can <b>share</b>. / I can <b>help</b>.' }
  ]
}
};
