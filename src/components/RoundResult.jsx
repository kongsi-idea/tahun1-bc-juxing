export default function RoundResult({ groupName, score, total, onPlayAgain, onViewLeaderboard }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="font-display text-3xl">「{groupName}」这一轮</h1>
      <div className="font-display text-7xl font-bold" style={{ color: 'var(--color-qishi)' }}>
        {score} / {total}
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={onPlayAgain}
          className="font-display text-xl font-semibold px-8 py-3 rounded-full text-white"
          style={{ background: 'var(--color-ink)' }}
        >
          换下一组
        </button>
        <button
          onClick={onViewLeaderboard}
          className="font-display text-xl font-semibold px-8 py-3 rounded-full border-4"
          style={{ borderColor: 'var(--color-ink)' }}
        >
          看排行榜
        </button>
      </div>
    </div>
  )
}
