import { Link } from 'react-router-dom'

export default function Game7() {
  return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', color:'#f0f0f0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
      <h1 style={{ color:'#c9a84c' }}>🚧 Juego 3 en construcción</h1>
      <Link to="/" style={{ color:'#888', textDecoration:'none' }}>← Volver al menú</Link>
    </div>
  )
}