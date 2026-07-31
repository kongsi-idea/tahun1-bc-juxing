import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

// 模型与 wasm 运行时都打包在 public/ 里本机提供，不依赖课堂现场的 CDN 网络。
// 隐私硬性规定：所有姿态推理都在浏览器本机进行，摄像头画面/影像绝不会上传到任何服务器。
const WASM_BASE = `${import.meta.env.BASE_URL}mediapipe/wasm`
const MODEL_PATH = `${import.meta.env.BASE_URL}models/pose_landmarker_lite.task`

let landmarkerPromise = null

export function loadPoseLandmarker(numPoses = 8) {
  if (!landmarkerPromise) {
    landmarkerPromise = FilesetResolver.forVisionTasks(WASM_BASE).then((fileset) =>
      PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          // 老师实测 3 人以上时 GPU delegate 明显漏侦测（只抓到 1-2 人）；官方文件没有明确记载
          // 这个问题，改成 CPU delegate 是待验证的尝试性修复，需要老师重新实测确认是否解决。
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numPoses,
        // 教室场景学生可能离镜头较远、彼此部分遮挡，默认门槛稍微调低一点，换取更容易侦测到全部人。
        minPoseDetectionConfidence: 0.3,
        minPosePresenceConfidence: 0.3,
        minTrackingConfidence: 0.3,
      }),
    )
  }
  return landmarkerPromise
}

// 中线缓冲死区：太靠近中线的人不计入左右任何一侧，避免边界抖动误判
const DEAD_ZONE_RATIO = 0.08

// 用左右髋部关节（landmark 23/24）的中点估计身体重心，比单用鼻子稳（转头不影响判定）
function personCenterX(landmarks) {
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  if (leftHip && rightHip) return (leftHip.x + rightHip.x) / 2
  return landmarks[0]?.x ?? 0.5
}

// landmarks[i].x 是原始镜头画面（未镜像）的 0-1 归一化坐标。
// 画面在 <video> 上用 CSS 做了镜像显示（-scale-x-100）让学生看到「像照镜子」的效果，
// 这样学生往自己的左边跳，画面上的人像也会往左边移动——但这代表原始 x 坐标偏小（画面左侧）
// 对应的其实是学生自己的右手边，所以这里刻意反过来判定，跟镜像显示的方向对齐。
export function classifyZones(result) {
  const zones = { left: 0, right: 0, buffer: 0, total: 0 }
  const poses = result?.landmarks ?? []
  for (const landmarks of poses) {
    const x = personCenterX(landmarks)
    zones.total += 1
    if (x < 0.5 - DEAD_ZONE_RATIO) zones.right += 1
    else if (x > 0.5 + DEAD_ZONE_RATIO) zones.left += 1
    else zones.buffer += 1
  }
  return zones
}
