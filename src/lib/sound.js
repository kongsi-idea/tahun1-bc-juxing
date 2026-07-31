// 全部用 Web Audio API 现场合成音效，不依赖任何外部音档/CDN，跟摄像头模型一样「课堂网络不稳也能用」。
let ctx = null
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

// 浏览器要求音讯必须在真实的使用者点击后才解锁，在「开始这一轮」按钮点击时调用一次。
export function unlockAudio() {
  const audioCtx = getCtx()
  if (audioCtx.state === 'suspended') audioCtx.resume()
}

export function playTick(secondsLeft) {
  const audioCtx = getCtx()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  // 用纯净的 sine 波（原本的 square 波音色偏刺耳、听起来像噪音），干净的「嘟」声
  osc.type = 'sine'
  osc.frequency.value = 440 + (5 - secondsLeft) * 80 // 越接近 0 音调越高，营造紧迫感
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime)
  gain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15)
  osc.start()
  osc.stop(audioCtx.currentTime + 0.15)
}

export function playResult(correct) {
  const audioCtx = getCtx()
  const notes = correct ? [523.25, 659.25, 783.99] : [300, 210]
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.type = correct ? 'triangle' : 'sawtooth'
    osc.frequency.value = freq
    const start = audioCtx.currentTime + i * 0.12
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.linearRampToValueAtTime(0.22, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3)
    osc.start(start)
    osc.stop(start + 0.32)
  })
}

// 常驻背景音乐：C 大调五声音阶的活泼旋律 + 下方和声音（两条音轨同时响，不是单音 mono），
// 音量压低，从「开始这一轮」点击后一路播到底，跟倒数期间额外叠加的紧张低音（startTension）是独立音轨。
const MELODY = [659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 659.25, 523.25] // E5 G5 A5 G5 E5 D5 E5 C5，跳跃感的愉快旋律
const HARMONY = [261.63, null, 392.0, null, 440.0, null, 392.0, null] // C4 / G4 / A4 隔拍衬底，撑出和声厚度
const NOTE_MS = 300
let bgMusic = null

function playVoice(freq, atTime, durationSec, type, peakGain) {
  const audioCtx = getCtx()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, atTime)
  gain.gain.linearRampToValueAtTime(peakGain, atTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, atTime + durationSec)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(atTime)
  osc.stop(atTime + durationSec + 0.02)
}

export function startBackgroundMusic() {
  if (bgMusic) return
  const state = { cancelled: false, timerId: null, i: 0 }
  bgMusic = state

  const playStep = () => {
    if (state.cancelled) return
    const audioCtx = getCtx()
    const now = audioCtx.currentTime
    const step = state.i % MELODY.length
    playVoice(MELODY[step], now, NOTE_MS / 1000, 'triangle', 0.06)
    const harmonyFreq = HARMONY[step]
    if (harmonyFreq) playVoice(harmonyFreq, now, (NOTE_MS * 2) / 1000, 'sine', 0.045)
    state.i += 1
    state.timerId = setTimeout(playStep, NOTE_MS)
  }
  playStep()
}

export function stopBackgroundMusic() {
  if (!bgMusic) return
  bgMusic.cancelled = true
  clearTimeout(bgMusic.timerId)
  bgMusic = null
}

// 倒数期间的紧张背景音：两个略微失谐的低音正弦波叠在一起，靠"拍频"制造若有若无的悬疑感，
// 原本用 sawtooth（锯齿波）谐波太丰富，听起来像刺耳的噪音，换成 sine（纯音）干净很多。
let tension = null
export function startTension() {
  if (tension) return
  const audioCtx = getCtx()
  const osc1 = audioCtx.createOscillator()
  const osc2 = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc1.type = 'sine'
  osc1.frequency.value = 110
  osc2.type = 'sine'
  osc2.frequency.value = 110 * 1.03
  gain.gain.value = 0
  osc1.connect(gain)
  osc2.connect(gain)
  gain.connect(audioCtx.destination)
  osc1.start()
  osc2.start()
  gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.2)
  tension = { osc1, osc2, gain }
}

export function stopTension() {
  if (!tension) return
  const { osc1, osc2, gain } = tension
  const audioCtx = getCtx()
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25)
  osc1.stop(audioCtx.currentTime + 0.3)
  osc2.stop(audioCtx.currentTime + 0.3)
  tension = null
}
