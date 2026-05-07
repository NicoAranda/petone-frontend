import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { SideBar } from './components/SideBar/SideBar'
import { HomePage } from './pages/HomePage'
import { StoryViewPage } from './pages/StoryViewPage'
import Footer from './components/Footer'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

function App() {
  return (
    // Quitamos bg-black y text-white, agregamos un color de fondo verde muy suave
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f4f9f4', color: '#333' }}>
      <SideBar />
      <div className="main-area flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/HomePage" replace/>}/>
            <Route path="/HomePage" element={<HomePage />}/>
            <Route path="/StoryView" element={<StoryViewPage />}/>
            <Route path="/terms" element={<Terms />}/>
            <Route path="/privacy" element={<Privacy />}/>
          </Routes>
        </div>
        <Footer />
      </div>
      
    </div>
  )
}

export default App