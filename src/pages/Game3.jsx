import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Game3.module.css'

const STARTING_CHIPS = 1000;
const TOTAL_CARDS = 20;

export default function Game3() {
  const [chips, setChips] = useState(STARTING_CHIPS);
  const [targetCard, setTargetCard] = useState(7);
  const [frequencies, setFrequencies] = useState(new Array(TOTAL_CARDS).fill(0));
  const [temptationCard, setTemptationCard] = useState(null);
  const [history, setHistory] = useState([]);
  const [aciertos, setAciertos] = useState(0);
  const [perdidasPorCambio, setPerdidasPorCambio] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawn, setLastDrawn] = useState(null);
  
  const totalSpins = history.length;
  const showConclusion = totalSpins >= 30;

  // Detectar si el usuario cambió de carta a la "tentación"
  const [userChangedToTemptation, setUserChangedToTemptation] = useState(false);

  const getNextTemptation = (freqs) => {
    const cartasCero = freqs.map((f, i) => f === 0 ? i + 1 : null).filter(x => x !== null);
    if (cartasCero.length > 0) {
      return cartasCero[Math.floor(Math.random() * cartasCero.length)];
    }
    return null;
  };

  const handleTargetChange = (val) => {
    const newTarget = parseInt(val) || 1;
    if (newTarget !== targetCard) {
      if (newTarget === temptationCard) {
        setUserChangedToTemptation(true);
      } else {
        setUserChangedToTemptation(false);
      }
      setTargetCard(newTarget);
    }
  };

  const drawCards = (amount) => {
    setIsDrawing(true);
    
    // Simular un pequeño retraso para la animación
    setTimeout(() => {
      let newChips = chips;
      let newAciertos = aciertos;
      let newPerdidasCambio = perdidasPorCambio;
      const newFreqs = [...frequencies];
      const newHistory = [...history];
      let lastVal = null;

      for (let i = 0; i < amount; i++) {
        const drawn = Math.floor(Math.random() * TOTAL_CARDS) + 1;
        newFreqs[drawn - 1]++;
        lastVal = drawn;
        
        const won = drawn === targetCard;
        let delta = 0;

        if (won) {
          newAciertos++;
          // Si es la carta de tentación, paga el TRIPLE (30 fichas)
          delta = (targetCard === temptationCard) ? 30 : 10;
        } else {
          delta = -10;
          // Si el usuario cambió a esta carta por tentación y perdió
          if (userChangedToTemptation && targetCard === temptationCard) {
            newPerdidasCambio++;
          }
        }

        newChips += delta;
        newHistory.push({ drawn, targetCard, won, delta });
      }

      setChips(newChips);
      setAciertos(newAciertos);
      setPerdidasPorCambio(newPerdidasCambio);
      setFrequencies(newFreqs);
      setHistory(newHistory);
      setLastDrawn(lastVal);
      setIsDrawing(false);
      
      // Actualizar la tentación después de que las frecuencias cambien
      setTemptationCard(getNextTemptation(newFreqs));
    }, amount === 1 ? 300 : 800);
  };

  const handleReset = () => {
    setChips(STARTING_CHIPS);
    setTargetCard(7);
    const initialFreqs = new Array(TOTAL_CARDS).fill(0);
    setFrequencies(initialFreqs);
    setHistory([]);
    setAciertos(0);
    setPerdidasPorCambio(0);
    setLastDrawn(null);
    setUserChangedToTemptation(false);
    setTemptationCard(getNextTemptation(initialFreqs));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>← Volver al Casino</Link>
        <div className={styles.mythBadge}>Mito: La Falacia del Apostador</div>
      </div>

      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>La carta que nunca sale</h1>
          <div className={styles.mythCard}>
            <p className={styles.mythText}>
              "Si una carta no ha salido, tiene que estar al caer..."
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.leftPanel}>
            <div className={styles.chipCounter}>
              <span className={styles.chipAmt}>{chips}</span>
              <span className={styles.chipLbl}>FICHAS</span>
            </div>

            <div className={styles.cardDisplay}>
              <div className={`${styles.mainCard} ${isDrawing ? styles.flipping : ''}`}>
                {lastDrawn || '?'}
              </div>
              <p className={styles.displayLabel}>Última carta robada</p>
            </div>

            <div className={styles.controlBox}>
              <label className={styles.betLabel}>Tu carta objetivo:</label>
              <div className={styles.targetSelector}>
                <input 
                  type="range" min="1" max="20" 
                  value={targetCard}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  className={styles.rangeInput}
                  disabled={isDrawing}
                />
                <span className={styles.targetVal}>{targetCard}</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button 
                className={styles.spinBtn} 
                onClick={() => drawCards(1)}
                disabled={isDrawing || chips < 10}
              >
                Robar 1
              </button>
              <button 
                className={styles.spinBtn20} 
                onClick={() => drawCards(20)}
                disabled={isDrawing || chips < 200}
              >
                Robar 20 (Fija)
              </button>
            </div>

            {temptationCard && (
              <div className={styles.temptationBanner}>
                🔥 ¡ATENCIÓN! La carta <strong>{temptationCard}</strong> no ha salido. <br/>
                ¡Gana <strong>30 fichas</strong> (x3) si la eliges ahora!
              </div>
            )}
            
            <div className={styles.statsBoard}>
              <div className={styles.statItem}>
                <label>Aciertos</label>
                <span className={styles.statValue}>{aciertos}</span>
              </div>
              <div className={styles.statItem}>
                <label>Pérdidas por cambiar</label>
                <span className={`${styles.statValue} ${styles.textRed}`}>{perdidasPorCambio}</span>
              </div>
              <div className={styles.statItem}>
                <label>Tiros Totales</label>
                <span className={styles.statValue}>{totalSpins}</span>
              </div>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <h3 className={styles.gridTitle}>Frecuencia del Mazo (20 Cartas)</h3>
            <div className={styles.cardsGrid}>
              {frequencies.map((freq, i) => (
                <div key={i} className={`${styles.cardItem} ${freq === 0 ? styles.cardEmpty : styles.cardActive} ${targetCard === i + 1 ? styles.cardSelected : ''}`}>
                  <span className={styles.cardNum}>{i + 1}</span>
                  <div className={styles.freqBar} style={{ height: `${Math.min(freq * 10, 100)}%` }}></div>
                  <span className={styles.cardFreq}>{freq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showConclusion && (
          <div className={styles.conclusion}>
            <h3>La Realidad Matemática</h3>
            <p>
              Has realizado {totalSpins} tiros. Como puedes ver, las cartas <strong>no tienen memoria</strong>. 
              Que la carta {temptationCard} no haya salido no la hace más probable en el siguiente tiro. 
              Cada vez que robas, la probabilidad sigue siendo exactamente <strong>5%</strong>.
            </p>
            <div className={styles.statsSummary}>
              Perdiste {perdidasPorCambio} veces intentando "cazar" la carta que faltaba.
            </div>
            <button className={styles.btnReset} onClick={handleReset}>
              Reintentar Desafío
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
