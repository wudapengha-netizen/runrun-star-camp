/* ============================================================
   英语全册期末试卷（人教版 PEP 三年级上册 · 2024 新版）
   ------------------------------------------------------------
   命题依据：逐页读完六个单元 + Revision + 书末附录。

   六个单元（每单元 Part A / B / C）：
     U1 Making friends      问候、自我介绍、身体部位、好朋友
     U2 Different families  家庭成员、This is my… / Is this your…?
     U3 Our animal friends  宠物与野生动物、Do you have a pet? / What's this?
     U4 Plants around us    水果与植物、Do you like…? / 植物需要什么
     U5 The colourful world 颜色、What colour is it? / 颜色相加
     U6 Useful numbers      数字 1-10、How old / How many / 买东西
     Revision: Being a good guest

   自然拼读（书末 Appendix 2 歌谣里的准确音标与例词）：
     A /æ/ apple bag ｜ B /b/ bed Bob ｜ C /k/ cat can ｜ D /d/ dog sad
     E /e/ egg nest ｜ F /f/ fish beef ｜ G /ɡ/ girl pig ｜ H /h/ hot hat
     I /ɪ/ ill kid ｜ J /ʤ/ job jet ｜ K /k/ Kim kite ｜ L /l/ leg lion
     M /m/ map mum ｜ N /n/ new fan ｜ O /ɒ/ orange fox ｜ P /p/ pen cup
     Q /kw/ quiet queen ｜ R /r/ red ruler ｜ S /s/ see bus ｜ T /t/ Ted sit ｜ U /ʌ/ up run
     V /v/ van vet ｜ W /w/ we win ｜ X /ks/ box six ｜ Y /j/ yellow yo-yo ｜ Z /z/ Zip quiz

   ⚠️ 避开的超纲内容：三上不考语法术语、不考时态、不考音标书写；
      听力题用浏览器语音现场朗读，点一下连读两遍。
   ============================================================ */

window.EXAM_ENGLISH = {
  id: 'english',
  title: '英语期末测试（一）· 三年级上册全册',
  subtitle: '人教版 PEP 2024 新版　·　共 162 分　·　建议用时 60 分钟',
  totalMinutes: 60,

  sections: [

/* ══════════ 一、听力 10×3 = 30 分 ══════════ */
{
  name: '一、听力',
  hint: '每题 3 分，共 30 分。点<b>「点我听」</b>按钮，每次会连读两遍，想听几次都行。听完再选。',
  per: 3,
  type: 'listen',
  items: [
    { q: '听一听，你听到的是哪个单词？', audio: 'elephant',
      o: ['elephant 大象', 'monkey 猴子', 'rabbit 兔子', 'giraffe 长颈鹿'], a: 0,
      tag: '听力·动物词', why: 'elephant /ˈelɪfənt/ 大象。注意它以元音开头，所以说 <b>an</b> elephant。' },

    { q: '听一听，你听到的是哪个单词？', audio: 'grapes',
      o: ['apples 苹果', 'grapes 葡萄', 'oranges 橙子', 'bananas 香蕉'], a: 1,
      tag: '听力·水果词', why: 'grapes /ɡreɪps/ 葡萄。课本 chant：Grapes are small. Bananas are long.' },

    { q: '听一听，说的是什么颜色？', audio: 'purple',
      o: ['pink 粉色', 'purple 紫色', 'brown 棕色', 'orange 橙色'], a: 1,
      tag: '听力·颜色词', why: 'purple /ˈpɜːpl/ 紫色。课本：Red and blue make purple.' },

    { q: '听句子，说话人有没有宠物？', audio: "Yes, I do. I have a dog.",
      o: ['有，是一只狗', '有，是一只猫', '没有宠物', '没说'], a: 0,
      tag: '听力·句子理解', why: 'Yes, I do. I have a dog. = 是的，我有。我有一只狗。' },

    { q: '听句子，说的是什么？', audio: "What colour is it? It's green.",
      o: ['它是什么颜色？它是绿色。', '它是什么？它是一棵树。', '你喜欢绿色吗？', '这是我的书。'], a: 0,
      tag: '听力·句子理解', why: "What colour is it? 是问颜色的固定句型。" },

    { q: '听句子，这个小朋友几岁？', audio: "I'm five years old.",
      o: ['4 岁', '5 岁', '6 岁', '9 岁'], a: 1,
      tag: '听力·数字', why: "I'm five years old. = 我五岁了。five 是 5。" },

    { q: '听句子，一共要付多少钱？', audio: "That's ten yuan, please.",
      o: ['6 元', '7 元', '10 元', '12 元'], a: 2,
      tag: '听力·数字', why: "That's ten yuan, please. = （共）十元，谢谢。这是课本买东西的原句。" },

    { q: '听句子，说话人在介绍谁？', audio: 'This is my grandma.',
      o: ['奶奶（外婆）', '爷爷（外公）', '姐姐', '妈妈'], a: 0,
      tag: '听力·家庭成员', why: 'grandma 是 grandmother 的口语说法，奶奶或姥姥。' },

    { q: '听指令，你应该做什么动作？', audio: 'Point to your ear.',
      o: ['指一指耳朵', '挥挥手', '张开嘴', '看眼睛'], a: 0,
      tag: '听力·听指令', why: 'Point to your ear. = 指一指你的耳朵。ear 是耳朵，eye 才是眼睛。' },

    { q: '听句子，植物需要什么？', audio: 'Plants need air, water and sun.',
      o: ['空气、水和阳光', '水和泥土', '阳光和花', '只需要水'], a: 0,
      tag: '听力·句子理解', why: 'Plants need air, water and sun. 这是 Unit 4 的核心句。' }
  ]
},

/* ══════════ 二、字母与自然拼读 10×2 = 20 分 ══════════ */
{
  name: '二、字母与自然拼读',
  hint: '每题 2 分，共 20 分。',
  per: 2,
  type: 'choice',
  items: [
    { q: '字母 <b>D</b> 的小写是——', o: ['b', 'd', 'p', 'q'], a: 1,
      tag: '字母·大小写', why: 'b 的圆圈在右边，d 的圆圈在左边。想 <b>bed</b> 这个词，b 和 d 正好像床的两头。' },

    { q: '字母 <b>Q</b> 的小写是——', o: ['g', 'p', 'q', 'j'], a: 2,
      tag: '字母·大小写', why: 'q 的尾巴向右下，g 的尾巴向左弯——这两个最容易写反。' },

    { q: '按字母表顺序，<b>M</b> 后面紧跟着的是——', o: ['L', 'N', 'O', 'P'], a: 1,
      tag: '字母·顺序', why: '……K L M <b>N</b> O P……　Unit 4 学的正好是 Mm Nn Oo Pp。' },

    { q: '单词 <b>cat</b> 的第一个音，和下面哪个词开头一样？',
      o: ['can', 'dog', 'apple', 'bed'], a: 0,
      tag: '自然拼读·首音', why: 'cat 和 can 开头都是 /k/，这是字母 c 的音。课本 chant：C is for /k/, cat, can.' },

    { q: '单词 <b>job</b> 和 <b>jet</b> 开头的音是哪个字母发的？',
      o: ['Gg', 'Jj', 'Kk', 'Ll'], a: 1,
      tag: '自然拼读·首音', why: 'J is for /ʤ/：job、jet。课本 chant：His job is to fly a jet.' },

    { q: '单词 <b>box</b> 和 <b>six</b> 里都有的那个音，是哪个字母？',
      o: ['Ss', 'Xx', 'Zz', 'Cc'], a: 1,
      tag: '自然拼读·字母音', why: 'X 发 /ks/，box、six 里都有。课本 Unit 6 学的是 Vv Ww Xx Yy Zz。' },

    { q: '下面哪个单词的开头音和 <b>lion</b> 一样？',
      o: ['leg', 'nine', 'ruler', 'yellow'], a: 0,
      tag: '自然拼读·首音', why: 'L is for /l/：leg、lion。课本 chant：The lion has four legs.' },

    { q: '把 <b>b + a + d</b> 拼起来，是哪个单词？',
      o: ['bad', 'bed', 'dad', 'cab'], a: 0,
      tag: '自然拼读·拼读', why: '/b/ + /æ/ + /d/ → bad。Unit 1 的拼读练习：bad、cab、dad。' },

    { q: '下面哪一句的大小写<b>完全正确</b>？',
      o: ["i'm mike black.", "I'm Mike Black.", "I'm mike black.", "i'm Mike Black."], a: 1,
      tag: '书写规范', why: '三条规矩：句首字母大写、<b>I</b> 永远大写、人名每个词首字母大写。' },

    { q: '英文名 <b>Sarah Miller</b> 中，哪个是姓？',
      o: ['Sarah', 'Miller', '两个都是姓', '两个都是名'], a: 1,
      tag: '文化·英文姓名', why: '英文是「名在前，姓在后」，和中文相反。Sarah 是名，Miller 是姓。' }
  ]
},

/* ══════════ 三、词汇 12×2 = 24 分 ══════════ */
{
  name: '三、词汇',
  hint: '每题 2 分，共 24 分。前 8 题选择，后 4 题打字（注意拼写）。',
  type: 'choice',
  groups: [
    { label: '1. 选出正确的中文意思（每题 2 分）', per: 2, type: 'choice', items: [
      { q: '<b>uncle</b>', o: ['叔叔／舅舅／姑父', '阿姨／舅妈', '堂表兄弟姐妹', '哥哥／弟弟'], a: 0,
        tag: '词汇·家庭', why: '英语里男性长辈（父母的兄弟、姐妹的丈夫）统统叫 uncle，比中文简单多了。' },
      { q: '<b>giraffe</b>', o: ['大象', '长颈鹿', '老虎', '猴子'], a: 1,
        tag: '词汇·动物', why: 'giraffe /dʒəˈrɑːf/ 长颈鹿。课本：The giraffe is tall!' },
      { q: '<b>share</b>', o: ['听', '微笑', '分享', '帮助'], a: 2,
        tag: '词汇·动作', why: 'share 分享。Unit 1：We can share. 好朋友会 listen、smile、help、share。' },
      { q: '<b>fresh air</b>', o: ['新鲜空气', '干净的水', '阳光', '花园'], a: 0,
        tag: '词汇·植物', why: 'Unit 4 原句：I like the fresh air. 我喜欢新鲜的空气。' },
      { q: '<b>brown</b>', o: ['紫色', '粉色', '棕色', '黑色'], a: 2,
        tag: '词汇·颜色', why: 'brown 棕色。课本：A big brown bear. 一只棕色的大熊。' },
      { q: '<b>o\'clock</b>', o: ['……点钟', '钟表', '早上', '生日'], a: 0,
        tag: '词汇·时间', why: "It's seven o'clock. Hurry! 七点了，快点！" },
      { q: '<b>cute</b>', o: ['高的', '快的', '可爱的', '大的'], a: 2,
        tag: '词汇·形容词', why: "Unit 3 原句：It's a red panda. It's cute! 小熊猫，好可爱！" },
      { q: '<b>polite</b>（Revision 单元）', o: ['安静的', '有礼貌的', '开心的', '忙碌的'], a: 1,
        tag: '词汇·Revision', why: 'Revision 的 chant：Be a good guest. Be polite! 做个好客人，要有礼貌！' }
    ]},
    { label: '2. 根据中文写出英语单词（每题 2 分，注意拼写）', per: 2, type: 'fill', items: [
      { q: '兔子 → ___', a: [['rabbit']], tag: '词汇拼写·动物',
        why: 'rabbit /ˈræbɪt/。注意中间是<b>双写 b</b>。' },
      { q: '苹果（复数）→ ___', a: [['apples']], tag: '词汇拼写·水果',
        why: 'apple 加 s 变复数：apples。课本：Do you like apples?' },
      { q: '黄色 → ___', a: [['yellow']], tag: '词汇拼写·颜色',
        why: 'yellow /ˈjeləʊ/。注意中间是<b>双写 l</b>。' },
      { q: '七 → ___', a: [['seven']], tag: '词汇拼写·数字',
        why: 'seven /ˈsevn/。1-10：one two three four five six seven eight nine ten。' }
    ]}
  ]
},

/* ══════════ 四、句型与情景 16×3 = 48 分 ══════════ */
{
  name: '四、句型与情景对话',
  hint: '每题 3 分，共 48 分。',
  per: 3,
  type: 'choice',
  items: [
    { q: '别人说 "Nice to meet you."，你应该回答——',
      o: ['Nice to meet you too.', 'Thank you.', "I'm fine.", 'Goodbye.'], a: 0,
      tag: '句型·问候', why: '加一个 <b>too</b>（也），表示「见到你我也很高兴」。' },

    { q: '想知道别人叫什么名字，应该问——',
      o: ['How are you?', "What's your name?", 'How old are you?', 'What colour is it?'], a: 1,
      tag: '句型·问名字', why: "What's your name? 回答：My name is … 或 I'm …" },

    { q: '把妈妈介绍给朋友，应该说——',
      o: ['This is my mum.', 'She my mum.', 'This my mum.', 'Is this my mum?'], a: 0,
      tag: '句型·介绍家人', why: '介绍一个人固定用 <b>This is</b>，中间的 is 不能少。' },

    { q: '"Is this your sister?" 如果<b>是</b>，怎么回答？',
      o: ['Yes, it is.', 'Yes, I am.', 'Yes, I do.', 'No, it is.'], a: 0,
      tag: '句型·一般疑问句', why: '用 Is this…? 问，就用 <b>Yes, it is.</b> 回答。' },

    { q: '"Do you have a pet?" 如果<b>没有</b>，怎么回答？',
      o: ["No, I don't.", 'No, it isn\'t.', "Yes, I do.", 'No, I am not.'], a: 0,
      tag: '句型·Do you…?', why: "Do you…? 用 Yes, I do. / No, I don't. 回答。注意别和 Is this…? 的回答混。" },

    { q: '指着远处的一只狐狸问「那是什么？」，应该说——',
      o: ["What's this?", "What's that?", 'Who is that?', 'Where is it?'], a: 1,
      tag: '句型·this 和 that', why: '<b>this</b> 指近的，<b>that</b> 指远的。课本原句：Miss White, what\'s that? — It\'s a fox.' },

    { q: '下面哪一句是<b>正确</b>的？',
      o: ["It's a elephant.", "It's an elephant.", "It's elephant.", "It's an dog."], a: 1,
      tag: '语法·a 和 an', why: 'elephant 以<b>元音音素</b>开头，要用 <b>an</b>。dog 以辅音开头，用 a。' },

    { q: '"Do you like apples?" 如果不喜欢、喜欢香蕉，怎么答？',
      o: ["No, I don't. I like bananas.", "Yes, I do. I like bananas.", "No, it isn't.", "I like apples."], a: 0,
      tag: '句型·Do you like…?', why: '课本原句：No, I don\'t. I like bananas.（Unit 4 Let\'s talk）' },

    { q: '问「它是什么颜色？」，应该说——',
      o: ['What is it?', 'What colour is it?', 'How many colours?', 'Do you like colour?'], a: 1,
      tag: '句型·问颜色', why: "What colour is it? — It's orange. 注意 colour 是英式拼法（课本用的就是这个）。" },

    { q: '课本说：Red and blue make ___ 。',
      o: ['green', 'orange', 'purple', 'brown'], a: 2,
      tag: '知识·颜色相加', why: '红 + 蓝 = 紫。课本还讲了：Blue and yellow make green；yellow + red = orange。' },

    { q: '问别人几岁，应该说——',
      o: ['How many are you?', 'How old are you?', 'How are you?', 'What are you?'], a: 1,
      tag: '句型·问年龄', why: "How old are you? — I'm five years old. 别和 How are you?（你好吗）混。" },

    { q: '想问「有几个苹果？」，应该说——',
      o: ['How old are the apples?', 'How many apples?', 'What colour are apples?', 'Do you like apples?'], a: 1,
      tag: '句型·问数量', why: 'How many + 名词复数？—— How many apples? Two.' },

    { q: '在商店，售货员把东西递给你时会说——',
      o: ['Here you are.', 'Thank you.', 'How much?', "You're welcome."], a: 0,
      tag: '情景·购物', why: 'Here you are. = 给您。课本 Unit 6：That\'s ten yuan, please. — Here you are.' },

    { q: '朋友过生日，你应该说——',
      o: ['Happy birthday!', 'Good morning!', 'Nice to meet you!', 'How old are you?'], a: 0,
      tag: '情景·祝福', why: 'Happy birthday! 生日快乐！Unit 6 Project 就是做生日贺卡。' },

    { q: '课本说植物需要什么？Plants need ___ 。',
      o: ['air, water and sun', 'water and food', 'sun and flowers', 'air and grass'], a: 0,
      tag: '知识·植物', why: 'Plants need air, water and sun. 我们可以 water the flowers、plant trees 来帮助它们。' },

    { q: '做一个好客人（Being a good guest），下面哪个做法<b>不对</b>？',
      o: ['进门说 Hello 或 Hi', '看着对方的眼睛', '抢别人的玩具不分享', '认真听别人说话'], a: 2,
      tag: '情景·Revision', why: 'Revision 的 chant：Share your toys and listen with care. 要分享玩具、认真倾听。' }
  ]
},

/* ══════════ 五、阅读理解 8×3 = 24 分 ══════════ */
{
  name: '五、阅读理解',
  hint: '每题 3 分，共 24 分。先读短文，再答题。',
  per: 3,
  type: 'choice',
  groups: [
    {
      label: '（一）课内阅读　—— Unit 4 Reading time《I am an apple tree》',
      per: 3, type: 'choice',
      passage:
        'I am an apple tree. My new family help me.\n' +
        'I need air, water and sun. My family water me.\n' +
        'It is cold. They help me.\n' +
        'I love the fresh air. The flowers are so beautiful!\n' +
        'I am big now. I give apples to my family. We are all happy!',
      source: '—— Unit 4 Reading time',
      items: [
        { q: 'Who is speaking in the story?（谁在说话？）',
          o: ['a boy 一个男孩', 'an apple tree 一棵苹果树', 'a dog 一只狗', 'a flower 一朵花'], a: 1,
          tag: '课内阅读·理解', why: '第一句就是 I am an apple tree. 全文用苹果树的口吻在说话。' },

        { q: 'What does the tree need?（这棵树需要什么？）',
          o: ['air, water and sun', 'food and toys', 'friends only', 'nothing'], a: 0,
          tag: '课内阅读·提取信息', why: '原句：I need air, water and sun.' },

        { q: 'What does the tree give the family in the end?（最后树给了家人什么？）',
          o: ['flowers 花', 'apples 苹果', 'water 水', 'leaves 叶子'], a: 1,
          tag: '课内阅读·提取信息', why: '原句：I am big now. I give apples to my family.' },

        { q: '这个故事想告诉我们——',
          o: ['苹果很好吃', '人和植物互相帮助', '天气很冷', '树长得很快'], a: 1,
          tag: '课内阅读·主旨',
          why: 'Unit 4 的大问题就是 How do plants and people help each other?——家人照顾树，树结出苹果回报家人。' }
      ]
    },
    {
      label: '（二）课外阅读',
      per: 3, type: 'choice',
      passage:
        "Hello! I'm Lily. I'm eight years old.\n" +
        'I have a big family. I have a father, a mother, a brother and a baby sister.\n' +
        'I have a pet. It is a small yellow bird. Its name is Sunny. Sunny can sing.\n' +
        'I like red and green. My brother likes blue. My baby sister is too young. She likes everything!\n' +
        'We have six apple trees in our garden. In autumn we pick apples together. I am happy.',
      source: '（原创短文）',
      items: [
        { q: 'How old is Lily?（莉莉几岁？）',
          o: ['six', 'seven', 'eight', 'nine'], a: 2,
          tag: '课外阅读·提取信息', why: "原句：I'm eight years old." },

        { q: 'What pet does Lily have?（莉莉养了什么宠物？）',
          o: ['a dog 狗', 'a cat 猫', 'a bird 鸟', 'a rabbit 兔子'], a: 2,
          tag: '课外阅读·提取信息', why: '原句：It is a small yellow bird. Its name is Sunny.' },

        { q: 'What colour does her brother like?（她哥哥喜欢什么颜色？）',
          o: ['red', 'green', 'blue', 'yellow'], a: 2,
          tag: '课外阅读·提取信息', why: '原句：My brother likes blue.（Lily 自己喜欢 red 和 green，别看错。）' },

        { q: 'How many apple trees are there in the garden?（花园里有几棵苹果树？）',
          o: ['four', 'five', 'six', 'ten'], a: 2,
          tag: '课外阅读·数字', why: '原句：We have six apple trees in our garden.' }
      ]
    }
  ]
},

/* ══════════ 六、补全对话 4×4 = 16 分 ══════════ */
{
  name: '六、补全对话',
  hint: '每题 4 分，共 16 分。把缺的那个词打在框里（首字母该大写的要大写，句末标点可以不写）。',
  per: 4,
  type: 'fill',
  items: [
    { q: '— Hello! ______ your name?　— My name is Binbin.',
      a: [["What's", 'What is']], tag: '对话·问名字',
      why: "What's your name? 是问名字的固定说法，What's 是 What is 的缩写。" },

    { q: '— Do you have a pet?　— ______ , I do. I have a cat.',
      a: [['Yes']], tag: '对话·Do you…?',
      why: 'Do you…? 的肯定回答是 Yes, I do.；否定是 No, I don\'t.' },

    { q: '— ______ colour is it?　— It\'s green.',
      a: [['What']], tag: '对话·问颜色',
      why: 'What colour is it? 问颜色的固定句型。' },

    { q: '— How ______ are you?　— I\'m nine years old.',
      a: [['old']], tag: '对话·问年龄',
      why: 'How old are you? 问年龄。How many 才是问数量。' }
  ]
}

  ]
};
