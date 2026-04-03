import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Game4.module.css'

const GRID_SIZE = 5; // 5x5 grid
const STARTING_CHIPS = 1000;

// Función de utilidad para crear el estado inicial del tablero
const createInitialGrid = () => {
  const newGrid = Array(GRID_SIZE * GRID_SIZE).fill('healthy');
  const center = Math.floor((GRID_SIZE * GRID_SIZE) / 2);
  newGrid[center] = 'infected';
  return newGrid;
};

export default function Game4() {
  const [chips, setChips] = useState(STARTING_CHIPS);
  const [grid, setGrid] = useState(createInitialGrid);
  const [selectedCell, setSelectedCell] = useState(null);
  const [contagionProb, setContagionProb] = useState(50);
  const [maxContacts, setMaxContacts] = useState(2);
  const [round, setRound] = useState(0);
  const [stats, setStats] = useState({ hits: 0, misses: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Función para reiniciar el juego manualmente
  const initGrid = () => {
    setGrid(createInitialGrid());
    setRound(0);
    setGameOver(false);
    setSelectedCell(null);
    setChips(STARTING_CHIPS);
    setStats({ hits: 0, misses: 0 });
  };

  const getNeighbors = (index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const neighbors = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          neighbors.push(nr * GRID_SIZE + nc);
        }
      }
    }
    return neighbors;
  };

  const getPossibleContagions = useCallback(() => {
    const possibles = new Set();
    grid.forEach((state, idx) => {
      if (state === 'infected') {
        getNeighbors(idx).forEach(nIdx => {
          if (grid[nIdx] === 'healthy') {
            possibles.add(nIdx);
          }
        });
      }
    });
    return Array.from(possibles);
  }, [grid]);

  const handleCellClick = (idx) => {
    if (gameOver || isAnimating || grid[idx] !== 'healthy') return;
    const possibles = getPossibleContagions();
    if (possibles.includes(idx)) {
      setSelectedCell(idx);
    }
  };

  const nextRound = () => {
    if (selectedCell === null || isAnimating) return;

    setIsAnimating(true);
    const possibles = getPossibleContagions();
    const willInfect = [];
    
    const candidates = [...possibles].sort(() => Math.random() - 0.5);
    
    candidates.forEach(idx => {
      if (willInfect.length < maxContacts) {
        if (Math.random() * 100 < contagionProb) {
          willInfect.push(idx);
        }
      }
    });

    setTimeout(() => {
      const newGrid = [...grid];
      let won = false;
      
      willInfect.forEach(idx => {
        newGrid[idx] = 'infected';
        if (idx === selectedCell) won = true;
      });

      if (won) {
        setChips(prev => prev + 10);
        setStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      } else {
        setChips(prev => prev - 10);
        setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      }

      setGrid(newGrid);
      setSelectedCell(null);
      setRound(prev => prev + 1);
      setIsAnimating(false);
      
      const nextPossibles = [];
      newGrid.forEach((state, idx) => {
        if (state === 'infected') {
          getNeighbors(idx).forEach(nIdx => {
            if (newGrid[nIdx] === 'healthy') nextPossibles.push(nIdx);
          } );
        }
      });
      
      if (nextPossibles.length === 0) {
        setGameOver(true);
      }
    }, 600);
  };

  const currentPossibles = getPossibleContagions();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>← Volver</Link>
        <div className={styles.badge}>🔬 Simulación de Contagio</div>
      </div>

      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Contagio en el Salón</h1>
          <div className={styles.mythBox}>
            <p>"El azar manda, no importa si estás cerca o lejos..." <strong>¿Seguro?</strong></p>
          </div>
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.controls}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Fichas</span>
              <span className={styles.statVal}>{chips}</span>
            </div>

            <div className={styles.settingGroup}>
              <label>Probabilidad de Contagio ({contagionProb}%)</label>
              <input 
                type="range" min="0" max="100" 
                value={contagionProb} 
                onChange={(e) => setContagionProb(parseInt(e.target.value))}
              />
              <p className={styles.helpText}>Qué tan rápido se propagan entre vecinos.</p>
            </div>

            <div className={styles.settingGroup}>
              <label>Máximo de contactos ({maxContacts})</label>
              <input 
                type="range" min="1" max="8" 
                value={maxContacts} 
                onChange={(e) => setMaxContacts(parseInt(e.target.value))}
              />
              <p className={styles.helpText}>Cuántas personas pueden contagiarse por ronda.</p>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.playBtn} 
                onClick={nextRound}
                disabled={selectedCell === null || isAnimating || gameOver}
              >
                {isAnimating ? 'Contagiando...' : 'Siguiente Ronda'}
              </button>
              <button className={styles.resetBtn} onClick={initGrid}>Reiniciar</button>
            </div>

            <div className={styles.miniStats}>
              <p>Ronda: {round}</p>
              <p>Aciertos: <span className={styles.textGreen}>{stats.hits}</span></p>
              <p>Fallos: <span className={styles.textRed}>{stats.misses}</span></p>
            </div>
          </div>

          <div className={styles.board}>
            <div className={styles.grid}>
              {grid.map((state, idx) => {
                const isPossible = currentPossibles.includes(idx);
                const isSelected = selectedCell === idx;
                return (
                  <div 
                    key={idx} 
                    className={`
                      ${styles.cell} 
                      ${styles[state]} 
                      ${isPossible ? styles.possible : ''} 
                      ${isSelected ? styles.selected : ''}
                    `}
                    onClick={() => handleCellClick(idx)}
                  >
                    <div className={styles.personIcon}>
                      {state === 'healthy' ? '👤' : '🧟'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.legend}>
              <p><span className={styles.dotHealthy}></span> Sano</p>
              <p><span className={styles.dotInfected}></span> Contagiado</p>
              <p><span className={styles.dotPossible}></span> Posible Contagio (Cerca)</p>
            </div>
          </div>
        </div>

        {gameOver && (
          <div className={styles.conclusion}>
            <h3>Simulación Finalizada</h3>
            <p>
              Has observado cómo el contagio se propaga <strong>únicamente</strong> a través del contacto directo. 
              Este es un ejemplo claro de <strong>eventos dependientes</strong>: la probabilidad de que alguien se contagie es 0 si no hay nadie infectado cerca.
            </p>
            <p className={styles.mathNote}>
              Concepto: <strong>Probabilidad Condicional</strong>. La probabilidad de contagio está condicionada a la cercanía de un infectado.
            </p>
            <button className={styles.resetBtnLarge} onClick={initGrid}>Nueva Simulación</button>
          </div>
        )}
      </div>
    </div>
  )
}
