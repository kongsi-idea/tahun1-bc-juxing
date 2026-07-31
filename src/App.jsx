import { useState } from 'react'
import { useCamera } from './lib/useCamera.js'
import { pickRound } from './data/questions.js'
import { loadLeaderboard, saveScore } from './lib/leaderboard.js'
import CameraFeed from './components/CameraFeed.jsx'
import IntroScreen from './components/IntroScreen.jsx'
import GroupSetup from './components/GroupSetup.jsx'
import GameRound from './components/GameRound.jsx'
import RoundResult from './components/RoundResult.jsx'
import LeaderboardScreen from './components/LeaderboardScreen.jsx'

export default function App() {
  const [phase, setPhase] = useState('intro') // intro | setup | round | result | leaderboard
  const [groupName, setGroupName] = useState('')
  const [questions, setQuestions] = useState([])
  const [lastScore, setLastScore] = useState(0)
  const [entries, setEntries] = useState(() => loadLeaderboard())

  const cameraActive = phase === 'setup' || phase === 'round'
  const camera = useCamera({ active: cameraActive, numPoses: 8 })

  // 摄像头画面只在这里挂一次、贯穿分组→答题两个阶段，避免切换画面时 <video> 元素被卸载重建，
  // 导致串流没重新接上（useCamera 只在 active 变化时跑一次绑定逻辑，不会跟着新的 DOM 节点走）。
  return (
    <>
      {cameraActive && <CameraFeed {...camera} />}

      {phase === 'intro' && <IntroScreen onDone={() => setPhase('setup')} />}

      {phase === 'setup' && (
        <GroupSetup
          camera={camera}
          onStart={(name) => {
            setGroupName(name)
            setQuestions(pickRound(10))
            setPhase('round')
          }}
        />
      )}

      {phase === 'round' && (
        <GameRound
          camera={camera}
          questions={questions}
          onFinish={(score) => {
            setLastScore(score)
            setEntries(saveScore(groupName, score))
            setPhase('result')
          }}
        />
      )}

      {phase === 'result' && (
        <RoundResult
          groupName={groupName}
          score={lastScore}
          total={questions.length}
          onPlayAgain={() => setPhase('setup')}
          onViewLeaderboard={() => setPhase('leaderboard')}
        />
      )}

      {phase === 'leaderboard' && <LeaderboardScreen entries={entries} onBack={() => setPhase('setup')} />}
    </>
  )
}
