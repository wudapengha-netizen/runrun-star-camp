/* ============================================================
   英语知识点总表 · 人教版 PEP 三年级上册（2024 新版）
   ------------------------------------------------------------
   来源：《义务教育教科书 英语（PEP）三年级上册》PDF，共 99 页，
        逐页读完。教材页码 = PDF 页码 − 5
        （已用目录核对：Contents 写 Unit 1 = p2，PDF 第 7 页页脚正是 2）

   目录页（PDF p5）给出的权威结构：
     Unit 1  Making friends          p2
     Unit 2  Different families      p14
     Unit 3  Our animal friends      p26
     Unit 4  Plants around us        p38
     Unit 5  The colourful world     p50
     Unit 6  Useful numbers          p62
     Revision  Being a good guest    p74
     Appendix 1  Songs               p78
     Appendix 2  Chants in "Letters and sounds"   p80
     Appendix 3  Words in each unit  p83
     Appendix 4  Vocabulary          p86
     Appendix 5  Useful expressions  p89
     Appendix 6  The alphabet        p91

   每个单元的结构：Part A（必学）/ Part B（必学）/ Part C（选学：
   Project + Self-check + Reading time）。

   ⚠️ 每单元的 <b>Self-check</b> 是教材<b>自己写明的能力目标</b>，逐页抄下：
     U1  1 greet people and show friendliness　2 say the names of body parts
         3 say different ways to be a good friend　4 read, write and say Aa–Dd
     U2  1 introduce my family to others　2 name different family members
         3 say how families are different　4 read, write and say Ee–Hh
     U3  1 tell others about my pets　2 talk about wild animals
         3 group different animals　4 read, write and say Ii–Ll
     U4  1 ask about fruit and say the fruit I like
         2 name some plants and talk about how they grow
         3 say how we help plants and plants help us　4 read, write and say Mm–Pp
     U5  1 tell others about the colours I see and like　2 tell the colour of things
         3 talk about what colours mean　4 read, write and say Qq–Uu
     U6  1 ask about age and number　2 count things with the numbers 1 to 10
         3 use the numbers 1 to 10 in different places　4 read, write and say Vv–Zz

   ⚠️ 超纲提醒：三上<b>不考语法术语、不考时态、不考音标书写</b>。
      词汇表注明「黑体词要求理解、运用，白体词仅要求在语境中理解」。

   ── 字段 ──────────────────────────────────
     tag    唯一正名，一个知识点一个
     alias  真同义别名（卷子里用过的其它叫法）
     text   教材原文（Let's talk / Useful expressions / Chant），一字不改
   ============================================================ */

window.SYLLABUS_ENGLISH = {
  subject: 'english',
  name: '英语',
  book: '人教版 PEP 义务教育教科书 英语 三年级上册（2024）',
  pdfPages: 99,
  pageOffset: 5,

  units: [

/* ══════════════ Unit 1 Making friends（教材 p2–13） ══════════════ */
{
  unit: 'Unit 1 · Making friends（交朋友）', from: 2, to: 13,
  points: [
    { id: 'e1.1', page: 4, point: '问候与自我介绍',
      text: "Hello! I'm Mike Black.｜Hi! My name is Wu Binbin.｜Nice to meet you.｜Nice to meet you too.",
      eg: '两种自我介绍都对：<b>I\'m + 名字</b> 和 <b>My name is + 名字</b>。<br>' +
          '别人说 Nice to meet you.，回答要加 <b>too</b>。',
      tag: '句型·问候', alias: ['句型·问名字', '对话·问名字'] },

    { id: 'e1.2', page: 5, point: '身体部位词汇',
      text: 'eye　mouth　ear　arm　hand',
      eg: 'Listen and do：Wave your hand. Hello!｜Look into my eyes. Hi!｜' +
          'Point to your ear. Listen!｜Point to your mouth. Smile!｜Wave your arm. Bye!',
      tag: '词汇·身体部位', alias: ['听力·听指令'] },

    { id: 'e1.3', page: 8, point: '好朋友做的四件事',
      text: 'I listen.　I smile.　I help.　I share.',
      eg: 'Chant 原文：Am I a good friend? Yes, I am! I listen and say "Hi!" I smile too. ' +
          'I help and share. I play fair too.',
      tag: '词汇·动作', alias: ['词汇·Revision'] },

    { id: 'e1.4', page: 6, point: '字母 Aa Bb Cc Dd 与它们的音',
      text: 'A is for /æ/：apple, bag｜B is for /b/：bed, Bob｜C is for /k/：cat, can｜D is for /d/：dog, sad',
      eg: '拼读练习：bad、cab、dad。（Appendix 2 歌谣原文）',
      tag: '拼读·AaDd' },

    { id: 'e1.5', page: 7, point: '分享与道谢',
      text: "Oh no!｜It's OK, Chen Jie.｜Hey, Sarah! We can share.｜Thanks, Sarah. / Thank you, Chen Jie.",
      eg: 'Part B 的核心场景：东西掉了 → 没关系 → 我们可以分享 → 谢谢。',
      tag: '情景·分享道谢' },

    { id: 'e1.6', page: 4, point: '英文姓名：名在前，姓在后',
      text: 'Mike Black｜Sarah Miller｜John Baker｜Chen Jie｜Wu Binbin',
      eg: '英文是<b>名在前、姓在后</b>，和中文相反。Sarah 是名，Miller 是姓。<br>' +
          '书写规矩：句首字母大写、<b>I</b> 永远大写、人名每个词首字母大写。',
      tag: '文化·英文姓名', alias: ['书写规范'] }
  ]
},

/* ══════════════ Unit 2 Different families（教材 p14–25） ══════════════ */
{
  unit: 'Unit 2 · Different families（不同的家庭）', from: 14, to: 25,
  points: [
    { id: 'e2.1', page: 16, point: '介绍家人：This is my…',
      text: 'This is my grandma.｜This is my grandpa.｜Look! This is my family.',
      eg: 'Chant：This is my mum. Hello! This is my dad. Hi! This is my sister. How are you?',
      tag: '句型·介绍家人' },

    { id: 'e2.2', page: 17, point: '家庭成员词汇',
      text: 'grandfather (grandpa)　grandmother (grandma)　father (dad)　mother (mum)　sister　brother　aunt　uncle　cousin　baby sister　me',
      eg: '英语里<b>父母双方的长辈叫法一样</b>：爷爷和外公都是 grandpa，' +
          '叔叔舅舅姑父姨父都是 uncle，堂表兄弟姐妹都是 cousin。比中文简单。',
      tag: '词汇·家庭', alias: ['听力·家庭成员'] },

    { id: 'e2.3', page: 19, point: 'Is this / Is that your…? 的问答',
      text: 'Is this your sister?｜Is that your brother?｜Yes, it is.｜No, it\'s my cousin.',
      eg: '<b>this</b> 指近的，<b>that</b> 指远的。回答用 <b>it</b>，不重复 this/that。',
      tag: '句型·this和that', alias: ['句型·this 和 that', '句型·一般疑问句'] },

    { id: 'e2.4', page: 18, point: '字母 Ee Ff Gg Hh 与它们的音',
      text: 'E is for /e/：egg, nest｜F is for /f/：fish, beef｜G is for /ɡ/：girl, pig｜H is for /h/：hot, hat',
      eg: '拼读练习：fed、gab、had。（Appendix 2 歌谣原文）',
      tag: '拼读·EeHh' },

    { id: 'e2.5', page: 21, point: '大家庭与小家庭',
      text: 'This family is small. They love each other.｜This family is big. They love each other too.',
      eg: 'Self-check 第 3 条：I can say how families are different.<br>' +
          '家庭有大有小，但都一样相爱 —— 这是本单元想传达的。',
      tag: '知识·家庭差异' }
  ]
},

/* ══════════════ Unit 3 Our animal friends（教材 p26–37） ══════════════ */
{
  unit: 'Unit 3 · Our animal friends（动物朋友）', from: 26, to: 37,
  points: [
    { id: 'e3.1', page: 28, point: 'Do you have a pet? 的问答',
      text: "Do you have a pet?｜No, I don't.｜Yes, I do. I have a cat.",
      eg: '回答的固定搭配：<b>Yes, I do. / No, I don\'t.</b>（不能用 Yes, I am.）',
      tag: '句型·Do you…?', alias: ['对话·Do you…?'] },

    { id: 'e3.2', page: 28, point: '宠物与动物词汇',
      text: 'dog　cat　fish　bird　rabbit　fox　panda　red panda　monkey　tiger　elephant　lion　giraffe　animal',
      eg: 'red panda 是<b>小熊猫</b>，不是红色的熊猫。',
      tag: '词汇·动物', alias: ['听力·动物词', '词汇拼写·动物'] },

    { id: 'e3.3', page: 31, point: "What's this / What's that? 的问答",
      text: "What's this?｜It's a fox.｜Miss White, what's that?｜It's a red panda.",
      eg: '问「这/那是什么」，回答一律用 <b>It\'s a…</b>',
      tag: '句型·Whats this' },

    { id: 'e3.4', page: 30, point: '字母 Ii Jj Kk Ll 与它们的音',
      text: 'I is for /ɪ/：ill, kid｜J is for /ʤ/：job, jet｜K is for /k/：Kim, kite｜L is for /l/：leg, lion',
      eg: '歌谣原文：His job is to fly a jet.｜The lion has four legs.（Appendix 2）',
      tag: '拼读·IiLl' },

    { id: 'e3.5', page: 33, point: '描述动物特征的形容词',
      text: 'tall　fast　cute　big　small',
      eg: "The giraffe is tall!｜It's a red panda. It's cute!",
      tag: '词汇·形容词' },

    { id: 'e3.6', page: 31, point: '待客与出行用语',
      text: 'Good morning, Mike!｜Good morning! Come in.｜Let\'s go to the zoo!｜Great!',
      eg: "Let's + 动词原形 = 「我们一起……吧」。",
      tag: '情景·邀请' },

    { id: 'e3.7', page: 32, point: 'a 和 an 的选择',
      text: null,
      eg: '元音开头的单词前用 <b>an</b>：an elephant、an apple、an orange、an aunt。<br>' +
          '其余用 <b>a</b>：a dog、a cat、a fox。',
      tag: '语法·a和an', alias: ['语法·a 和 an'] }
  ]
},

/* ══════════════ Unit 4 Plants around us（教材 p38–49） ══════════════ */
{
  unit: 'Unit 4 · Plants around us（身边的植物）', from: 38, to: 49,
  points: [
    { id: 'e4.1', page: 40, point: 'Do you like…? 的问答',
      text: "Mike, do you like apples?｜Yes, I do. And you?｜No, I don't.",
      eg: '问喜好用 Do you like…?，回答 <b>Yes, I do. / No, I don\'t.</b>' +
          '反问对方用 <b>And you?</b>',
      tag: '句型·Do you like…?' },

    { id: 'e4.2', page: 40, point: '水果词汇',
      text: 'apple　banana　orange　grape',
      eg: '注意复数：Do you like <b>apples</b>? 说喜欢某类水果时用复数。',
      tag: '词汇·水果', alias: ['听力·水果词', '词汇拼写·水果'] },

    { id: 'e4.3', page: 43, point: '植物需要什么',
      text: 'Plants need air, water and sun.',
      eg: 'Song 原文：I can water my plants. I can give them sun. I can help them grow.<br>' +
          '注意 <b>water</b> 既是「水」也是「浇水」。',
      tag: '知识·植物', alias: ['词汇·植物'] },

    { id: 'e4.4', page: 42, point: '字母 Mm Nn Oo Pp 与它们的音',
      text: 'M is for /m/：map, mum｜N is for /n/：new, fan｜O is for /ɒ/：orange, fox｜P is for /p/：pen, cup',
      eg: '歌谣原文：Mum has a map.｜The fan is new.｜The fox is orange.（Appendix 2）',
      tag: '拼读·MmPp' },

    { id: 'e4.5', page: 45, point: '植物给我们什么',
      text: 'Plants can give us many things.｜I like the fresh air.',
      eg: 'Song：Plants can give me air. Plants can give me food. Plants can help me grow.<br>' +
          '人和植物<b>互相帮助</b>：We can help each other. We can grow together.',
      tag: '知识·植物的作用' },

    { id: 'e4.6', page: 43, point: '农场与花园词汇',
      text: 'farm　garden　school　flower　grass　tree　plant　air　sun　water',
      eg: 'Do you like the farm?｜We can plant new trees.（plant 既是「植物」也是「种植」）',
      tag: '词汇·农场花园' }
  ]
},

/* ══════════════ Unit 5 The colourful world（教材 p50–61） ══════════════ */
{
  unit: 'Unit 5 · The colourful world（多彩世界）', from: 50, to: 61,
  points: [
    { id: 'e5.1', page: 52, point: 'What colour is it? 的问答',
      text: "What colour is it?｜It's orange.",
      eg: '问颜色的固定句型。注意 <b>colour</b> 是英式拼法（美式 color），课本用英式。',
      tag: '句型·问颜色', alias: ['对话·问颜色'] },

    { id: 'e5.2', page: 52, point: '颜色词汇',
      text: 'red　orange　yellow　green　blue　purple　brown　pink　black　white',
      eg: 'Song：Red and orange and yellow and green, purple and then I see blue. I can see a rainbow.',
      tag: '词汇·颜色', alias: ['听力·颜色词', '词汇拼写·颜色'] },

    { id: 'e5.3', page: 52, point: '颜色相加',
      text: 'Red and blue make purple.',
      eg: '<b>make</b> 在这里是「变成、调出」。红 + 蓝 = 紫。',
      tag: '知识·颜色相加' },

    { id: 'e5.4', page: 54, point: '字母 Qq Rr Ss Tt Uu 与它们的音',
      text: 'Q goes with u：/kw/ quiet, queen｜R is for /r/：red, ruler｜S is for /s/：see, bus｜T is for /t/：Ted, sit｜U is for /ʌ/：up, run',
      eg: '注意 <b>Q 总是和 u 一起</b>，发 /kw/，不单独出现。（Appendix 2）',
      tag: '拼读·QqUu' },

    { id: 'e5.5', page: 55, point: 'What colours do you like?',
      text: 'What colours do you like?｜I like red and pink.｜Let\'s draw some purple and brown birds.',
      eg: '问喜欢的颜色（复数 colours），可以说多个。',
      tag: '句型·喜欢的颜色' },

    { id: 'e5.6', page: 56, point: '颜色的含义',
      text: 'They can mean stop, wait and go.',
      eg: 'Song 原文：红黄绿三色在红绿灯上分别表示<b>停、等、走</b>。<br>' +
          'Self-check 第 3 条：I can talk about what colours mean.',
      tag: '知识·颜色的含义' }
  ]
},

/* ══════════════ Unit 6 Useful numbers（教材 p62–73） ══════════════ */
{
  unit: 'Unit 6 · Useful numbers（有用的数字）', from: 62, to: 73,
  points: [
    { id: 'e6.1', page: 64, point: 'How old are you? 问年龄',
      text: "How old are you?｜I'm five years old.｜Me too.",
      eg: '<b>Me too.</b> = 我也是。回答年龄可以简单说 I\'m five.，也可以说全 I\'m five years old.',
      tag: '句型·问年龄', alias: ['对话·问年龄', '听力·数字'] },

    { id: 'e6.2', page: 65, point: '数字 1–10',
      text: 'one　two　three　four　five　six　seven　eight　nine　ten',
      eg: '拼写容易错的：<b>seven</b>（不是 seaven）、<b>eight</b>（gh 不发音）、<b>nine</b>。',
      tag: '词汇·数字', alias: ['词汇拼写·数字', '课外阅读·数字'] },

    { id: 'e6.3', page: 66, point: 'How many…? 问数量',
      text: 'How many apples?｜Two.',
      eg: 'How many 后面跟<b>复数</b>：How many apple<b>s</b>?',
      tag: '句型·问数量' },

    { id: 'e6.4', page: 68, point: '字母 Vv Ww Xx Yy Zz 与它们的音',
      text: "V is for /v/：van, vet｜W is for /w/：we, win｜X is for /ks/：box, six｜Y is for /j/：yellow, yo-yo｜Z is for /z/：Zip, quiz",
      eg: '歌谣原文：Number six is on the box.｜It\'s a yellow yo-yo.｜Zip has a quiz.（Appendix 2）',
      tag: '拼读·VvZz' },

    { id: 'e6.5', page: 67, point: '买东西',
      text: "Great! Let's go to the shop!｜That's ten yuan, please.｜Here you are.",
      eg: '<b>Here you are.</b> = 给您。付钱和递东西时都用它。',
      tag: '情景·购物' },

    { id: 'e6.6', page: 69, point: '时间与生日',
      text: "It's seven o'clock. Hurry!｜Happy birthday!｜Oh, one more cut for the dog.",
      eg: "整点用 <b>o'clock</b>（注意那个撇号）。cut 在这里是「切（蛋糕）」。",
      tag: '情景·祝福', alias: ['词汇·时间'] }
  ]
},

/* ══════════════ Revision Being a good guest（教材 p74–77） ══════════════ */
{
  unit: 'Revision · Being a good guest（做个好客人）', from: 74, to: 77,
  points: [
    { id: 'e7.1', page: 77, point: '做客的五个步骤',
      text: 'Ask Mum and Dad.｜Knock! Knock! Say "Hello!"｜Say "Thank you!"｜Care and share.｜Say "Goodbye!"',
      eg: '教材原文清单，回答 How can we be a good guest? 这个问题。<br>' +
          '先征得爸妈同意 → 敲门问好 → 说谢谢 → 关心和分享 → 告别。',
      tag: '情景·Revision' }
  ]
},

/* ══════════════ 书末附录（教材 p78–91） ══════════════ */
{
  unit: '书末附录 · 词表与歌谣', from: 78, to: 91,
  points: [
    { id: 'e8.1', page: 91, point: 'Appendix 6 · 字母表 26 个字母',
      text: 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz',
      eg: '最容易写反的三组：<b>b / d</b>（想 bed 这个词，像床的两头）、' +
          '<b>p / q</b>、<b>g / q</b>（g 的尾巴向左弯，q 的尾巴向右下）。',
      tag: '字母·大小写', alias: ['字母·顺序'] },

    { id: 'e8.2', page: 80, point: 'Appendix 2 · 自然拼读歌谣（26 个字母的音）',
      text: '/æ/ /b/ /k/ /d/ /e/ /f/ /ɡ/ /h/ /ɪ/ /ʤ/ /k/ /l/ /m/ /n/ /ɒ/ /p/ /kw/ /r/ /s/ /t/ /ʌ/ /v/ /w/ /ks/ /j/ /z/',
      eg: '每个字母配两个例词，全册最系统的发音材料。<br>' +
          '注意两处特别的：<b>Q 总和 u 一起发 /kw/</b>；<b>X 发 /ks/</b>（box、six）。',
      tag: '自然拼读·字母音', alias: ['自然拼读·首音', '自然拼读·拼读'] },

    { id: 'e8.3', page: 83, point: 'Appendix 3/4 · 单元词汇表与总词汇表',
      text: '注：加*的词为《义务教育英语课程标准（2022年版）》中的二级词；黑体词要求理解、运用，白体词仅要求在语境中理解。',
      eg: '按单元排一遍（Appendix 3），再按字母排一遍（Appendix 4），都带音标和页码。<br>' +
          '<b>只有黑体词要求会用</b>，白体词认识就行 —— 这条决定了拼写题的范围。',
      tag: '词汇·词汇表' },

    { id: 'e8.4', page: 89, point: 'Appendix 5 · 常用表达法',
      text: null,
      eg: '按单元收录全部核心句子，中英对照。情景对话题的答案全部出自这里。<br>' +
          '例：Do you have a pet? / No, I don\'t.　What colour is it? / It\'s orange.　' +
          'How old are you? / I\'m five years old.',
      tag: '句型·常用表达' },

    { id: 'e8.5', page: 78, point: 'Appendix 1 · 六首歌曲',
      text: null,
      eg: 'U1 Nice to meet you!｜U2 My family + Finger family song｜U3 Animal song｜' +
          'U4 Plants and us｜U5 Colour song｜U6 Numbers<br>' +
          '歌词里藏着大量核心句型，跟唱是最省力的记忆方式。',
      tag: '歌曲·六首歌' }
  ]
},

/* ══════════════ 阅读能力（各单元 Reading time + Start to read） ══════════════ */
{
  unit: '阅读能力 · Start to read / Reading time', from: 9, to: 76,
  points: [
    { id: 'e9.1', page: 9, point: 'Start to read：从短文里找信息',
      text: 'Circle the words you read in the poster.',
      eg: '每个单元 Part B 末尾都有 Start to read，要求在图文里<b>圈出读到的词</b>、' +
          '<b>勾出符合的项</b>。练的是「读懂并提取信息」。',
      tag: '阅读·提取信息', alias: ['课内阅读·提取信息', '课外阅读·提取信息'] },

    { id: 'e9.3', page: 4, point: '听懂整句话（Listen and…）',
      text: null,
      eg: '每个 Part 都有 Listen and chant / Listen and sing / Listen and do / ' +
          'Listen and circle / Listen and tick。<br>' +
          '光认识单词不够，要能<b>听懂一整句</b>：' +
          "「Yes, I do. I have a dog.」「What colour is it? It's green.」" +
          "「Plants need air, water and sun.」",
      tag: '听力·句子理解' },

    { id: 'e9.2', page: 12, point: 'Reading time：读懂小故事的大意',
      text: null,
      eg: '每单元 Part C 的 Reading time 是一篇配图小故事（Zip 和 Zoom 的故事）。<br>' +
          '例（U1）：Zoom is my new friend. We share food. We play together. ' +
          'We listen with care and help each other. We are good friends now.',
      tag: '阅读·理解大意', alias: ['课内阅读·主旨', '课内阅读·理解'] }
  ]
}

  ]
};

/* tag → 正名 */
window.SYLLABUS_ENGLISH.canon = (function () {
  var map = {};
  window.SYLLABUS_ENGLISH.units.forEach(function (u) {
    u.points.forEach(function (p) {
      map[p.tag] = p.tag;
      (p.alias || []).forEach(function (a) { map[a] = p.tag; });
    });
  });
  return function (tag) { return map[tag] || tag; };
})();
