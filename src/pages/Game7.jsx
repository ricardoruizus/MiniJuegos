import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/Game7.module.css";

export default function Game7() {
  const [numeroUsuario, setNumeroUsuario] = useState(1);
  const [resultado, setResultado] = useState(null);
  const [fichas, setFichas] = useState(1000);
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [aciertos, setAciertos] = useState(0);
  const [errores, setErrores] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(1);

  // Efecto visual de números aleatorios mientras "gira"
  useEffect(() => {
    let interval;
    if (isRolling) {
      interval = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 10) + 1);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRolling]);

  function jugar() {
    if (isRolling) return;

    setIsRolling(true);
    setResultado(null);
    setMensaje("");

    // Simular tiempo de "giro" para generar suspense
    setTimeout(() => {
      const numeroAleatorio = Math.floor(Math.random() * 10) + 1;
      
      setResultado(numeroAleatorio);
      setDisplayNumber(numeroAleatorio);
      setIsRolling(false);

      if (numeroUsuario === numeroAleatorio) {
        setFichas((prev) => prev + 100); // Aumenté el premio para hacerlo más emocionante
        setMensaje("🎉 ¡Excelente puntería!");
        setAciertos((prev) => prev + 1);
      } else {
        setFichas((prev) => prev - 10);
        setMensaje("❌ No fue esta vez");
        setErrores((prev) => prev + 1);
      }

      setHistorial((prev) => [numeroAleatorio, ...prev].slice(0, 20));
    }, 800);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>🎲 Juego 7: El Oráculo Numérico</h1>

      <div className={styles.gameCard}>
        <p>Elige tu número de la suerte (1-10):</p>

        <div className={styles.inputGroup}>
          <input
            type="number"
            min="1"
            max="10"
            value={numeroUsuario}
            onChange={(e) => setNumeroUsuario(Number(e.target.value))}
            className={styles.numberInput}
            disabled={isRolling}
          />

          <button
            onClick={jugar}
            className={styles.playButton}
            disabled={isRolling}
          >
            {isRolling ? "Girando..." : "🎯 Probar Suerte"}
          </button>
        </div>

        <div className={styles.resultContainer}>
          {isRolling ? (
            <div className={styles.rollingNumber}>{displayNumber}</div>
          ) : resultado !== null ? (
            <>
              <div className={styles.bigNumber}>{resultado}</div>
              <div className={`${styles.message} ${resultado === numeroUsuario ? styles.messageSuccess : styles.messageError}`}>
                {mensaje}
              </div>
            </>
          ) : (
            <div style={{ color: "#444", fontSize: "1.2rem" }}>¿Listo para ganar?</div>
          )}
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Fichas</span>
            <span className={styles.statValue} style={{ color: fichas >= 1000 ? "#4ade80" : "#f87171" }}>
              {fichas}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Aciertos</span>
            <span className={styles.statValue}>{aciertos}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Errores</span>
            <span className={styles.statValue}>{errores}</span>
          </div>
        </div>

        {historial.length > 0 && (
          <div className={styles.historial}>
            <p className={styles.historialTitle}>Últimos resultados:</p>
            <div className={styles.historialList}>
              {historial.map((num, i) => (
                <span key={i} className={styles.historyBadge}>{num}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.infoSection}>
        <h3>🧠 El Mito de los Patrones</h3>
        <p>
          “Si el 7 no ha salido en 10 rondas, ¡está por salir!”
        </p>

        <h3>📊 La Realidad Matemática</h3>
        <p>
          Este es un error común llamado <strong>Falacia del Gambusino</strong>. 
          En cada ronda, la probabilidad de que salga cualquier número sigue siendo 
          exactamente del 10%, sin importar lo que haya pasado antes. 
          Los números no tienen memoria.
        </p>
      </div>

      <Link to="/" className={styles.backLink}>
        ← Volver al menú principal
      </Link>
    </div>
  );
}
