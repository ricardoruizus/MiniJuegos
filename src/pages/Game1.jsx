import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Game1.module.css'

const TOTAL_AUTO = 20

export default function Game1() {
  const [history, setHistory] = useState([])          // 'H' | 'T'
  const [prediction, setPrediction] = useState(null)  // 'H' | 'T'
  const [flipping, setFlipping] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [coinFace, setCoinFace] = useState('H')
  const [autoRunning, setAutoRunning] = useState(false)
  const [showMythBreak, setShowMythBreak] = useState(false)
  const autoRef = useRef(null)

  const headsCount = history.filter(r => r === 'H').length
  const tailsCount = history.filter(r => r === 'T').length
  const total = history.length
  const headsPercent = total ? ((headsCount / total) * 100).toFixed(1) : 50
  const tailsPercent = total ? ((tailsCount / total) * 100).toFixed(1) : 50

  const doFlip = useCallback((pred) => {
    const result = Math.random() < 0.5 ? 'H' : 'T'
    setCoinFace(result)
    setLastResult(result)
    setHistory(prev => {
      const next = [...prev, result].slice(-50)
      if (next.length >= 30) setShowMythBreak(true)
      return next
    })
    if (pred !== null) {
      if (result === pred) setHits(h => h + 1)
      else setMisses(m => m + 1)
    }
    return result
  }, [])

  const handleFlipOne = () => {
    if (flipping || autoRunning) return
    setFlipping(true)
    setTimeout(() => {
      doFlip(prediction)
      setFlipping(false)
    }, 600)
  }

  const handleFlip20 = () => {
    if (flipping || autoRunning) return
    setAutoRunning(true)
    let count = 0
    const interval = setInterval(() => {
      setFlipping(true)
      setTimeout(() => {
        doFlip(prediction)
        setFlipping(false)
        count++
        if (count >= TOTAL_AUTO) {
          clearInterval(interval)
          setAutoRunning(false)
        }
      }, 300)
    }, 400)
    autoRef.current = interval
  }

  const handleReset = () => {
    clearInterval(autoRef.current)
    setHistory([])
    setPrediction(null)
    setFlipping(false)
    setLastResult(null)
    setHits(0)
    setMisses(0)
    setCoinFace('H')
    setAutoRunning(false)
    setShowMythBreak(false)
  }

  const lastFive = history.slice(-5)
  const streak = (() => {
    if (history.length < 2) return null
    let s = 1
    for (let i = history.length - 2; i >= 0; i--) {
      if (history[i] === history[history.length - 1]) s++
      else break
    }
    return s >= 3 ? { val: s, face: history[history.length - 1] } : null
  })()

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>← Volver</Link>
        <div className={styles.mythBadge}>🪙 Juego 1</div>
      </div>

      <div className={styles.container}>
        {/* Title block */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>La Falacia del Jugador</h1>
          <div className={styles.mythCard}>
            <span className={styles.mythLabel}>El Mito</span>
            <p className={styles.mythText}>
              "Si algo ha pasado muchas veces seguidas, ahora es <em>menos probable</em> que vuelva a pasar."
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          {/* LEFT — Coin + controls */}
          <div className={styles.leftPanel}>

            {/* Streak warning */}
            {streak && (
              <div className={styles.streakAlert}>
                ⚡ ¡{streak.val} {streak.face === 'H' ? 'Caras' : 'Cruces'} seguidas!
                <br />
                <span>¿Cambia la probabilidad del siguiente?</span>
              </div>
            )}

            {/* Coin */}
            <div className={styles.coinWrapper}>
              <div className={`${styles.coin} ${flipping ? styles.flipping : ''}`}>
                <div className={`${styles.coinFace} ${styles.coinFront}`}>
                  <span>😊</span>
                  <small>CARA</small>
                </div>
                <div className={`${styles.coinFace} ${styles.coinBack}`}>
                  <span>🦅</span>
                  <small>CRUZ</small>
                </div>
              </div>
            </div>

            {lastResult && !flipping && (
              <div className={styles.lastResult}>
                Resultado: <strong>{lastResult === 'H' ? '😊 CARA' : '🦅 CRUZ'}</strong>
              </div>
            )}

            {/* Prediction */}
            <div className={styles.predSection}>
              <p className={styles.predLabel}>Tu predicción (opcional):</p>
              <div className={styles.predBtns}>
                <button
                  className={`${styles.predBtn} ${prediction === 'H' ? styles.predActive : ''}`}
                  onClick={() => setPrediction(p => p === 'H' ? null : 'H')}
                >😊 Cara</button>
                <button
                  className={`${styles.predBtn} ${prediction === 'T' ? styles.predActive : ''}`}
                  onClick={() => setPrediction(p => p === 'T' ? null : 'T')}
                >🦅 Cruz</button>
              </div>
            </div>

            {/* Action buttons */}
            <div className={styles.actionBtns}>
              <button
                className={styles.btnPrimary}
                onClick={handleFlipOne}
                disabled={flipping || autoRunning}
              >
                {flipping ? 'Lanzando…' : 'Lanzar × 1'}
              </button>
              <button
                className={styles.btnSecondary}
                onClick={handleFlip20}
                disabled={flipping || autoRunning}
              >
                {autoRunning ? 'Lanzando 20…' : 'Lanzar × 20'}
              </button>
            </div>

            <button className={styles.btnReset} onClick={handleReset}>
              ↺ Reiniciar
            </button>
          </div>

          {/* RIGHT — Stats */}
          <div className={styles.rightPanel}>

            {/* Score */}
            <div className={styles.scoreGrid}>
              <div className={styles.scoreCard}>
                <span className={styles.scoreNum}>{total}</span>
                <span className={styles.scoreLbl}>Lanzamientos</span>
              </div>
              <div className={`${styles.scoreCard} ${styles.scoreGreen}`}>
                <span className={styles.scoreNum}>{hits}</span>
                <span className={styles.scoreLbl}>Aciertos</span>
              </div>
              <div className={`${styles.scoreCard} ${styles.scoreRed}`}>
                <span className={styles.scoreNum}>{misses}</span>
                <span className={styles.scoreLbl}>Fallos</span>
              </div>
            </div>

            {/* 50/50 bars */}
            <div className={styles.statsBlock}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>😊 Cara</span>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${styles.barHeads}`}
                    style={{ width: `${headsPercent}%` }}
                  />
                </div>
                <span className={styles.statVal}>{headsCount} <em>({headsPercent}%)</em></span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>🦅 Cruz</span>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${styles.barTails}`}
                    style={{ width: `${tailsPercent}%` }}
                  />
                </div>
                <span className={styles.statVal}>{tailsCount} <em>({tailsPercent}%)</em></span>
              </div>
              <div className={styles.fiftyLine}>
                <span>50%</span>
                <div className={styles.fiftyDash} />
                <span>50%</span>
              </div>
            </div>

            {/* Last 5 history */}
            {lastFive.length > 0 && (
              <div className={styles.historyBlock}>
                <p className={styles.historyLabel}>Últimos lanzamientos:</p>
                <div className={styles.historyChips}>
                  {lastFive.map((r, i) => (
                    <span key={i} className={`${styles.chip} ${r === 'H' ? styles.chipH : styles.chipT}`}>
                      {r === 'H' ? '😊' : '🦅'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full history mini dots */}
            {history.length > 0 && (
              <div className={styles.dotHistory}>
                {history.map((r, i) => (
                  <div key={i} className={`${styles.dot} ${r === 'H' ? styles.dotH : styles.dotT}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Myth break conclusion */}
        {showMythBreak && (
          <div className={styles.conclusion}>
            <div className={styles.conclusionIcon}>💡</div>
            <h3>Mito Roto</h3>
            <p>
              Después de <strong>{total} lanzamientos</strong>, la moneda sigue cayendo cerca del <strong>50%</strong> para cada lado.
              Los eventos pasados <em>no afectan</em> el siguiente lanzamiento.
              La moneda no tiene memoria.
            </p>
            <p className={styles.conceptTag}>
              Concepto: <strong>Independencia de eventos</strong> · <strong>Probabilidad constante</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
