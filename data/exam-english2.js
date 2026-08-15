/* ============================================================
   英语补漏卷（二）· 全册知识点补全
   ------------------------------------------------------------
   出题依据：知识点总表 syllabus-english.js 的覆盖率报表。

   英语卷（一）60 题覆盖了 45 个知识点里的 28 个。
   这一卷补剩下的 17 个，做完全册 100% 覆盖。

   补的主要是两块：
     ① <b>自然拼读</b>（Appendix 2 的 26 个字母音）—— 卷（一）只抽考了几个，
        这一卷六个单元的字母组全部考一遍，这是三年级英语的地基。
     ② 几个漏掉的核心句型和情景（What's this? / What colours do you like? /
        Let's go… / 颜色的含义 / 植物的作用）。

   ⚠️ 本卷<b>不含听力题</b>——听力在卷（一）已经考过 10 道，
      这里专攻拼读和句型，做起来更专注。
   ============================================================ */

window.EXAM_ENGLISH2 = {
  id: 'english2',
  subject: 'english',
  title: '英语补漏卷（二）· 全册补全',
  subtitle: '人教版 PEP 三年级上册　·　共 112 分　·　建议用时 50 分钟',
  totalMinutes: 50,
  intro: '这一卷补的是卷（一）没考到的知识点，重点是<b>自然拼读</b>——' +
         '26 个字母各发什么音，这是以后自己拼读单词的地基。<br>' +
         '课本 Appendix 2 的歌谣里全都有，<b>做之前可以先翻到书末读两遍</b>。',

  sections: [

/* ══════════ 一、自然拼读：26 个字母的音 13×4 = 52 分 ══════════ */
{
  name: '一、自然拼读：26 个字母的音',
  hint: '每题 4 分，共 52 分。全部出自课本书末 <b>Appendix 2「Chants in Letters and sounds」</b>（教材 p80–82）。' +
        '每个字母配了两个例词，记住例词就记住了音。',
  per: 4,
  type: 'choice',
  groups: [
    { label: '1. Unit 1：Aa Bb Cc Dd', per: 4, type: 'choice', items: [
      { q: '课本歌谣：<b>A is for /æ/</b>，配的两个例词是——',
        o: ['apple, bag', 'ant, arm', 'and, at', 'air, aunt'], a: 0,
        tag: '拼读·AaDd',
        why: '歌谣原文：<b>A is for /æ/. /æ/, /æ/, apple. /æ/, /æ/, bag. I see an apple in a bag.</b>（教材 p80）' },

      { q: '下面哪一组词，开头的音<b>都是 /k/</b>？',
        o: ['cat, can', 'cake, city', 'dog, sad', 'bed, Bob'], a: 0,
        tag: '拼读·AaDd',
        why: '歌谣：<b>C is for /k/. /k/, /k/, cat. /k/, /k/, can. I see a cat and a can.</b><br>' +
             '另外两组：B is for /b/（bed, Bob）；D is for /d/（dog, sad）。（教材 p80）' },

      { q: '把 <b>b + a + d</b> 拼起来，读出来是哪个词？',
        o: ['bad', 'bed', 'dad', 'cab'], a: 0,
        tag: '拼读·AaDd',
        why: '/b/ + /æ/ + /d/ → <b>bad</b>。<br>' +
             '课本 Unit 1 的拼读练习正好三个：<b>bad、cab、dad</b>。（教材 p6）' }
    ]},
    { label: '2. Unit 2：Ee Ff Gg Hh', per: 4, type: 'choice', items: [
      { q: '课本歌谣：<b>E is for /e/</b>，例词是 egg 和——',
        o: ['nest', 'eye', 'ear', 'eat'], a: 0,
        tag: '拼读·EeHh',
        why: '歌谣原文：<b>E is for /e/. /e/, /e/, egg. /e/, /e/, nest. I see an egg in the nest.</b>（教材 p80）' },

      { q: '<b>fish</b> 和 <b>beef</b> 里都有的那个音，是哪个字母发的？',
        o: ['Ff', 'Bb', 'Ss', 'Hh'], a: 0,
        tag: '拼读·EeHh',
        why: '歌谣：<b>F is for /f/. /f/, /f/, fish. /f/, /f/, beef. I see fish and beef.</b><br>' +
             '注意 f 的音可以在词<b>开头</b>（fish），也可以在<b>末尾</b>（beef）。（教材 p80）' }
    ]},
    { label: '3. Unit 3：Ii Jj Kk Ll', per: 4, type: 'choice', items: [
      { q: '课本歌谣：<b>J is for /ʤ/</b>，例词 job 和 jet。这句歌谣是——',
        o: ['His job is to fly a jet.', 'The jet has a job.', 'I see a job and a jet.', 'Jack has a jet.'], a: 0,
        tag: '拼读·IiLl',
        why: '歌谣原文：<b>J is for /ʤ/. /ʤ/, /ʤ/, job. /ʤ/, /ʤ/, jet. His job is to fly a jet.</b>（教材 p82）' },

      { q: '下面哪个词的开头音和 <b>lion</b> 一样？',
        o: ['leg', 'nine', 'ruler', 'yellow'], a: 0,
        tag: '拼读·IiLl',
        why: '歌谣：<b>L is for /l/. /l/, /l/, leg. /l/, /l/, lion. The lion has four legs.</b><br>' +
             '同一组还有：I is for /ɪ/（ill, kid）；K is for /k/（Kim, kite）。（教材 p82）' }
    ]},
    { label: '4. Unit 4：Mm Nn Oo Pp', per: 4, type: 'choice', items: [
      { q: '课本歌谣：<b>O is for /ɒ/</b>，例词是 orange 和——',
        o: ['fox', 'old', 'one', 'open'], a: 0,
        tag: '拼读·MmPp',
        why: '歌谣原文：<b>O is for /ɒ/. /ɒ/, /ɒ/, orange. /ɒ/, /ɒ/, fox. The fox is orange.</b>（教材 p82）' },

      { q: '<b>pen</b> 和 <b>cup</b> 里都有的音，是哪个字母发的？',
        o: ['Pp', 'Bb', 'Cc', 'Nn'], a: 0,
        tag: '拼读·MmPp',
        why: '歌谣：<b>P is for /p/. /p/, /p/, pen. /p/, /p/, cup. I see a pen and a cup.</b><br>' +
             '同组：M is for /m/（map, mum）；N is for /n/（new, fan）。（教材 p82）' }
    ]},
    { label: '5. Unit 5：Qq Rr Ss Tt Uu', per: 4, type: 'choice', items: [
      { q: '关于字母 <b>Q</b>，课本歌谣说的是——',
        o: ['Q goes with u，一起发 /kw/', 'Q 单独发 /k/', 'Q 发 /kju/', 'Q 不发音'], a: 0,
        tag: '拼读·QqUu',
        why: '歌谣原文：<b>Q goes with u, /kw/, /kw/, quiet. /kw/, /kw/, queen. The queen is quiet.</b><br>' +
             '这是个特别的：<b>Q 几乎总是和 u 一起出现</b>，合起来发 /kw/。（教材 p82–83）' },

      { q: '<b>up</b> 和 <b>run</b> 里的那个音，是哪个字母发的？',
        o: ['Uu', 'Rr', 'Aa', 'Oo'], a: 0,
        tag: '拼读·QqUu',
        why: '歌谣：<b>U is for /ʌ/. /ʌ/, /ʌ/, up. /ʌ/, /ʌ/, run. Get up and run!</b><br>' +
             '同组：R is for /r/（red, ruler）；S is for /s/（see, bus）；T is for /t/（Ted, sit）。（教材 p83）' }
    ]},
    { label: '6. Unit 6：Vv Ww Xx Yy Zz', per: 4, type: 'choice', items: [
      { q: '<b>box</b> 和 <b>six</b> 里都有的那个音，是哪个字母发的？它发什么音？',
        o: ['Xx，发 /ks/', 'Ss，发 /s/', 'Kk，发 /k/', 'Zz，发 /z/'], a: 0,
        tag: '拼读·VvZz',
        why: '歌谣原文：<b>X is for /ks/. /ks/, /ks/, box. /ks/, /ks/, six. Number six is on the box.</b><br>' +
             '注意 X 是<b>两个音合起来</b>：/k/ + /s/。（教材 p83）' },

      { q: '课本歌谣：<b>Y is for /j/</b>，配的两个例词是——',
        o: ['yellow, yo-yo', 'yes, you', 'year, young', 'yard, yak'], a: 0,
        tag: '拼读·VvZz',
        why: "歌谣：<b>Y is for /j/. /j/, /j/, yellow. /j/, /j/, yo-yo. It's a yellow yo-yo.</b><br>" +
             '同组：V is for /v/（van, vet）；W is for /w/（we, win）；Z is for /z/（Zip, quiz）。（教材 p83）' }
    ]}
  ]
},

/* ══════════ 二、句型补漏 5×4 = 20 分 ══════════ */
{
  name: '二、句型补漏',
  hint: '每题 4 分，共 20 分。这几个句型课本上都有，但卷（一）没考到。',
  per: 4,
  type: 'choice',
  groups: [
    { label: '', per: 4, type: 'choice', items: [
      { q: '指着<b>远处</b>一只不认识的动物，应该怎么问？',
        o: ["What's that?", "What's this?", 'What colour is it?', 'How many?'], a: 0,
        tag: '句型·Whats this',
        why: '课本原句：<b>Miss White, what\'s that? — It\'s a red panda.</b><br>' +
             '近的用 <b>this</b>，远的用 <b>that</b>。回答一律用 <b>It\'s a…</b>（教材 p31）' },

      { q: '别人问 <b>What colours do you like?</b>，下面哪个回答最合适？',
        o: ['I like red and pink.', "It's red.", 'Yes, I do.', 'I have red.'], a: 0,
        tag: '句型·喜欢的颜色',
        why: "课本原句：<b>What colours do you like? — I like red and pink.</b><br>" +
             "注意区分：问「它是什么颜色」用 What colour is it?（回答 It's orange.）；" +
             '问「你喜欢什么颜色」用 What colours do you like?（回答 I like…）（教材 p55）' },

      { q: '想邀请朋友一起去动物园，应该说——',
        o: ["Let's go to the zoo!", 'I go to the zoo.', 'Do you go to the zoo?', 'Go to the zoo.'], a: 0,
        tag: '情景·邀请',
        why: "课本原句：<b>Let's go to the zoo! — Great!</b><br>" +
             "<b>Let's + 动词原形</b> = 「我们一起……吧」。同一页还有 Good morning! Come in.（教材 p31）" }
    ]},
    { label: '', per: 4, type: 'fill', items: [
      { q: '补全对话（把句子抄在框里）：<br>' +
           'A: Oh no! （书掉了）<br>' +
           "B: It's OK. Hey! We can ___ .<br>" +
           'A: ___ you!',
        a: [['share'], ['Thank', 'thank']], tag: '情景·分享道谢',
        why: '课本 Unit 1 Part B 的核心场景（教材 p7）：<br>' +
             "<b>Oh no! — It's OK, Chen Jie. Hey, Sarah! We can share. — Thanks, Sarah. / Thank you, Chen Jie.</b>" },

      { q: '课本 Appendix 5 常用表达法里，问年龄和回答是：<br>' +
           'How ___ are you? — I\'m five ___ old.',
        a: [['old'], ['years', 'year']], tag: '句型·常用表达',
        why: '书末 <b>Appendix 5「Useful expressions」</b>（教材 p89–90）按单元收录了全部核心句子，中英对照。<br>' +
             '<b>情景对话题的答案全部出自这里</b>，考前翻一遍最划算。' }
    ]}
  ]
},

/* ══════════ 三、常识与词汇 10×4 = 40 分 ══════════ */
{
  name: '三、课本里的常识与词汇',
  hint: '每题 4 分，共 40 分。',
  per: 4,
  type: 'choice',
  groups: [
    { label: '', per: 4, type: 'choice', items: [
      { q: '课本说，大家庭和小家庭有什么共同点？',
        o: ['They love each other.（都相亲相爱）', '人数一样多',
            '都住在一起', '都有宠物'], a: 0,
        tag: '知识·家庭差异',
        why: '课本原文两句并排（教材 p21）：<br>' +
             '<b>This family is small. They love each other.</b><br>' +
             '<b>This family is big. They love each other too.</b><br>' +
             'Self-check 第 3 条：I can say how families are different.' },

      { q: '课本 Song《Plants and us》里说，植物能给我们什么？',
        o: ['air and food（空气和食物）', 'water and sun', 'money', 'books'], a: 0,
        tag: '知识·植物的作用',
        why: '歌词原文：<b>Plants can give me air. Plants can give me food. Plants can help me grow.</b><br>' +
             '课本还说：<b>Plants can give us many things.</b> 而人和植物是<b>互相</b>帮助的：' +
             'We can help each other. We can grow together.（教材 p45）' },

      { q: '红绿灯上的红、黄、绿三种颜色，课本 Colour song 说它们表示——',
        o: ['stop, wait and go（停、等、走）', 'hot, warm and cold',
            'big, medium and small', 'yes, maybe and no'], a: 0,
        tag: '知识·颜色的含义',
        why: '歌词原文：<b>Red and yellow and then I see green. They can mean stop, wait and go.</b><br>' +
             'Self-check 第 3 条：<b>I can talk about what colours mean.</b>（教材 p56）' },

      { q: '课本 Appendix 1 一共收了几首歌？',
        o: ['六个单元各一首', '三首', '十首', '没有歌'], a: 0,
        tag: '歌曲·六首歌',
        why: '书末 <b>Appendix 1「Songs」</b>（教材 p78–79）六个单元各一首：<br>' +
             'U1 Nice to meet you!｜U2 My family（还多一首 Finger family song）｜U3 Animal song｜' +
             'U4 Plants and us｜U5 Colour song｜U6 Numbers<br>' +
             '<b>歌词里藏着大量核心句型</b>，跟着唱是最省力的记法。' },

      { q: '课本词汇表注明：<b>黑体词</b>和<b>白体词</b>的要求有什么不同？',
        o: ['黑体词要求理解、运用；白体词只要求在语境中理解',
            '黑体词只要认识；白体词要会写', '完全一样', '白体词不用学'], a: 0,
        tag: '词汇·词汇表',
        why: '书末 Appendix 3/4 的原注：<b>加*的词为《义务教育英语课程标准（2022年版）》中的二级词；' +
             '黑体词要求理解、运用，白体词仅要求在语境中理解。</b><br>' +
             '这条决定了<b>拼写题的范围</b> —— 只有黑体词才要求会写。（教材 p83、p86）' }
    ]},
    { label: '', per: 4, type: 'fill', items: [
      { q: '写出单词（农场与花园）：<br>农场 → ___ 　　花园 → ___ 　　树 → ___',
        a: [['farm'], ['garden'], ['tree']], tag: '词汇·农场花园',
        why: 'Unit 4 的场景词（教材 p43）：farm、garden、school、flower、grass、tree、plant、air、sun、water。<br>' +
             '课本原句：Do you like the farm? — <b>I like the fresh air.</b>｜We can plant new trees.' },

      { q: '写出单词（花 / 草 / 水）：<br>花 → ___ 　　草 → ___ 　　水 → ___',
        a: [['flower'], ['grass'], ['water']], tag: '词汇·农场花园',
        why: '注意 <b>water</b> 既是名词「水」，也是动词「给……浇水」：<b>I can water my plants.</b>（Song 原句）<br>' +
             '<b>plant</b> 也一样，既是「植物」也是「种植」。（教材 p43）' },

      { q: '把课本原句补完整：<br>Plants need ___ , water and ___ .',
        a: [['air'], ['sun']], tag: '知识·植物的作用',
        why: '<b>Plants need air, water and sun.</b> 这是 Unit 4 的核心句（教材 p43）。<br>' +
             '三样东西：空气、水、阳光。' },

      { q: '把常用表达法补完整：<br>' +
           "That's ten ___ , please.（共十元，谢谢）<br>" +
           'Here you ___ .（给您）',
        a: [['yuan'], ['are']], tag: '句型·常用表达',
        why: '书末 Appendix 5 收录的 Unit 6 购物场景原句（教材 p90）：<br>' +
             "<b>Great! Let's go to the shop! — That's ten yuan, please. — Here you are.</b>" },

      { q: '把常用表达法补完整：<br>' +
           "It's seven o'___ . Hurry!（七点了，快点）<br>" +
           'Happy ___ !（生日快乐）',
        a: [['clock'], ['birthday']], tag: '句型·常用表达',
        why: "整点用 <b>o'clock</b>，注意中间那个<b>撇号</b>。（教材 p90）" }
    ]}
  ]
}

  ]
};
