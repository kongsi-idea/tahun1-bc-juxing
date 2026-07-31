export default function LeaderboardScreen({ entries, onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gap-6">
      <h1 className="font-display text-4xl font-semibold">排行榜</h1>
      <p className="text-slate-500 text-sm max-w-md text-center">
        提醒：这个排行榜只存在这台电脑的这个浏览器里，换电脑、换浏览器或清除浏览器资料都会不见，不是共享云端排行榜。
      </p>

      <ol className="w-full max-w-md space-y-2">
        {entries.length === 0 && <li className="text-center text-slate-400">还没有任何组别的成绩</li>}
        {entries.map((e, i) => (
          <li
            key={`${e.groupName}-${e.at}`}
            className="flex justify-between items-center rounded-2xl border-4 px-5 py-3 font-display text-lg"
            style={{ borderColor: 'var(--color-ink)' }}
          >
            <span>
              {i + 1}. {e.groupName}
            </span>
            <span className="font-bold">{e.score} 分</span>
          </li>
        ))}
      </ol>

      <button
        onClick={onBack}
        className="font-display text-xl font-semibold px-10 py-4 rounded-full text-white"
        style={{ background: 'var(--color-ink)' }}
      >
        换下一组
      </button>
    </div>
  )
}
