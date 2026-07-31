import { useState } from 'react'
import { SENTENCE_TYPES, examplesForType, comparisonForType } from '../data/questions.js'

const ORDER = ['chenshu', 'yiwen', 'qishi', 'gantan']

// 双模式设计：学生自己点卡片探索也顺手；老师投影时，点开一个句型整页切换，念给全班听、
// 带全班一起读例句、猜语气，同一份东西两种用法都撑得住，不是纯讲稿念白。
export default function IntroScreen({ onDone }) {
  const [activeType, setActiveType] = useState(null)

  if (activeType) {
    return (
      <TypeDetail
        type={activeType}
        onBack={() => setActiveType(null)}
        onNav={(key) => setActiveType(key)}
        onDone={onDone}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gap-8">
      <header className="text-center max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold" style={{ color: 'var(--color-ink)' }}>
          句子在说什么心情？
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          一句话，可以说明事实、可以发问、可以请求别人、也可以抒发心情。
          点点看下面四张卡片，进去看看每种句子的例子和读法。
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {ORDER.map((key) => {
          const t = SENTENCE_TYPES[key]
          return (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className="rounded-3xl p-6 text-left border-4 transition-transform hover:-translate-y-1 shadow-md bg-white"
              style={{ borderColor: t.color }}
            >
              <div className="font-display text-2xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                {t.label}
              </div>
              <div className="mt-1 text-sm text-slate-600">{t.hint}</div>
            </button>
          )
        })}
      </section>

      <button
        onClick={onDone}
        className="font-display text-xl font-semibold px-10 py-4 rounded-full text-white shadow-lg"
        style={{ background: 'var(--color-ink)' }}
      >
        我准备好了，开始分组！
      </button>
    </div>
  )
}

function TypeDetail({ type, onBack, onNav, onDone }) {
  const t = SENTENCE_TYPES[type]
  const examples = examplesForType(type)
  const compare = comparisonForType(type)
  const idx = ORDER.indexOf(type)
  const prevKey = ORDER[(idx - 1 + ORDER.length) % ORDER.length]
  const nextKey = ORDER[(idx + 1) % ORDER.length]

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8 gap-6" style={{ background: `color-mix(in srgb, ${t.color} 12%, #FFF8EC)` }}>
      <div className="w-full max-w-3xl flex justify-between items-center">
        <button onClick={onBack} className="font-display text-slate-600 hover:text-slate-900">
          ← 回总览
        </button>
        <div className="flex gap-2">
          <button onClick={() => onNav(prevKey)} className="font-display px-4 py-2 rounded-full border-2" style={{ borderColor: t.color }}>
            ← 上一个
          </button>
          <button onClick={() => onNav(nextKey)} className="font-display px-4 py-2 rounded-full border-2" style={{ borderColor: t.color }}>
            下一个 →
          </button>
        </div>
      </div>

      <header className="text-center">
        <div
          className="font-display inline-block text-5xl font-bold px-8 py-3 rounded-3xl text-white shadow-md"
          style={{ background: t.color }}
        >
          {t.label}
        </div>
        <p className="mt-3 text-lg text-slate-700">{t.hint}</p>
        <p className="mt-1 text-slate-500">
          标点：{t.punctuation} ｜ 朗读语气：{t.tone}
        </p>
      </header>

      <section className="w-full max-w-3xl rounded-3xl border-4 bg-white p-6" style={{ borderColor: t.color }}>
        <h2 className="font-display text-2xl font-semibold mb-4">课本例句</h2>
        <div className="space-y-3">
          {examples.map((q) => (
            <div key={q.id} className="rounded-2xl bg-slate-50 px-5 py-3 flex justify-between items-center gap-3">
              <span className="font-display text-xl">{q.sentence}</span>
              {q.source.book && (
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {q.source.unit} · 第{q.source.page}页
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {compare && (
        <section className="w-full max-w-3xl rounded-3xl border-4 p-6 bg-white" style={{ borderColor: 'var(--color-ink)' }}>
          <h2 className="font-display text-2xl font-semibold mb-2">读读比比：容易搞混的两种句型</h2>
          {compare.base.source.book && (
            <p className="text-slate-500 mb-4 text-sm">
              课本第{compare.base.source.page}页 {compare.base.source.unit}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CompareCard sentence={compare.base.sentence} type={compare.base.correctType} />
            <CompareCard sentence={compare.other.sentence} type={compare.other.correctType} />
          </div>
        </section>
      )}

      <button
        onClick={onDone}
        className="font-display text-xl font-semibold px-10 py-4 rounded-full text-white shadow-lg"
        style={{ background: 'var(--color-ink)' }}
      >
        我准备好了，开始分组！
      </button>
    </div>
  )
}

function CompareCard({ sentence, type }) {
  const t = SENTENCE_TYPES[type]
  return (
    <div className="rounded-2xl border-4 p-4 text-center" style={{ borderColor: t.color }}>
      <div className="font-display text-xl">{sentence}</div>
      <div className="mt-2 font-semibold" style={{ color: t.color }}>
        {t.label} · {t.hint}
      </div>
    </div>
  )
}
