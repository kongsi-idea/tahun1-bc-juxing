import { useEffect, useRef, useState } from 'react'
import { loadPoseLandmarker, classifyZones } from './poseDetection.js'

// 摄像头画面全程只在本机处理：video 只挂在本地 <video>，姿态推理在浏览器内跑，
// 从头到尾没有任何 fetch/上传动作把影像传出这台电脑。
export function useCamera({ active, numPoses = 8 }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const zonesRef = useRef({ left: 0, right: 0, buffer: 0, total: 0 })
  const [zones, setZones] = useState({ left: 0, right: 0, buffer: 0, total: 0 })
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!active) return undefined
    let stream
    let rafId
    let cancelled = false

    async function start() {
      setStatus('loading')
      try {
        const landmarker = await loadPoseLandmarker(numPoses)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        const video = videoRef.current
        video.srcObject = stream
        await video.play()
        setStatus('ready')

        const loop = () => {
          if (cancelled) return
          if (video.readyState >= 2) {
            const result = landmarker.detectForVideo(video, performance.now())
            const nextZones = classifyZones(result)
            zonesRef.current = nextZones
            setZones(nextZones)

            const canvas = canvasRef.current
            if (canvas) drawOverlay(canvas, video, result)
          }
          rafId = requestAnimationFrame(loop)
        }
        rafId = requestAnimationFrame(loop)
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(err?.message || '无法启动摄像头')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      if (stream) stream.getTracks().forEach((t) => t.stop())
      setStatus('idle')
    }
  }, [active, numPoses])

  // 供倒数结束那一刻读取"当下"的判定结果，避免闭包拿到旧值
  const sampleZones = () => zonesRef.current

  return { videoRef, canvasRef, zones, status, errorMessage, sampleZones }
}

// 抓的是整个人的身体骨架（33 个关键点：肩膀、髋部、膝盖…），不是脸部辨识，
// 用一个框住全身的方框当视觉回馈，让老师一眼确认摄像头真的抓到几个人、抓到谁。
function drawOverlay(canvas, video, result) {
  const ctx = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const poses = result?.landmarks ?? []
  ctx.lineWidth = 4
  ctx.strokeStyle = '#00e5ff'

  // 注意：canvas 本身用 CSS 镜像显示（跟 video 对齐），文字如果画在这里会变成镜像反字，
  // 所以只画对称的方框，不在 canvas 上画数字/文字标签。
  poses.forEach((landmarks) => {
    const visible = landmarks.filter((p) => (p.visibility ?? 1) > 0.4)
    const points = visible.length >= 6 ? visible : landmarks
    let minX = 1
    let maxX = 0
    let minY = 1
    let maxY = 0
    for (const p of points) {
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
      if (p.y < minY) minY = p.y
      if (p.y > maxY) maxY = p.y
    }
    const pad = 0.02
    const x = Math.max(0, minX - pad) * canvas.width
    const y = Math.max(0, minY - pad) * canvas.height
    const w = Math.min(1, maxX - minX + pad * 2) * canvas.width
    const h = Math.min(1, maxY - minY + pad * 2) * canvas.height
    ctx.strokeRect(x, y, w, h)
  })
}
