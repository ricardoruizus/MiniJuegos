import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Game2.module.css'

// Roulette numbers 0-36 with colors
const SLOTS = [
  { n: 0,  c: 'green' },
  { n: 32, c: 'red'   }, { n: 15, c: 'black' }, { n: 19, c: 'red'   },
  { n: 4,  c: 'black' }, { n: 21, c: 'red'   }, { n: 2,  c: 'black' },
  { n: 25, c: 'red'   }, { n: 17, c: 'black' }, { n: 34, c: 'red'   },
  { n: 6,  c: 'black' }, { n: 27, c: 'red'   }, { n: 13, c: 'black' },
  { n: 36, c: 'red'   }, { n: 11, c: 'black' }, { n: 30, c: 'red'   },
  { n: 8,  c: 'black' }, { n: 23, c: 'red'   }, { n: 10, c: 'black' },
  { n: 5,  c: 'red'   }, { n: 24, c: 'black' }, { n: 16, c: 'red'   },
  { n: 33, c: 'black' }, { n: 1,  c: 'red'   }, { n: 20, c: 'black' },
  { n: 14, c: 'red'   }, { n: 31, c: 'black' }, { n: 9,  c: 'red'   },
  { n: 22, c: 'black' }, { n: 18, c: 'red'   }, { n: 29, c: 'black' },
  { n: 7,  c: 'red'   }, { n: 28, c: 'black' }, { n: 12, c: 'red'   },
  { n: 35, c: 'black' }, { n: 3,  c: 'red'   }, { n: 26, c: 'black' },
]

const STARTING_CHIPS = 100
const DEBT_LIMIT = -1000
const BET_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const COLOR_EMOJI = { red: '🔴', black: '⚫', green: '🟢' }
const COLOR_ODDS  = { red: 18/37, black: 18/37, green: 1/37 }
const COLOR_PAYS  = { red: 2, black: 2, green: 14 }  // multiplier on bet

export default function Game2() {
  const [chips, setChips]           = useState(STARTING_CHIPS)
  const [bet, setBet]               = useState(10)
  const [betColor, setBetColor]     = useState(null)
  const [spinning, setSpinning]     = useState(false)
  const [result, setResult]         = useState(null)    // { n, c }
  const [history, setHistory]       = useState([])      // [{n,c,bet,betColor,won,delta,balance}]
  const [retired, setRetired]       = useState(false)
  const [rotation, setRotation]     = useState(0)
  const [ballAngle, setBallAngle]   = useState(0)
  const [showConclusion, setShowConclusion] = useState(false)
  const spinRef = useRef(null)
  const totalSpins = history.length
  const totalWon  = history.filter(h => h.won).length
  const totalLost = history.filter(h => !h.won).length
  const netChange = chips - STARTING_CHIPS
  const canBet = !spinning && !retired && chips > DEBT_LIMIT && betColor !== null
  const isInDebt = chips < 0

  const handleSpin = () => {
    if (!canBet) return
    const actualBet = Math.min(bet, chips - DEBT_LIMIT)
    // pick random slot
    const idx = Math.floor(Math.random() * SLOTS.length)
    const landed = SLOTS[idx]

    // animate wheel
    const extraDeg = 1440 + (idx / SLOTS.length) * 360
    const newRot = rotation + extraDeg
    setRotation(newRot)
    setBallAngle(prev => prev - extraDeg * 1.3)
    setSpinning(true)

    setTimeout(() => {
      const won = landed.c === betColor
      const delta = won ? actualBet * (COLOR_PAYS[betColor] - 1) : -actualBet
      const newBalance = chips + delta

      setResult(landed)
      setChips(newBalance)
      setHistory(prev => {
        const next = [...prev, {
          n: landed.n, c: landed.c,
          bet: actualBet, betColor, won, delta,
          balance: newBalance
        }]
        if (next.length >= 15) setShowConclusion(true)
        return next
      })
      setSpinning(false)

      if (newBalance <= DEBT_LIMIT) {
        setTimeout(() => setRetired(true), 800)
      }
    }, 3000)
  }

  const handleRetire = () => setRetired(true)

  const handleReset = () => {
    setChips(STARTING_CHIPS)
    setBet(10)
    setBetColor(null)
    setSpinning(false)
    setResult(null)
    setHistory([])
    setRetired(false)
    setRotation(0)
    setBallAngle(0)
    setShowConclusion(false)
  }

  // Clamp bet so it never exceeds available + debt
  const maxBet = Math.min(100, chips - DEBT_LIMIT)

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>← Volver</Link>
        <div className={styles.mythBadge}>🎡 Juego 2</div>
      </div>

      <div className={styles.container}>
        {/* Title */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>¿Puedes ganarle al Casino?</h1>
          <div className={styles.mythCard}>
            <span className={styles.mythLabel}>El Mito</span>
            <p className={styles.mythText}>
              "Si juegas suficiente tiempo, <em>terminarás ganando</em>."
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          {/* LEFT — Roulette + controls */}
          <div className={styles.leftPanel}>

            {/* Chip counter */}
            <div className={`${styles.chipCounter} ${isInDebt ? styles.chipDebt : chips > STARTING_CHIPS ? styles.chipUp : ''}`}>
              <span className={styles.chipIcon}>🪙</span>
              <span className={styles.chipAmt}>{chips}</span>
              <span className={styles.chipLbl}>fichas</span>
              {isInDebt && <span className={styles.debtBadge}>EN DEUDA</span>}
            </div>

            {/* Roulette wheel */}
            <div className={styles.wheelContainer}>
              <div
                className={styles.wheel}
                style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 1)' : 'none' }}
              >
                {SLOTS.map((slot, i) => {
                  const angle = (i / SLOTS.length) * 360
                  return (
                    <div
                      key={i}
                      className={`${styles.wheelSegment} ${styles[`seg_${slot.c}`]}`}
                      style={{
                        transform: `rotate(${angle}deg)`,
                        '--seg-count': SLOTS.length,
                      }}
                    >
                      <span className={styles.segNum}>{slot.n}</span>
                    </div>
                  )
                })}
              </div>
              {/* Ball */}
              <div
                className={styles.ballOrbit}
                style={{ transform: `rotate(${ballAngle}deg)`, transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 1)' : 'none' }}
              >
                <div className={styles.ball} />
              </div>
              {/* Center hub */}
              <div className={styles.hub}>
                {spinning ? (
                  <span className={styles.hubSpin}>⟳</span>
                ) : result ? (
                  <>
                    <span className={styles.hubNum}>{result.n}</span>
                    <span className={`${styles.hubColor} ${styles[`hub_${result.c}`]}`}>
                      {result.c.toUpperCase()}
                    </span>
                  </>
                ) : (
                  <span className={styles.hubIdle}>?</span>
                )}
              </div>
            </div>

            {/* Result feedback */}
            {result && !spinning && (
              <div className={`${styles.resultBanner} ${history.at(-1)?.won ? styles.bannerWin : styles.bannerLoss}`}>
                {history.at(-1)?.won
                  ? `✅ ¡Ganaste ${history.at(-1)?.delta} fichas!`
                  : `❌ Perdiste ${Math.abs(history.at(-1)?.delta)} fichas`}
              </div>
            )}

            {/* Bet controls */}
            {!retired && (
              <>
                <div className={styles.betSection}>
                  <p className={styles.betLabel}>Elige tu apuesta:</p>
                  <div className={styles.betGrid}>
                    {BET_STEPS.filter(s => s <= maxBet).map(s => (
                      <button
                        key={s}
                        className={`${styles.betChip} ${bet === s ? styles.betChipActive : ''}`}
                        onClick={() => setBet(s)}
                        disabled={spinning}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.colorSection}>
                  <p className={styles.betLabel}>Apuesta a:</p>
                  <div className={styles.colorBtns}>
                    {['red', 'black', 'green'].map(c => (
                      <button
                        key={c}
                        className={`${styles.colorBtn} ${styles[`colorBtn_${c}`]} ${betColor === c ? styles.colorBtnActive : ''}`}
                        onClick={() => setBetColor(bc => bc === c ? null : c)}
                        disabled={spinning}
                      >
                        {COLOR_EMOJI[c]}
                        <span>{c === 'red' ? 'Rojo' : c === 'black' ? 'Negro' : 'Verde'}</span>
                        <small>{c === 'green' ? '×14' : '×2'}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.actionRow}>
                  <button
                    className={styles.spinBtn}
                    onClick={handleSpin}
                    disabled={!canBet}
                  >
                    {spinning ? '🎡 Girando…' : '🎡 Girar Ruleta'}
                  </button>
                  <button
                    className={styles.retireBtn}
                    onClick={handleRetire}
                    disabled={spinning || totalSpins === 0}
                  >
                    Retirarme
                  </button>
                </div>
              </>
            )}

            {retired && (
              <div className={styles.retiredBox}>
                <h3>Sesión terminada</h3>
                <div className={styles.retiredStats}>
                  <div className={styles.rStat}>
                    <span className={styles.rStatLbl}>Fichas iniciales</span>
                    <span className={styles.rStatVal}>{STARTING_CHIPS}</span>
                  </div>
                  <div className={styles.rStat}>
                    <span className={styles.rStatLbl}>Fichas finales</span>
                    <span className={`${styles.rStatVal} ${chips > STARTING_CHIPS ? styles.green : styles.red}`}>{chips}</span>
                  </div>
                  <div className={styles.rStat}>
                    <span className={styles.rStatLbl}>Resultado neto</span>
                    <span className={`${styles.rStatVal} ${netChange >= 0 ? styles.green : styles.red}`}>
                      {netChange >= 0 ? '+' : ''}{netChange}
                    </span>
                  </div>
                </div>
                <button className={styles.btnReset} onClick={handleReset}>↺ Nueva partida</button>
              </div>
            )}
          </div>

          {/* RIGHT — Stats & History */}
          <div className={styles.rightPanel}>

            {/* Live stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{totalSpins}</span>
                <span className={styles.statLbl}>Giros</span>
              </div>
              <div className={`${styles.statCard} ${styles.statGreen}`}>
                <span className={styles.statNum}>{totalWon}</span>
                <span className={styles.statLbl}>Victorias</span>
              </div>
              <div className={`${styles.statCard} ${styles.statRed}`}>
                <span className={styles.statNum}>{totalLost}</span>
                <span className={styles.statLbl}>Derrotas</span>
              </div>
              <div className={`${styles.statCard} ${netChange >= 0 ? styles.statGreen : styles.statRed}`}>
                <span className={styles.statNum}>{netChange >= 0 ? '+' : ''}{netChange}</span>
                <span className={styles.statLbl}>Neto</span>
              </div>
            </div>

            {/* Balance chart (simple visual) */}
            {history.length > 1 && (
              <div className={styles.chartBlock}>
                <p className={styles.chartTitle}>Balance a lo largo del tiempo</p>
                <BalanceChart history={history} />
              </div>
            )}

            {/* History table */}
            {history.length > 0 && (
              <div className={styles.historyBlock}>
                <p className={styles.historyTitle}>Últimas jugadas</p>
                <div className={styles.historyList}>
                  {[...history].reverse().slice(0, 10).map((h, i) => (
                    <div key={i} className={`${styles.histRow} ${h.won ? styles.histWin : styles.histLoss}`}>
                      <span className={styles.histNum}>{h.n}</span>
                      <span className={`${styles.histColor} ${styles[`hc_${h.c}`]}`}>{h.c.toUpperCase()}</span>
                      <span className={styles.histBet}>
                        {COLOR_EMOJI[h.betColor]} {h.bet}
                      </span>
                      <span className={`${styles.histDelta} ${h.won ? styles.dGreen : styles.dRed}`}>
                        {h.won ? '+' : ''}{h.delta}
                      </span>
                      <span className={styles.histBalance}>{h.balance} 🪙</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House edge explanation */}
            <div className={styles.edgeCard}>
              <p className={styles.edgeTitle}>⚖️ La ventaja de la casa</p>
              <p className={styles.edgeText}>
                En cada giro, el casino tiene una ventaja del <strong>~2.7%</strong>.
                El 0 verde hace que las probabilidades nunca sean exactamente 50/50.
                A largo plazo, <em>la casa siempre gana</em>.
              </p>
              <div className={styles.oddsRow}>
                <span>🔴 Rojo: 18/37 = <strong>48.6%</strong></span>
                <span>⚫ Negro: 18/37 = <strong>48.6%</strong></span>
                <span>🟢 Verde: 1/37 = <strong>2.7%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        {(showConclusion || retired) && history.length >= 5 && (
          <div className={styles.conclusion}>
            <div className={styles.conclusionIcon}>💡</div>
            <h3>Mito Roto</h3>
            <p>
              Tras <strong>{totalSpins} giros</strong>, tu balance es de <strong>{chips} fichas</strong>.
              El casino tiene una ventaja matemática en cada jugada. No importa cuántas veces juegues —
              a largo plazo, la probabilidad trabaja <em>a favor de la casa</em>, no del jugador.
            </p>
            <p className={styles.conceptTag}>
              Concepto: <strong>Ventaja de la casa</strong> · <strong>Valor esperado negativo</strong>
            </p>
            {!retired && (
              <button className={styles.btnReset} onClick={handleReset} style={{ marginTop: '1rem' }}>
                ↺ Nueva partida
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Simple SVG balance chart ──────────────────────────────────
function BalanceChart({ history }) {
  const W = 340, H = 100, PAD = 10
  const balances = [STARTING_CHIPS, ...history.map(h => h.balance)]
  const min = Math.min(...balances, 0)
  const max = Math.max(...balances, STARTING_CHIPS)
  const range = max - min || 1

  const pts = balances.map((b, i) => {
    const x = PAD + (i / (balances.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((b - min) / range) * (H - PAD * 2)
    return `${x},${y}`
  }).join(' ')

  const zeroY = H - PAD - ((0 - min) / range) * (H - PAD * 2)
  const startY = H - PAD - ((STARTING_CHIPS - min) / range) * (H - PAD * 2)
  const lastBalance = balances[balances.length - 1]
  const isDown = lastBalance < STARTING_CHIPS

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg}>
      {/* Zero line */}
      {min < 0 && (
        <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY}
          stroke="#e0525244" strokeWidth="1" strokeDasharray="4 3" />
      )}
      {/* Starting line */}
      <line x1={PAD} y1={startY} x2={W - PAD} y2={startY}
        stroke="#c9a84c33" strokeWidth="1" strokeDasharray="4 3" />
      {/* Area fill */}
      <polygon
        points={`${PAD},${H - PAD} ${pts} ${W - PAD},${H - PAD}`}
        fill={isDown ? '#e0525211' : '#4caf7d11'}
      />
      {/* Line */}
      <polyline
        points={pts}
        fill="none"
        stroke={isDown ? '#e05252' : '#4caf7d'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
