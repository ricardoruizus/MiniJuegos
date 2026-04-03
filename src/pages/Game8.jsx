import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Game8.module.css";

export default function Game8() {
  const simbolos = ["🍒", "⭐", "7", "💎", "🍀"];

  const [reels, setReels] = useState(["❔", "❔", "❔"]);
  const [fichas, setFichas] = useState(1000);
  const [mensaje, setMensaje] = useState("¡Prueba tu suerte!");
  const [girando, setGirando] = useState([false, false, false]);
  const [isAnyReelSpinning, setIsAnyReelSpinning] = useState(false);
  const [winType, setWinType] = useState(null);

  // Usamos un Ref para guardar los resultados finales y evitar problemas de sincronización
  const resultadosRef = useRef(["❔", "❔", "❔"]);

  useEffect(() => {
    let intervals = [];
    
    girando.forEach((isSpinning, index) => {
      if (isSpinning) {
        intervals[index] = setInterval(() => {
          setReels(prev => {
            const next = [...prev];
            next[index] = simbolos[Math.floor(Math.random() * simbolos.length)];
            return next;
          });
        }, 60 + index * 20);
      } else {
        // Cuando deja de girar, forzamos el resultado final del Ref inmediatamente
        setReels(prev => {
          const next = [...prev];
          next[index] = resultadosRef.current[index];
          return next;
        });
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [girando]);

  function girar() {
    if (fichas < 10) {
      setMensaje("❌ No tienes suficientes fichas");
      return;
    }
    if (isAnyReelSpinning) return;

    // 1. Preparar el resultado real ANTES de empezar la animación
    const nuevosResultados = [
      simbolos[Math.floor(Math.random() * simbolos.length)],
      simbolos[Math.floor(Math.random() * simbolos.length)],
      simbolos[Math.floor(Math.random() * simbolos.length)]
    ];
    resultadosRef.current = nuevosResultados;

    // 2. Iniciar estados
    setIsAnyReelSpinning(true);
    setGirando([true, true, true]);
    setMensaje("¡Girando!");
    setWinType(null);
    setFichas((prev) => prev - 10);

    // 3. Detener carretes secuencialmente
    [0, 1, 2].forEach((index) => {
      setTimeout(() => {
        setGirando(prev => {
          const next = [...prev];
          next[index] = false;
          return next;
        });

        if (index === 2) {
          // Usamos los mismos valores exactos que guardamos en el Ref
          finalizarGiro(resultadosRef.current);
        }
      }, 1000 + index * 700);
    });
  }

  function finalizarGiro(res) {
    const [s1, s2, s3] = res;
    setIsAnyReelSpinning(false);

    // Lógica de victoria estricta
    const triple = s1 === s2 && s2 === s3;
    const doble = s1 === s2 || s2 === s3 || s1 === s3;

    if (triple) {
      setFichas((prev) => prev + 250); // Premio mayor aumentado
      setMensaje("🎉 ¡PREMIO MAYOR! 🎉");
      setWinType('win');
    } else if (doble) {
      setMensaje("😮 ¡Casi! La ilusión de ganar...");
      setWinType('near');
    } else {
      setMensaje("❌ No hubo suerte");
      setWinType('loss');
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>🎰 Juego 8: La Ilusión de la Precisión</h1>

      <div className={styles.slotMachine}>
        <div className={styles.reelsContainer}>
          {reels.map((simbolo, i) => (
            <div 
              key={i} 
              className={`${styles.reel} ${girando[i] ? styles.reelActive : styles.reelStopped}`}
            >
              {simbolo}
            </div>
          ))}
        </div>

        <button
          onClick={girar}
          disabled={isAnyReelSpinning || fichas < 10}
          className={styles.playButton}
        >
          {isAnyReelSpinning ? "Girando..." : "🎯 Girar (-10)"}
        </button>

        <div className={styles.messageContainer}>
          <p className={`${styles.message} ${
            winType === 'win' ? styles.win : 
            winType === 'near' ? styles.nearWin : 
            winType === 'loss' ? styles.loss : ''
          }`}>
            {mensaje}
          </p>
        </div>

        <div className={styles.stats}>
          <span className={styles.fichasLabel}>Fichas:</span>
          <span className={styles.fichasValue} style={{ color: fichas >= 10 ? "#4ade80" : "#f87171" }}>
            {fichas}
          </span>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>🧠 El Mito: El "Casi Gano"</h3>
        <p>
          <em>“Si salen dos de tres, ¡significa que la máquina está por pagar!”</em>
        </p>

        <h3>📊 La Realidad: Cada giro es nuevo</h3>
        <p>
          Las máquinas están diseñadas para mostrar resultados "cercanos" con frecuencia
          para darte una descarga de dopamina.
          En realidad, que hayan salido dos símbolos iguales <strong>no aumenta</strong> 
          la probabilidad de ganar en el siguiente giro. Cada evento es independiente.
        </p>
      </div>

      <Link to="/" className={styles.backLink}>
        ← Volver al menú principal
      </Link>
    </div>
  );
}
