// 排行榜只存在这台电脑的这个浏览器里（localStorage），换电脑/换浏览器/清缓存都会消失，
// 不是跨设备共享的排行榜——这个限制要在 UI 上明确提醒老师。
const STORAGE_KEY = 'tahun1-bc-juxing-leaderboard'

export function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveScore(groupName, score) {
  const entries = loadLeaderboard()
  entries.push({ groupName, score, at: Date.now() })
  entries.sort((a, b) => b.score - a.score)
  const trimmed = entries.slice(0, 20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  return trimmed
}
