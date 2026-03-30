import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game1 from './pages/Game1'
import Game2 from './pages/Game2'
import Game3 from './pages/Game3'
import Game4 from './pages/Game4'
import Game5 from './pages/Game5'
import Game6 from './pages/Game6'
import Game7 from './pages/Game7'
import Game8 from './pages/Game8'
import Navbar from './components/Navbar'

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/juego1" element={<Game1 />} />
        <Route path="/juego2" element={<Game2 />} />
        <Route path="/juego3" element={<Game3 />} />
        <Route path="/juego4" element={<Game4 />} />
        <Route path="/juego5" element={<Game5 />} />
        <Route path="/juego6" element={<Game6 />} />
        <Route path="/juego7" element={<Game7 />} />
        <Route path="/juego8" element={<Game8 />} />
      </Routes>
    </HashRouter>
  )
}

export default App