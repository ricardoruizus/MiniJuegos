import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Game6.module.css'

const INITIAL_FICHAS = 1000
const RARIDADES = [
  { name: 'Legendario', chance: 0.05,  color: '#c9a84c', emoji: '✨' },
  { name: 'Épico',      chance: 0.20,  color: '#a78bfa', emoji: '💜' },
  { name: 'Raro',       chance: 0.50,  color: '#4c8ac9', emoji: '💙' },
  { name: 'Común',      chance: 0.25,  color: '#555',    emoji: '⬜' },
]

function getRaridad() {
  const rnd = Math.random()
  let acc = 0
  for (const r of RARIDADES) {
    acc += r.chance
    if (rnd < acc) return r
  }
  return RARIDADES[RARIDADES.length - 1]
}

export default function Game6() {
  const [fichas, setFichas]           = useState(INITIAL_FICHAS)
  const [mazos, setMazos]             = useState(0)
  const [cartas, setCartas]           = useState(0)
  const [legendarios, setLegendarios] = useState(0)
  const [cartasAbiertas, setCartasAbiertas] = useState([])
  const [progreso, setProgreso]       = useState({ actual: 0, total: 0 })
  const [mensaje, setMensaje]         = useState({ text: 'Compra mazos para abrir cartas y buscar el legendario.', type: 'normal' })
  const [abriendo, setAbriendo]       = useState(false)
  const [showPremio, setShowPremio]   = useState(false)
  const [showConclusion, setShowConclusion] = useState(false)
  const timerRef = useRef(null)

  const comprar = useCallback((cantMazos, costo) => {
    if (fichas < costo || abriendo) return

    const nuevasFichas = fichas - costo
    const nuevosmazos = mazos + cantMazos
    const totalCartas = cantMazos * 10

    setFichas(nuevasFichas)
    setMazos(nuevosmazos)
    setAbriendo(true)
    setProgreso({ actual: 0, total: totalCartas })
    setCartasAbiertas([])

    let cartaCount = cartas
    let legCount = legendarios
    let idx = 0

    const abrir = () => {
      if (idx >= totalCartas) {
        setAbriendo(false)
        setProgreso({ actual: totalCartas, total: totalCartas })
        const probSin = Math.pow(0.95, cartaCount)
        const probAc  = ((1 - probSin) * 100).toFixed(1)
        if (legCount === 0) {
          setMensaje({ text: `${cartaCount} cartas abiertas. Prob. acumulada de al menos un legendario: ${probAc}%. No salió ninguno — no está garantizado.`, type: 'error' })
        } else {
          setMensaje({ text: `${cartaCount} cartas abiertas. Prob. acumulada: ${probAc}%. Conseguiste ${legCount} legendario(s), pero sigue sin ser garantía.`, type: 'success' })
        }
        if (nuevasFichas < 10 || cartaCount >= 200) setShowConclusion(true)
        return
      }

      idx++
      cartaCount++
      const r = getRaridad()
      if (r.name === 'Legendario') {
        legCount++
        setLegendarios(legCount)
        setShowPremio(true)
        setTimeout(() => setShowPremio(false), 1500)
      }
      setCartas(cartaCount)
      setProgreso({ actual: idx, total: totalCartas })
      setCartasAbiertas(prev => [...prev.slice(-19), r])

      timerRef.current = setTimeout(abrir, 40)
    }

    timerRef.current = setTimeout(abrir, 40)
  }, [fichas, mazos, cartas, legendarios, abriendo])

  const reiniciar = () => {
    clearTimeout(timerRef.current)
    setFichas(INITIAL_FICHAS)
    setMazos(0)
    setCartas(0)
    setLegendarios(0)
    setCartasAbiertas([])
    setProgreso({ actual: 0, total: 0 })
    setMensaje({ text: 'Compra mazos para abrir cartas y buscar el legendario.', type: 'normal' })
    setAbriendo(false)
    setShowPremio(false)
    setShowConclusion(false)
  }

  const probAcumulada = cartas > 0
    ? ((1 - Math.pow(0.95, cartas)) * 100).toFixed(1)
    : '0.0'

  const progPct = progreso.total > 0
    ? Math.round((progreso.actual / progreso.total) * 100)
    : 0

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>← Volver</Link>
        <div className={styles.mythBadge}>📦 Juego 6</div>
      </div>

      <div className={styles.container}>
        {/* Title */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Loot Box Simulator</h1>
          <div className={styles.mythCard}>
            <span className={styles.mythLabel}>El Mito</span>
            <p className={styles.mythText}>
              "Si compras muchas cajas, <em>seguro obtendrás el legendario</em>."
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          {/* LEFT — Game */}
          <div className={styles.leftPanel}>

            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{fichas}</span>
                <span className={styles.statLbl}>🪙 Fichas</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{mazos}</span>
                <span className={styles.statLbl}>Mazos</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{cartas}</span>
                <span className={styles.statLbl}>Cartas</span>
              </div>
              <div className={`${styles.statCard} ${legendarios > 0 ? styles.statGold : ''}`}>
                <span className={styles.statNum}>{legendarios}</span>
                <span className={styles.statLbl}>✨ Legendarios</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBlock}>
              <div className={styles.progressHeader}>
                <span>Abriendo mazo...</span>
                <span>{progreso.actual} / {progreso.total}</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progPct}%` }} />
              </div>
            </div>

            {/* Cartas recientes */}
            <div className={styles.cartasBlock}>
              <p className={styles.cartasLabel}>Últimas cartas:</p>
              <div className={styles.cartasGrid}>
                {cartasAbiertas.length === 0
                  ? <span className={styles.cartasEmpty}>—</span>
                  : cartasAbiertas.map((r, i) => (
                    <div
                      key={i}
                      className={styles.carta}
                      style={{ borderColor: r.color + '66', background: r.color + '11' }}
                    >
                      <span>{r.emoji}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Message */}
            <div className={`${styles.message} ${styles[`msg_${mensaje.type}`]}`}>
              {mensaje.text}
            </div>

            {/* Buttons */}
            <div className={styles.actionRow}>
              <button
                className={styles.btnPrimary}
                onClick={() => comprar(1, 10)}
                disabled={fichas < 10 || abriendo}
              >
                📦 1 mazo — 10 🪙
              </button>
              <button
                className={styles.btnPrimary}
                onClick={() => comprar(10, 90)}
                disabled={fichas < 90 || abriendo}
              >
                📦×10 — 90 🪙
              </button>
            </div>
            <button className={styles.btnSecondary} onClick={reiniciar}>
              ↺ Reiniciar
            </button>
          </div>

          {/* RIGHT — Info */}
          <div className={styles.rightPanel}>

            {/* Drop rates */}
            <div className={styles.dropCard}>
              <h3 className={styles.infoTitle}>Probabilidades por carta</h3>
              {RARIDADES.map(r => (
                <div key={r.name} className={styles.dropRow}>
                  <span className={styles.dropEmoji}>{r.emoji}</span>
                  <span className={styles.dropName} style={{ color: r.color }}>{r.name}</span>
                  <div className={styles.dropBarTrack}>
                    <div
                      className={styles.dropBarFill}
                      style={{ width: `${r.chance * 100}%`, background: r.color }}
                    />
                  </div>
                  <span className={styles.dropPct}>{(r.chance * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>

            {/* Accumulated probability */}
            <div className={styles.acumCard}>
              <h3 className={styles.infoTitle}>Prob. acumulada actual</h3>
              <div className={styles.acumDisplay}>
                <span className={styles.acumNum}>{probAcumulada}%</span>
                <span className={styles.acumSub}>de haber obtenido al menos 1 legendario</span>
              </div>
              <div className={styles.acumTrack}>
                <div className={styles.acumFill} style={{ width: `${Math.min(100, parseFloat(probAcumulada))}%` }} />
              </div>
              <p className={styles.acumFormula}>1 − (0.95)^{cartas} cartas</p>
            </div>

            <div className={styles.noteCard}>
              <p>Con 100 cartas la probabilidad llega a <strong>~99.4%</strong> pero nunca a 100%. Siempre existe la posibilidad de no obtenerlo.</p>
            </div>

            <div className={styles.costTable}>
              <h3 className={styles.infoTitle}>Costos</h3>
              <div className={styles.costRow}>
                <span>1 mazo (10 cartas)</span>
                <span className={styles.costVal}>10 🪙</span>
              </div>
              <div className={styles.costRow}>
                <span>10 mazos (100 cartas)</span>
                <span className={styles.costVal}>90 🪙</span>
              </div>
              <div className={styles.costRow}>
                <span>Fichas iniciales</span>
                <span className={styles.costVal}>1,000 🪙</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        {showConclusion && (
          <div className={styles.conclusion}>
            <div className={styles.conclusionIcon}>💡</div>
            <h3>Mito Roto</h3>
            <p>
              Abriste <strong>{cartas} cartas</strong> y obtuviste <strong>{legendarios} legendario(s)</strong>.
              La probabilidad acumulada fue <strong>{probAcumulada}%</strong>, nunca 100%.
              Comprar más cajas aumenta las chances, pero <em>no garantiza nada</em>.
            </p>
            <p className={styles.conceptTag}>
              Concepto: <strong>Probabilidad acumulada</strong> · <strong>Eventos independientes</strong>
            </p>
          </div>
        )}
      </div>

      {/* Premio overlay */}
      {showPremio && (
        <div className={styles.premioOverlay}>
          <div className={styles.premioBox}>
            <span className={styles.premioTrophy}>✨</span>
            <p>¡Carta Legendaria!</p>
          </div>
        </div>
      )}
    </div>
  )
}
