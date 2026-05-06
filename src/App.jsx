import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { SideBar } from './components/SideBar'
import { HomePage } from './pages/HomePage'
import { StoryViewPage } from './pages/StoryViewPage'

function App() {
  return (
    // Quitamos bg-black y text-white, agregamos un color de fondo verde muy suave
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f4f9f4', color: '#333' }}>
      
      <SideBar />
      
      <div className="flex-grow-1" style={{ marginLeft: "80px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/HomePage" replace/>}/>
          <Route path="/HomePage" element={<HomePage />}/>
          <Route path="/StoryView" element={<StoryViewPage />}/>

        </Routes>
      </div>
      
    </div>
  )
}

export default App