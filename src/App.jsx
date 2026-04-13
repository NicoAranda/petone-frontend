import { Routes } from 'react-router-dom'
import './App.css'
import { SideBar } from './components/SideBar'

function App() {

  return (
    <>
      <SideBar />
      <div style={{ marginLeft: "80px" }}>
        <Routes>
          {/* <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/videos" element={<h1>Videos</h1>} />
          <Route path="/comentarios" element={<h1>Comentarios</h1>} />
          <Route path="/buscar" element={<h1>Buscar</h1>} /> */}
        </Routes>
      </div>
    </>
  )
}

export default App
