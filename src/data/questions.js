// 句型资料来源：一年级华文课本_全文提取.txt（my-agent/华文课本资料/）
// 每题的 source.book === true 表示直接引用课本原句；false 表示自编例句（用法已核对符合马来西亚华语标准）。
// DSKP 依据：5.4 认识不同类型的句子 — 5.4.1 认识陈述、疑问、祈使、感叹等句子功能

export const SENTENCE_TYPES = {
  chenshu: {
    label: '陈述句',
    hint: '说明事实',
    punctuation: '句号。',
    tone: '语调平平的，说完一句话就停留',
    color: 'var(--color-chenshu)',
  },
  yiwen: {
    label: '疑问句',
    hint: '发问、想知道答案',
    punctuation: '问号？',
    tone: '前低后高，语气往上扬，像在等别人回答',
    color: 'var(--color-yiwen)',
  },
  qishi: {
    label: '祈使句',
    hint: '请求或吩咐别人做事',
    punctuation: '句号。或"…吧。"',
    tone: '像在跟人商量或提出请求',
    color: 'var(--color-qishi)',
  },
  gantan: {
    label: '感叹句',
    hint: '抒发强烈的感情',
    punctuation: '叹号！',
    tone: '由高而低再上扬，把特别的心情读出来',
    color: 'var(--color-gantan)',
  },
}

// 教学导入用的"读读比比"最小对照组：同一件事，不同句型
export const INTRO_COMPARISON = {
  sentenceA: { text: '蜜蜂飞到我家花园来了！', type: 'gantan' },
  sentenceB: { text: '蜜蜂飞到我家花园来了。', type: 'chenshu' },
  source: { book: true, unit: '第7单元《小蜜蜂》', page: '41-45' },
}

export const QUESTIONS = [
  // 陈述句
  {
    id: 'chenshu-1',
    sentence: '蜜蜂飞到我家花园来了。',
    correctType: 'chenshu',
    distractorType: 'gantan',
    source: { book: true, unit: '第7单元《小蜜蜂》', page: '41-45' },
  },
  {
    id: 'chenshu-2',
    sentence: '一大早，你就飞到花园了。',
    correctType: 'chenshu',
    distractorType: 'yiwen',
    source: { book: true, unit: '第7单元《小蜜蜂》', page: '41-45' },
  },
  {
    id: 'chenshu-3',
    sentence: '早上，兔妈妈带着兔兄弟，顺着小河走。',
    correctType: 'chenshu',
    distractorType: 'qishi',
    source: { book: true, unit: '第17单元《妈妈，为什么？》', page: '110-112' },
  },
  {
    id: 'chenshu-4',
    sentence: '因为大海妈妈在等着小河回家。',
    correctType: 'chenshu',
    distractorType: 'yiwen',
    source: { book: true, unit: '第17单元《妈妈，为什么？》', page: '110-112' },
  },
  // 疑问句
  {
    id: 'yiwen-1',
    sentence: '森林会唱歌吗？',
    correctType: 'yiwen',
    distractorType: 'gantan',
    source: { book: true, unit: '第8单元《会唱歌的森林》', page: '47-50' },
  },
  {
    id: 'yiwen-2',
    sentence: '你是嗅到花儿的香味儿，才飞来的吗？',
    correctType: 'yiwen',
    distractorType: 'chenshu',
    source: { book: true, unit: '第7单元《小蜜蜂》', page: '41-45' },
  },
  {
    id: 'yiwen-3',
    sentence: '妈妈，为什么小河那么爱唱歌？',
    correctType: 'yiwen',
    distractorType: 'gantan',
    source: { book: true, unit: '第17单元《妈妈，为什么？》', page: '110-112' },
  },
  {
    id: 'yiwen-4',
    sentence: '你要落到什么地方？',
    correctType: 'yiwen',
    distractorType: 'qishi',
    source: { book: true, unit: '第5单元《雨停了》', page: '28-32' },
  },
  // 祈使句
  {
    id: 'qishi-1',
    sentence: '请把积木还给我。',
    correctType: 'qishi',
    distractorType: 'chenshu',
    source: { book: true, unit: '第4单元《我跟妹妹搭积木》', page: '21-23' },
  },
  {
    id: 'qishi-2',
    sentence: '妈妈，请带我们去看小河怎样回家吧。',
    correctType: 'qishi',
    distractorType: 'chenshu',
    source: { book: true, unit: '第17单元《妈妈，为什么？》', page: '110-112' },
  },
  {
    id: 'qishi-3',
    sentence: '请安静，我们要开始上课了。',
    correctType: 'qishi',
    distractorType: 'yiwen',
    source: { book: false },
  },
  {
    id: 'qishi-4',
    sentence: '快把手洗干净吧。',
    correctType: 'qishi',
    distractorType: 'gantan',
    source: { book: false },
  },
  // 感叹句
  {
    id: 'gantan-1',
    sentence: '蜜蜂飞到我家花园来了！',
    correctType: 'gantan',
    distractorType: 'chenshu',
    source: { book: true, unit: '第7单元《小蜜蜂》', page: '41-45' },
  },
  {
    id: 'gantan-2',
    sentence: '一来一往，多么有趣！',
    correctType: 'gantan',
    distractorType: 'yiwen',
    source: { book: true, unit: '第6单元《蚂蚁搬小虫》', page: '34-36' },
  },
  {
    id: 'gantan-3',
    sentence: '和着小鸟的歌声，多么动听啊！',
    correctType: 'gantan',
    distractorType: 'chenshu',
    source: { book: true, unit: '第8单元《会唱歌的森林》', page: '47-50' },
  },
  {
    id: 'gantan-4',
    sentence: '你们太不像话了！',
    correctType: 'gantan',
    distractorType: 'qishi',
    source: { book: true, unit: '深广课文《错在哪里》', page: '151-152' },
  },
]

export function examplesForType(type) {
  return QUESTIONS.filter((q) => q.correctType === type)
}

// 给教学导入页「读读比比」用：某句型的第一个例子，配一句它自己标注的易混句型（distractorType）例句，
// 两句都是题库里已核对过的内容，不额外造句。
export function comparisonForType(type) {
  const base = examplesForType(type)[0]
  if (!base) return null
  const other = examplesForType(base.distractorType)[0]
  if (!other) return null
  return { base, other }
}

export function pickRound(count = 10) {
  const pool = [...QUESTIONS]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picked = []
  while (picked.length < count) {
    picked.push(...pool)
  }
  return picked.slice(0, count)
}
