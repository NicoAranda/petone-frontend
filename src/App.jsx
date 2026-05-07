import React, { useState } from 'react' // 1. Importamos React y useState
import { Navigate, Route, Routes } from 'react-router-dom'
import { SideBar } from './components/SideBar/SideBar'
import { HomePage } from './pages/HomePage'
import { StoryViewPage } from './pages/StoryViewPage'
import Footer from './components/Footer'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import CreatePostModal from './components/PostCreate/CreatePostModal' 
import { AboutUsPage } from './pages/AboutUsPage'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f4f9f4', color: '#333' }}>
      
      <SideBar onOpenModal={() => setIsModalOpen(true)} />
      
      <div className="main-area flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/about" replace/>}/>
            <Route path="/HomePage" element={<HomePage />}/>
            <Route path="/StoryView" element={<StoryViewPage />}/>
            <Route path="/terms" element={<Terms />}/>
            <Route path="/privacy" element={<Privacy />}/>
            <Route path="/about" element={<AboutUsPage />}/>
          </Routes>
        </div>
        <Footer />
      </div>
      
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </div>
  )
}

export default App