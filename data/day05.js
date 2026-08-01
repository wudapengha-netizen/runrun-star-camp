/* ============================================================
   第 5 关 · 8月5日
   语文 4 古诗三首·望洞庭 ｜ 数学 混合运算③ 有括号 ｜ 英语 U1 字母 Aa-Dd
   ============================================================ */
window.DAYS[5] = {

chinese: {
  goal: '背下《望洞庭》，会写"庭、未、磨"，读懂诗里的两个比喻',
  teach: [
    {
      title: '📖 第二单元开始了',
      body: [
        '第二单元的主题是<span class="key">秋天</span>：' +
        '「金秋的阳光，洒在树叶上，洒在花瓣上，也洒在我们的心上。」',
        '这一单元要学的本领：<b>运用多种方法理解难懂的词语</b>、<b>学习写日记</b>。',
        '第 4 课《古诗三首》有三首诗，今天先学第一首——<b>《望洞庭》</b>。'
      ]
    },
    {
      title: '🎋 望洞庭',
      lang: 'zh',
      speak: '望洞庭，唐，刘禹锡。湖光秋月两相和，潭面无风镜未磨。遥望洞庭山水翠，白银盘里一青螺。',
      body: [
        '<div style="text-align:center;font-family:var(--font-brush);font-size:25px;line-height:2.1">' +
        '<b>望洞庭</b><br>' +
        '<span style="font-size:15px;color:var(--ink-soft)">［唐］刘禹锡</span><br>' +
        '湖光秋月两相和，<br>潭面无风镜未磨。<br>遥望洞庭山水翠，<br>白银盘里一青螺。</div>'
      ]
    },
    {
      title: '📌 课本注释（考试常考）',
      points: [
        '<b>〔洞庭〕</b>洞庭湖，位于今<span class="key">湖南</span>北部。',
        '<b>〔和〕</b>（hé）协调，和谐。',
        '<b>〔青螺〕</b>青绿色的螺。这里<span class="key">比喻洞庭湖中的君山</span>。',
        '<b>〔未磨〕</b>没有磨过。古代的镜子是铜做的，要磨亮才能照人。'
      ]
    },
    {
      title: '💡 诗的意思（用自己的话说一遍）',
      points: [
        '<b>湖光秋月两相和</b>——秋夜里，湖水的光和月亮的光互相映衬，非常和谐。',
        '<b>潭面无风镜未磨</b>——湖面上没有风，平静得像一面<span class="hl">没有磨过的铜镜</span>' +
        '（有点朦朦胧胧的，不是特别亮）。',
        '<b>遥望洞庭山水翠</b>——远远望去，洞庭湖的山和水都是青翠的颜色。',
        '<b>白银盘里一青螺</b>——整个湖像一个<span class="hl">白银做的大盘子</span>，' +
        '湖中的君山就像盘子里放着的<span class="hl">一只青绿色的小螺</span>。'
      ]
    },
    {
      title: '🔍 这首诗最妙的地方：两个比喻',
      points: [
        '<b>比喻一</b>：把<b>平静的湖面</b>比作<b>没磨过的镜子</b>——写出了湖面的<b>平</b>和<b>朦胧</b>。',
        '<b>比喻二</b>：把<b>洞庭湖</b>比作<b>白银盘</b>，把<b>君山</b>比作<b>青螺</b>' +
        '——写出了从远处看的<b>小巧、精致</b>。',
        '想一想：为什么这么大的湖和山，诗人写得像<b>盘子和小螺</b>那么小？' +
        '因为他是<span class="key">"遥望"</span>——站得远，看什么都变小了。' +
        '这两个比喻既准确又好看。'
      ]
    },
    {
      title: '🖌️ 今天要会写的字',
      hanzi: [
        { zi: '庭', py: 'tíng', words: '洞庭、庭院' },
        { zi: '未', py: 'wèi', words: '镜未磨、未来' },
        { zi: '磨', py: 'mó', words: '磨镜、磨刀' }
      ]
    },
    {
      title: '⚠️ 容易写错的地方',
      points: [
        '<b>未</b> 和 <b>末</b>：「未」是<span class="key">上短下长</span>（未来还没到，所以上面短）；' +
        '「末」是<span class="key">上长下短</span>（末尾、期末）。这两个字考试必考！',
        '<b>庭</b>：外面是广字头，里面是"廷"，别少写那一横。'
      ]
    }
  ],
  quiz: [
    { id: 'd5c1', type: 'recite', tags: ['古诗背诵·望洞庭'],
      q: '把《望洞庭》补完整',
      text: '湖光秋月两相{和}，潭面无风{镜}{未}磨。遥望洞庭山水{翠}，白银盘里一{青螺}。',
      explain: '这首诗要能默写。「和」读 hé，是"和谐"的意思。' },

    { id: 'd5c2', type: 'choice', tags: ['古诗·作者'],
      q: '《望洞庭》的作者是谁？',
      options: ['［唐］刘禹锡', '［唐］杜牧', '［宋］叶绍翁', '［清］袁枚'], answer: 0,
      explain: '《望洞庭》是唐代<b>刘禹锡</b>写的。' },

    { id: 'd5c3', type: 'choice', tags: ['古诗·注释'],
      q: '洞庭湖在今天的哪个省？',
      options: ['江苏', '湖南', '浙江', '安徽'], answer: 1,
      explain: '课本注释：〔洞庭〕洞庭湖，位于今<b>湖南</b>北部。' },

    { id: 'd5c4', type: 'choice', tags: ['古诗·比喻'],
      q: '"白银盘里一青螺"中，"青螺"比喻的是什么？',
      options: ['湖里的螺蛳', '洞庭湖中的君山', '一只小船', '天上的月亮'], answer: 1,
      explain: '课本注释写得很清楚：〔青螺〕青绿色的螺，这里<b>比喻洞庭湖中的君山</b>。' },

    { id: 'd5c5', type: 'choice', tags: ['古诗·比喻'],
      q: '"潭面无风镜未磨"把什么比作什么？',
      options: [
        '把镜子比作湖面',
        '把平静的湖面比作没磨过的铜镜',
        '把风比作镜子',
        '没有用比喻'
      ], answer: 1,
      explain: '古代铜镜要磨才亮。没磨过的镜子有点朦胧——正像秋夜里平静又蒙着薄雾的湖面。' },

    { id: 'd5c6', type: 'choice', tags: ['古诗·理解'],
      q: '为什么诗人把这么大的洞庭湖写成"白银盘"，把君山写成"青螺"？',
      options: [
        '因为洞庭湖其实很小',
        '因为诗人是"遥望"，站得远，看起来就小巧精致了',
        '因为诗人看错了',
        '因为盘子和螺很好看'
      ], answer: 1,
      explain: '第三句"<b>遥</b>望洞庭山水翠"——"遥"就是远。站得远，大湖大山看着就像盘子和小螺。' },

    { id: 'd5c7', type: 'choice', tags: ['形近字·未末'],
      q: '"镜<b>未</b>磨"的"未"，和"<b>末</b>"怎么区分？',
      options: [
        '未：上短下长；末：上长下短',
        '未：上长下短；末：上短下长',
        '两个字一样',
        '未有三横，末有两横'
      ], answer: 0,
      explain: '<b>未</b>（wèi）上面一横短，表示"还没到"，如未来；<b>末</b>（mò）上面一横长，' +
               '表示"末尾"，如期末。这是考试高频题！' },

    { id: 'd5c8', type: 'fill', tags: ['生字·写字表'],
      q: '看拼音写字：dòng tíng（　　）湖　　jìng wèi mó（　　　）',
      blanks: 2, hint: '第一个填两个字，第二个填三个字',
      answer: [['洞庭'], ['镜未磨']],
      explain: '「庭」是广字头，「未」注意上短下长。' },

    { id: 'd5c9', type: 'order', tags: ['古诗背诵·望洞庭'],
      q: '把《望洞庭》四句排好', joiner: '　',
      items: ['湖光秋月两相和', '潭面无风镜未磨', '遥望洞庭山水翠', '白银盘里一青螺'],
      answer: ['湖光秋月两相和', '潭面无风镜未磨', '遥望洞庭山水翠', '白银盘里一青螺'],
      explain: '前两句写<b>近看</b>湖面，后两句写<b>远望</b>山水，由近到远。' },

    { id: 'd5c10', type: 'choice', tags: ['古诗·字词'],
      q: '"湖光秋月两相<b>和</b>"的"和"在这里是什么意思？',
      options: ['和平', '协调、和谐', '和好', '加法'], answer: 1,
      explain: '课本注释：〔和〕协调，和谐。读 <b>hé</b>。指湖光和月光互相映衬得很美。' },

    { id: 'd5c11', type: 'choice', tags: ['古诗·季节'],
      q: '从哪个词能看出《望洞庭》写的是<b>秋天</b>？',
      options: ['湖光', '秋月', '白银盘', '青螺'], answer: 1,
      explain: '"湖光<b>秋</b>月两相和"——"秋月"直接点出了季节。' },

    { id: 'd5c12', type: 'readaloud', tags: ['朗读·古诗'], lang: 'zh',
      q: '有感情地读一读《望洞庭》',
      text: '湖光秋月两相和，潭面无风镜未磨。遥望洞庭山水翠，白银盘里一青螺。',
      explain: '古诗读的时候，每句中间可以稍停一下：湖光秋月／两相和，潭面无风／镜未磨。' },

    { id: 'd5c13', type: 'fill', tags: ['古诗·翻译'],
      q: '用自己的话说："白银盘里一青螺" 是说洞庭湖像________，君山像________。',
      blanks: 2, wide: true, hint: '一个像盘子，一个像螺',
      answer: [['白银盘', '白银做的盘子', '一个白色的银盘', '白色的盘子'],
               ['青螺', '一只青绿色的螺', '青绿色的小螺', '青色的螺']],
      explain: '整个湖面像白银做的大盘子，湖中的君山像盘子里放着的一只青螺。' }
  ]
},

math: {
  goal: '知道括号能改变运算顺序：有括号先算括号里的',
  teach: [
    {
      title: '🍑 从一道摘桃子的题说起',
      body: [
        '<span class="hl">刘阿姨摘了两篮桃子，一篮 25 个，一篮 15 个。' +
        '每 8 个装一盒，一共能装几盒？</span>'
      ],
      calc: [
        { expr: '25 + 15 = 40（个）', note: '先算一共多少个' },
        { expr: '40 ÷ 8 = 5（盒）', note: '再算能装几盒' }
      ]
    },
    {
      title: '❗ 这样列综合算式，对吗？',
      body: [
        '有小朋友写成：<b>25 + 15 ÷ 8</b>',
        '<span class="key">不对！</span>因为按"先乘除后加减"的规则，' +
        '这个算式会<b>先算 15 ÷ 8</b>，跟我们的想法反了。',
        '那怎么办呢？——用<span class="key">括号</span>！'
      ]
    },
    {
      title: '⭐ 今天最重要的一条规则',
      body: [
        '<span class="key">括号可以改变运算顺序。算式里有括号，要先算括号里面的。</span>'
      ],
      calc: [
        { expr: '&nbsp;&nbsp;(25 + 15) ÷ 8' },
        { expr: '= 40 ÷ 8', note: '先算括号里的 25+15' },
        { expr: '= 5（盒）' }
      ]
    },
    {
      title: '📝 括号加在哪，结果差好多',
      calc: [
        { expr: '24 ÷ 4 + 2 = 6 + 2 = <span class="mark">8</span>', note: '没括号：先除后加' },
        { expr: '24 ÷ (4 + 2) = 24 ÷ 6 = <span class="mark">4</span>', note: '有括号：先算括号' },
        { expr: '72 − 18 ÷ 9 = 72 − 2 = <span class="mark">70</span>' },
        { expr: '(72 − 18) ÷ 9 = 54 ÷ 9 = <span class="mark">6</span>' }
      ],
      points: [
        '看到没有？同样的数字，加不加括号，答案完全不一样。' +
        '所以做题时<b>一定要先看有没有括号</b>。'
      ]
    },
    {
      title: '🧠 到今天为止，运算顺序一共三条',
      points: [
        '① 只有加减，或只有乘除 → <b>从左往右</b>算。',
        '② 既有乘除又有加减 → <b>先乘除，后加减</b>。',
        '③ 有括号 → <b>先算括号里面的</b>。',
        '三条连起来记：<span class="hl">先看括号，再看乘除，最后加减；同级从左往右。</span>'
      ]
    }
  ],
  quiz: [
    { id: 'd5m1', type: 'choice', tags: ['混合运算·括号'],
      q: '算式里有括号时，应该先算什么？',
      options: ['先算乘除法', '先算括号里面的', '从左往右算', '先算加减法'], answer: 1,
      explain: '有括号就<b>先算括号里面的</b>。括号的作用就是改变运算顺序。' },

    { id: 'd5m2', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：(25 + 15) ÷ 8 = ______',
      blanks: 1,
      answer: [['5']],
      explain: '先算括号：25+15=40，再算 40÷8=<b>5</b>。' },

    { id: 'd5m3', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：24 ÷ (4 + 2) = ______',
      blanks: 1,
      answer: [['4']],
      explain: '先算括号：4+2=6，再算 24÷6=<b>4</b>。' },

    { id: 'd5m4', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：24 ÷ 4 + 2 = ______',
      blanks: 1, hint: '这题没有括号',
      answer: [['8']],
      explain: '没括号，先算除法：24÷4=6，再算 6+2=<b>8</b>。和上一题比一比，差别很大！' },

    { id: 'd5m5', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：(72 − 18) ÷ 9 = ______',
      blanks: 1,
      answer: [['6']],
      explain: '先算括号：72−18=54，再算 54÷9=<b>6</b>。' },

    { id: 'd5m6', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：56 ÷ (2 × 4) = ______',
      blanks: 1,
      answer: [['7']],
      explain: '先算括号：2×4=8，再算 56÷8=<b>7</b>。' },

    { id: 'd5m7', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：(24 − 16) × 9 = ______',
      blanks: 1,
      answer: [['72']],
      explain: '先算括号：24−16=8，再算 8×9=<b>72</b>。' },

    { id: 'd5m8', type: 'choice', tags: ['混合运算·列式'],
      q: '两筐苹果，一筐 32 个，一筐 28 个。每 6 个装一袋，能装几袋？正确的综合算式是——',
      options: [
        '32 + 28 ÷ 6',
        '(32 + 28) ÷ 6',
        '32 ÷ 6 + 28',
        '(32 − 28) ÷ 6'
      ], answer: 1,
      explain: '要先算一共多少个，所以加法必须加括号：<b>(32+28)÷6 = 60÷6 = 10</b> 袋。' },

    { id: 'd5m9', type: 'choice', tags: ['混合运算·比大小'],
      q: '比较：<b>(3 + 5) × 8</b>　○　<b>3 + 5 × 8</b>',
      options: ['>', '<', '=', '不能比'], answer: 0,
      explain: '左边：(3+5)×8 = 8×8 = 64。右边：3+5×8 = 3+40 = 43。64 > 43，填 <b>&gt;</b>。' },

    { id: 'd5m10', type: 'fill', tags: ['混合运算·括号'],
      q: '算一算：388 − (27 − 18) = ______',
      blanks: 1,
      answer: [['379']],
      explain: '先算括号：27−18=9，再算 388−9=<b>379</b>。' },

    { id: 'd5m11', type: 'choice', tags: ['混合运算·加括号'],
      q: '在 <b>40 − 16 ÷ 4</b> 里加一对括号，让得数变成 <b>6</b>，括号应该加在哪？',
      options: ['(40 − 16) ÷ 4', '40 − (16 ÷ 4)', '(40 − 16 ÷ 4)', '40 (− 16 ÷ 4)'],
      answer: 0,
      explain: '(40−16)÷4 = 24÷4 = <b>6</b>。（如果不加括号，40−16÷4 = 40−4 = 36。）' },

    { id: 'd5m12', type: 'order', tags: ['混合运算·脱式格式'],
      q: '把 (18 + 22) ÷ 5 的脱式排好', joiner: '　',
      items: ['(18 + 22) ÷ 5', '= 40 ÷ 5', '= 8'],
      answer: ['(18 + 22) ÷ 5', '= 40 ÷ 5', '= 8'],
      explain: '算完括号里的，括号就可以去掉了。' },

    { id: 'd5m13', type: 'tf', tags: ['混合运算·括号'],
      q: '判断：45 ÷ (9 − 4) 应该先算 45 ÷ 9。',
      answer: false,
      explain: '不对！有括号先算括号：9−4=5，再算 45÷5=<b>9</b>。' },

    { id: 'd5m14', type: 'fill', tags: ['混合运算·解决问题'],
      q: '小明有 18 张卡片，小红有 22 张。两人合起来平均分给 5 个同学，每人分几张？（写得数）',
      blanks: 1,
      answer: [['8']],
      explain: '(18+22)÷5 = 40÷5 = <b>8</b> 张。要先合起来，所以必须加括号。' }
  ]
},

english: {
  goal: 'Unit 1 —— 认读字母 Aa Bb Cc Dd，掌握它们的首音',
  teach: [
    {
      title: '🔤 Letters and sounds  Aa  Bb  Cc  Dd',
      body: [
        '英语一共 26 个字母，每个字母都有<span class="key">大写</span>和<span class="key">小写</span>两种写法。' +
        '今天先学前四个。'
      ],
      figure:
        '<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-family:var(--font-en)">' +
        ['Aa /æ/', 'Bb /b/', 'Cc /k/', 'Dd /d/'].map(function (s) {
          return '<div style="border:2.5px solid var(--ink);border-radius:12px;padding:12px 20px;' +
                 'background:var(--jade-wash);box-shadow:3px 3px 0 var(--ink);font-size:24px;font-weight:700">' +
                 s + '</div>';
        }).join('') + '</div>'
    },
    {
      title: '🎵 Listen, repeat and chant —— 课本例词',
      points: [
        '<b>Aa</b> /æ/ → <b>a</b>pple（苹果）　<b>a</b>nt（蚂蚁）　b<b>a</b>g（书包）',
        '<b>Bb</b> /b/ → <b>b</b>ed（床）　<b>B</b>ob（鲍勃）　<b>b</b>ag（书包）',
        '<b>Cc</b> /k/ → <b>c</b>at（猫）　<b>c</b>an（能）　<b>c</b>ab（出租车）',
        '<b>Dd</b> /d/ → <b>d</b>og（狗）　<b>d</b>ad（爸爸）　sa<b>d</b>（伤心的）'
      ]
    },
    {
      title: '📖 Can you read the words? —— 拼一拼',
      body: [
        '学会了字母的音，就能<span class="key">自己拼读</span>简单的单词了。' +
        '课本上给了三个：'
      ],
      words: [
        { en: 'bad', ipa: '/bæd/', cn: '坏的（b-a-d）' },
        { en: 'cab', ipa: '/kæb/', cn: '出租车（c-a-b）' },
        { en: 'dad', ipa: '/dæd/', cn: '爸爸（d-a-d）' }
      ],
      points: [
        '拼读方法：把每个字母的音<b>连起来快速读</b>。' +
        'b（/b/）+ a（/æ/）+ d（/d/）→ <b>bad</b>。',
        '这个本领叫<span class="key">自然拼读</span>，学会了以后看到生词也能读出来。'
      ]
    },
    {
      title: '✍️ 大小写要配对',
      points: [
        '<b>A—a</b>　<b>B—b</b>　<b>C—c</b>　<b>D—d</b>',
        '句子的<b>第一个字母</b>要大写：<b>H</b>ello!',
        '<b>人名</b>第一个字母要大写：<b>B</b>ob，<b>M</b>ike。',
        '<b>I</b>（我）永远大写。'
      ]
    },
    {
      title: '🔁 Unit 1 全单元复习',
      points: [
        '问候：Hello! / Hi!',
        "问名字：What's your name?　答：My name is … / I'm …",
        '见面：Nice to meet you. — Nice to meet you <b>too</b>.',
        '身体：eye　ear　mouth　hand　arm',
        '好朋友：listen　smile　help　share',
        "安慰：Oh no! — It's OK. We can share."
      ]
    }
  ],
  quiz: [
    { id: 'd5e1', type: 'listen', tags: ['语音·首音'], lang: 'en',
      q: '听一听，这个词的<b>第一个音</b>是哪个字母发的？', audio: 'cat',
      options: ['Aa', 'Bb', 'Cc', 'Dd'], answer: 2,
      explain: 'cat /kæt/ 猫，开头是 <b>c</b> 的音 /k/。' },

    { id: 'd5e2', type: 'listen', tags: ['语音·首音'], lang: 'en',
      q: '听一听，这个词的<b>第一个音</b>是哪个字母发的？', audio: 'dog',
      options: ['Bb', 'Cc', 'Dd', 'Aa'], answer: 2,
      explain: 'dog /dɒɡ/ 狗，开头是 <b>d</b> 的音 /d/。' },

    { id: 'd5e3', type: 'listen', tags: ['语音·拼读'], lang: 'en',
      q: '听一听，是哪个单词？', audio: 'bad',
      options: ['bad', 'dad', 'cab', 'bag'], answer: 0,
      explain: 'bad /bæd/ 坏的。b-a-d 拼起来。' },

    { id: 'd5e4', type: 'choice', tags: ['字母·大小写'],
      q: '字母 <b>D</b> 的小写是——',
      options: ['b', 'd', 'p', 'q'], answer: 1,
      explain: 'D 的小写是 <b>d</b>。注意 b 和 d 长得很像但方向相反：' +
               'b 的圆圈在<b>右</b>边，d 的圆圈在<b>左</b>边。' },

    { id: 'd5e5', type: 'match', tags: ['语音·首音'],
      q: '把单词和它开头的字母连起来',
      pairs: [ ['apple', 'Aa'], ['bed', 'Bb'], ['can', 'Cc'], ['dad', 'Dd'] ],
      explain: 'apple 苹果、bed 床、can 能、dad 爸爸——都是课本上的例词。' },

    { id: 'd5e6', type: 'choice', tags: ['自然拼读'],
      q: 'c + a + b 拼起来是哪个单词？',
      options: ['cab（出租车）', 'bad（坏的）', 'dad（爸爸）', 'cat（猫）'], answer: 0,
      explain: '/k/ + /æ/ + /b/ → <b>cab</b> /kæb/ 出租车。' },

    { id: 'd5e7', type: 'choice', tags: ['字母·易混'],
      q: '小写字母 <b>b</b> 和 <b>d</b> 怎么区分？',
      options: [
        'b 的圆圈在右边，d 的圆圈在左边',
        'b 的圆圈在左边，d 的圆圈在右边',
        '两个一样',
        'b 比 d 高'
      ], answer: 0,
      explain: '竖线在前圆圈在后的是 <b>b</b>；圆圈在前竖线在后的是 <b>d</b>。' +
               '小窍门：想 <b>b</b>ed（床）这个词，b 和 d 正好像床的两头。' },

    { id: 'd5e8', type: 'fill', tags: ['字母·大小写'],
      q: '写出对应的小写字母：A → ___　B → ___　C → ___',
      blanks: 3, hint: '一个字母',
      answer: [['a'], ['b'], ['c']],
      explain: '大小写要一一配对，写的时候注意小写字母不要写太大。' },

    { id: 'd5e9', type: 'listen', tags: ['听力·复习'], lang: 'en',
      q: '（复习）听一听，这句话什么意思？', audio: 'Nice to meet you too.',
      options: ['见到你我也很高兴。', '你叫什么名字？', '我们可以一起用。', '指一指你的耳朵。'], answer: 0,
      explain: '句末的 too（也）是关键词。' },

    { id: 'd5e10', type: 'choice', tags: ['复习·Unit 1'],
      q: '（复习）"share" 是什么意思？',
      options: ['听', '微笑', '分享；一起用', '帮助'], answer: 2,
      explain: 'share /ʃeə(r)/ 分享。We can share. = 我们可以一起用。' },

    { id: 'd5e11', type: 'match', tags: ['复习·Unit 1 词汇'],
      q: '（复习）把 Unit 1 的词配对',
      pairs: [ ['hand', '手'], ['listen', '听'], ['name', '名字'], ['nice', '友好的'] ],
      explain: 'Unit 1 的核心词，都要会读会认。' },

    { id: 'd5e12', type: 'order', tags: ['复习·连词成句'],
      q: '（复习）排成一句话：你叫什么名字？', joiner: ' ',
      items: ["What's", 'your', 'name'],
      answer: ["What's", 'your', 'name'],
      explain: "What's your name? 记得句末加问号。" },

    { id: 'd5e13', type: 'readaloud', tags: ['朗读·字母'], lang: 'en',
      q: '大声读字母和例词',
      text: 'A, a, apple. B, b, bed. C, c, cat. D, d, dog.',
      explain: '每个字母读三遍：字母名 → 字母音 → 例词。这样记得最牢。' },

    { id: 'd5e14', type: 'choice', tags: ['书写规范'],
      q: '下面哪句话的大小写完全正确？',
      options: [
        'hello! i am bob.',
        'Hello! I am Bob.',
        'hello! I am bob.',
        'Hello! i am Bob.'
      ], answer: 1,
      explain: '句首字母大写（<b>H</b>ello）、<b>I</b> 永远大写、人名大写（<b>B</b>ob）。' }
  ]
}
};
