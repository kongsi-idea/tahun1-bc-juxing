// 全屏背景层：摄像头画面铺满整个视窗，其他画面（题目、分区、结果）都是浮在它上面的半透明图层。
export default function CameraFeed({ videoRef, canvasRef, status, errorMessage }) {
  return (
    <div className="fixed inset-0 bg-black">
      <video ref={videoRef} className="w-full h-full object-cover -scale-x-100" muted playsInline />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -scale-x-100" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-display text-2xl">
          摄像头启动中…
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center p-4 font-display text-xl">
          摄像头无法启动：{errorMessage}
          <br />
          请检查浏览器是否允许使用摄像头。
        </div>
      )}
    </div>
  )
}
