import { useEffect, useRef, useState } from 'react'
import { SENTENCE_TYPES } from '../data/questions.js'
import { playTick, playResult, startTension, stopTension } from '../lib/sound.js'

const COUNTDOWN_SECONDS = 5
const READY_MS = 1600

function readDuration(sentence) {
  return Math.min(6000, Math.max(2000, 1500 + sentence.length * 150))
}

// 摄像头画面全屏当背景，题目/分区/判定结果都是压在画面上的半透明浮层（AR 风格）。
// 流程：showing（大字读题）→ ready（回到中间站好，缓冲时间）→ choosing（左右分区+5秒倒数+紧张音乐）→ judged。
// 5 秒一到直接读当下摄像头判定的左右人数，不做额外的开局校准确认（先上线看效果，之后视需要再加）。
export default function GameRound({ camera, questions, onFinish }) {
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState('showing') // showing | ready | choosing | judged
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [sides, setSides] = useState(null) // { left: type, right: type }
  const [score, setScore] = useState(0)
  const [judgeResult, setJudgeResult] = useState(null) // { correct, zones, correctSide }

  const question = questions[index]
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const timers = []
    setStage('showing')
    setJudgeResult(null)

    const showMs = readDuration(question.sentence)
    timers.push(
      setTimeout(() => {
        if (cancelled) return
        setStage('ready')
        timers.push(
          setTimeout(() => {
            if (cancelled) return
            const flip = Math.random() < 0.5
            setSides({
              left: flip ? question.correctType : question.distractorType,
              right: flip ? question.distractorType : question.correctType,
            })
            setStage('choosing')
            setCountdown(COUNTDOWN_SECONDS)
            startTension()
          }, READY_MS),
        )
      }, showMs),
    )

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    if (stage !== 'choosing') return undefined
    if (countdown <= 0) {
      stopTension()
      const zones = camera.sampleZones()
      const correctSide = sides.left === question.correctType ? 'left' : 'right'
      const correct = zones.total > 0 && zones[correctSide] === zones.total
      playResult(correct)
      if (correct) setScore((s) => s + 1)
      setJudgeResult({ correct, zones, correctSide })
      setStage('judged')
      timerRef.current = setTimeout(() => {
        if (index + 1 >= questions.length) {
          onFinish(score + (correct ? 1 : 0))
        } else {
          setIndex((i) => i + 1)
        }
      }, 2200)
      return undefined
    }
    playTick(countdown)
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, countdown])

  useEffect(
    () => () => {
      clearTimeout(timerRef.current)
      stopTension()
    },
    [],
  )

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex justify-center pt-4">
        <div className="font-display text-white bg-black/45 backdrop-blur-sm rounded-full px-5 py-2 text-lg">
          第 {index + 1} / {questions.length} 题 · 目前 {score} 分
        </div>
      </div>

      {stage === 'showing' && (
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="font-display text-4xl md:text-6xl text-center max-w-4xl leading-relaxed text-white bg-black/45 backdrop-blur-sm rounded-3xl px-10 py-10">
            {question.sentence}
          </p>
        </div>
      )}

      {stage !== 'showing' && (
        <div className="flex justify-center mt-4">
          <p className="font-display text-xl text-center max-w-2xl text-white bg-black/45 backdrop-blur-sm rounded-full px-6 py-2">
            {question.sentence}
          </p>
        </div>
      )}

      {stage === 'ready' && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="font-display text-3xl md:text-4xl text-center text-white bg-black/45 backdrop-blur-sm rounded-3xl px-10 py-8 animate-pulse">
            回到中间站好，准备作答！
          </div>
        </div>
      )}

      {(stage === 'choosing' || stage === 'judged') && (
        <>
          <div className="flex-1 relative">
            <ZoneOverlay side="left" type={sides?.left} judgeResult={judgeResult} />
            <ZoneOverlay side="right" type={sides?.right} judgeResult={judgeResult} />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="font-display text-5xl font-bold text-white bg-black/50 backdrop-blur-sm rounded-full w-28 h-28 flex items-center justify-center">
                {stage === 'choosing' ? countdown : judgeResult?.correct ? '✔' : '✘'}
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-4">
            <div className="text-white bg-black/45 backdrop-blur-sm rounded-full px-5 py-2 text-sm">
              侦测到左 {camera.zones.left} 人 · 中间待定 {camera.zones.buffer} 人 · 右 {camera.zones.right} 人
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ZoneOverlay({ side, type, judgeResult }) {
  if (!type) return null
  const t = SENTENCE_TYPES[type]
  const judged = Boolean(judgeResult)
  const isCorrectSide = judgeResult?.correctSide === side

  let background
  if (judged && isCorrectSide) background = 'color-mix(in srgb, var(--color-correct) 65%, transparent)'
  else if (judged) background = 'rgba(0,0,0,0.55)'
  else background = `color-mix(in srgb, ${t.color} 40%, transparent)`

  return (
    <div
      className={`absolute top-0 bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} w-1/2 flex flex-col items-center justify-center gap-2 transition-colors duration-300 ${judged && isCorrectSide ? 'zone-correct-flash' : ''}`}
      style={{ background }}
    >
      <div className="font-display text-white/90 text-lg">{side === 'left' ? '← 跳左边' : '跳右边 →'}</div>
      <div className="font-display text-4xl font-bold text-white drop-shadow-lg">{t.label}</div>
      <div className="text-white/90">{t.hint}</div>
    </div>
  )
}
