import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Game5.module.css'

const INITIAL_FICHAS = 1000
const COSTO = 10
const PROB = 0.05
const MAX_INTENTOS = 100

export default function Game5() {
  const [fichas, setFichas]       = useState(INITIAL_FICHAS)
  const [intentos, setIntentos]   = useState(0)
  const [ganado, setGanado]       = useState(false)
  const [mensaje, setMensaje]     = useState({ text: 'Pulsa "Intentar" para ver si consigues el premio.', type: 'normal' })
  const [showPremio, setShowPremio] = useState(false)
  const [showConclusion, setShowConclusion] = useState(false)

  const progreso = Math.min(100, Math.round((intentos / MAX_INTENTOS) * 100))

  const tirar = useCallback(() => {
    if (ganado) {
      setMensaje({ text: 'Ya obtuviste el premio. Reinicia para jugar otra vez.', type: 'success' })
      return
    }
    if (fichas < COSTO) {
      setMensaje({ text: 'No te quedan fichas. Fin del juego.', type: 'warning' })
      setShowConclusion(true)
      return
    }

    const nuevasFichas = fichas - COSTO
    const nuevosIntentos = intentos + 1
    setFichas(nuevasFichas)
    setIntentos(nuevosIntentos)

    const exito = Math.random() < PROB

    if (exito) {
      setGanado(true)
      setShowPremio(true)
      setTimeout(() => setShowPremio(false), 1800)
      setMensaje({ text: `¡Felicidades! Ganaste en el intento ${nuevosIntentos}. El éxito siguió siendo 5% en cada tiro.`, type: 'success' })
      setShowConclusion(true)
    } else if (nuevasFichas < COSTO) {
      setMensaje({ text: 'Agotaste las fichas sin premio. No está garantizado aunque intentes muchas veces.', type: 'error' })
      setShowConclusion(true)
    } else {
      const probSinExito = Math.pow(1 - PROB, nuevosIntentos)
      const probAcumulada = ((1 - probSinExito) * 100).toFixed(1)
      setMensaje({ text: `Intento ${nuevosIntentos}: No salió el premio. Probabilidad acumulada de haberlo ganado al menos una vez: ${probAcumulada}%.`, type: 'normal' })
    }

    if (nuevosIntentos >= MAX_INTENTOS) setShowConclusion(true)
  }, [fichas, intentos, ganado])

  const reiniciar = () => {
    setFichas(INITIAL_FICHAS)
    setIntentos(0)
    setGanado(false)
    setMensaje({ text: 'Pulsa "Intentar" para ver si consigues el premio.', type: 'normal' })
    setShowPremio(false)
    setShowConclusion(false)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>← Volver</Link>
        <div className={styles.mythBadge}>🎯 Juego 5</div>
      </div>

      <div className={styles.container}>
        {/* Title */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>¿La suerte mejora con más intentos?</h1>
          <div className={styles.mythCard}>
            <span className={styles.mythLabel}>El Mito</span>
            <p className={styles.mythText}>
              "Si intento muchas veces, <em>seguro lo logro</em>."
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          {/* LEFT — Game */}
          <div className={styles.leftPanel}>

            {/* Tómbola visual */}
            <div className={styles.tombola}>
              <div className={`${styles.tombolaInner} ${showPremio ? styles.tombolaWin : ''}`}>
                {showPremio ? (
                  <span className={styles.tombolaEmoji}>🏆</span>
                ) : ganado ? (
                  <span className={styles.tombolaEmoji}>🏆</span>
                ) : fichas < COSTO ? (
                  <span className={styles.tombolaEmoji}>💸</span>
                ) : (
                  <span className={styles.tombolaEmoji}>🎯</span>
                )}
                <span className={styles.tombolaLabel}>5% de probabilidad</span>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{fichas}</span>
                <span className={styles.statLbl}>🪙 Fichas</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{intentos}</span>
                <span className={styles.statLbl}>Intentos</span>
              </div>
              <div className={`${styles.statCard} ${styles.statAccent}`}>
                <span className={styles.statNum}>5%</span>
                <span className={styles.statLbl}>Prob. por tiro</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBlock}>
              <div className={styles.progressHeader}>
                <span>Progreso de intentos</span>
                <span>{intentos} / {MAX_INTENTOS}</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progreso}%` }} />
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
                onClick={tirar}
                disabled={ganado || fichas < COSTO}
              >
                🎯 Intentar
              </button>
              <button className={styles.btnSecondary} onClick={reiniciar}>
                ↺ Reiniciar
              </button>
            </div>
          </div>

          {/* RIGHT — Info */}
          <div className={styles.rightPanel}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>¿Cómo funciona?</h3>
              <ul className={styles.infoList}>
                <li>Premio raro con <strong>5%</strong> de probabilidad en cada intento</li>
                <li>Comienzas con <strong>1,000 fichas</strong>, cada intento cuesta <strong>10</strong></li>
                <li>Máximo <strong>100 intentos</strong></li>
                <li>Cada tiro es <strong>independiente</strong> del anterior</li>
              </ul>
            </div>

            {/* Probability table */}
            <div className={styles.probCard}>
              <h3 className={styles.infoTitle}>Probabilidad acumulada</h3>
              <p className={styles.probFormula}>1 − (0.95)^n</p>
              <div className={styles.probTable}>
                {[1, 5, 10, 20, 50, 100].map(n => {
                  const p = ((1 - Math.pow(0.95, n)) * 100).toFixed(1)
                  return (
                    <div key={n} className={`${styles.probRow} ${intentos >= n ? styles.probRowActive : ''}`}>
                      <span>{n} intento{n > 1 ? 's' : ''}</span>
                      <div className={styles.probBarTrack}>
                        <div className={styles.probBarFill} style={{ width: `${p}%` }} />
                      </div>
                      <span className={styles.probVal}>{p}%</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.noteCard}>
              <p>Incluso con 100 intentos, la probabilidad de obtener el premio es de <strong>~99.4%</strong> — no 100%. Nunca está garantizado.</p>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        {showConclusion && (
          <div className={styles.conclusion}>
            <div className={styles.conclusionIcon}>💡</div>
            <h3>Mito Roto</h3>
            <p>
              {ganado
                ? `Ganaste en el intento ${intentos}, pero eso no significa que sea garantizado. La probabilidad fue 5% en cada tiro, independientemente de los anteriores.`
                : `Agotaste ${intentos} intentos sin premio. Más intentos aumentan la probabilidad acumulada, pero nunca la llevan al 100%.`}
            </p>
            <p className={styles.conceptTag}>
              Concepto: <strong>Probabilidad repetida</strong> · <strong>Frecuencia esperada</strong>
            </p>
          </div>
        )}
      </div>

      {/* Premio overlay */}
      {showPremio && (
        <div className={styles.premioOverlay}>
          <div className={styles.premioBox}>
            <span className={styles.premioTrophy}>🏆</span>
            <p>¡Ganaste el premio raro!</p>
          </div>
        </div>
      )}
    </div>
  )
}
