import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css'

const games = [
  { id: 1, title: "La Falacia del Jugador", myth: "Si algo pasó muchas veces, ahora es menos probable", icon: "🪙" },
  { id: 2, title: "¿Puedes ganarle al Casino?", myth: "Si juegas suficiente tiempo, terminarás ganando", icon: "🎡" },
  { id: 3, title: "El Problema de Monty Hall", myth: "Cambiar de puerta no mejora mis probabilidades", icon: "🚪" },
  { id: 4, title: "Contagio en el Salón", myth: "Un contagio ocurre al azar sin importar el contacto", icon: "🦠" },
  { id: 5, title: "¿La Suerte Mejora?", myth: "Si intento muchas veces, seguro lo logro", icon: "🎯" },
  { id: 6, title: "Loot Box Simulator", myth: "Comprando muchas cajas, obtendrás el legendario", icon: "📦" },
  { id: 7, title: "¿Qué Número Saldrá?", myth: "Los números tienen patrones predecibles", icon: "🔢" },
  { id: 8, title: "La Ilusión de la Precisión", myth: "Si casi ocurre, estamos cerca de lograrlo", icon: "🎰" },
]

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🎲 Rompiendo Mitos de Probabilidad</h1>
      <p className={styles.subtitle}>Demuestra por qué los mitos del azar son falsos</p>
      <div className={styles.grid}>
        {games.map(game => (
          <Link to={`/juego${game.id}`} key={game.id} className={styles.card}>
            <span className={styles.icon}>{game.icon}</span>
            <h2 className={styles.cardTitle}>{game.title}</h2>
            <p className={styles.cardMyth}>"{game.myth}"</p>
            <span className={styles.play}>Jugar →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}