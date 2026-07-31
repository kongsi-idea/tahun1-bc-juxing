import { useState } from 'react'
import { unlockAudio, startBackgroundMusic } from '../lib/sound.js'

export default function GroupSetup({ camera, onStart }) {
  const [groupName, setGroupName] = useState('')
  const count = camera.zones.total

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10 gap-6">
        <div className="rounded-3xl bg-black/45 backdrop-blur-sm px-8 py-6 flex flex-col items-center gap-4 text-white">
          <h1 className="font-display text-4xl font-semibold">分组上场</h1>
          <p className="opacity-90">建议 4-8 人一组，站在摄像头能拍到全组的地方。</p>

          <div className="font-display text-2xl font-semibold px-6 py-3 rounded-full border-4 border-white/80">
            侦测到 {count} 人
          </div>

          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="输入组别名字，例如：闪电队"
            className="font-display text-xl text-center px-6 py-3 rounded-full border-4 border-white/80 bg-white/90 text-slate-900 w-full max-w-sm"
          />

          <button
            disabled={!groupName.trim() || camera.status !== 'ready'}
            onClick={() => {
              unlockAudio()
              startBackgroundMusic()
              onStart(groupName.trim())
            }}
            className="font-display text-xl font-semibold px-10 py-4 rounded-full shadow-lg disabled:opacity-40"
            style={{ background: 'var(--color-qishi)', color: 'var(--color-ink)' }}
          >
            开始这一轮（10 题）
          </button>
      </div>
    </div>
  )
}
