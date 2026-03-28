import { Link, useLocation } from 'react-router-dom'
import styles from '../styles/Navbar.module.css'

const GAMES = [
  { path: '/juego1', label: '🪙 J1' },
  { path: '/juego2', label: '🎡 J2' },
  { path: '/juego3', label: '🃏 J3' },
  { path: '/juego4', label: '🦠 J4' },
  { path: '/juego5', label: '🎯 J5' },
  { path: '/juego6', label: '📦 J6' },
  { path: '/juego7', label: '🔢 J7' },
  { path: '/juego8', label: '🎰 J8' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>🎲 Mitos</Link>
      <div className={styles.links}>
        {GAMES.map(g => (
          <Link
            key={g.path}
            to={g.path}
            className={`${styles.link} ${pathname === g.path ? styles.active : ''}`}
          >
            {g.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
