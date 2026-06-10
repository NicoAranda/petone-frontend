import React, { useState, useEffect } from 'react' // 1. Importamos React y hooks
import { Navigate, Route, Routes } from 'react-router-dom'
import { SideBar } from './components/SideBar/SideBar'
import { HomePage } from './pages/HomePage'
import { StoryViewPage } from './pages/StoryViewPage'
import Footer from './components/Footer'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import CreatePostModal from './components/PostCreate/CreatePostModal' 
import { AboutUsPage } from './pages/AboutUsPage'
import { Toaster } from 'react-hot-toast'
import { LoginRegister } from './pages/LoginRegister'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import { PerfilPage } from './pages/PerfilPage'
import { API } from './lib/api'
import { PostDetailPage } from './pages/PostDetailPage'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState([])

  const refreshPosts = async () => {
    try {
      const res = await fetch(`${API}/publicaciones`)
      if (!res.ok) throw new Error('Error fetching posts')
      const data = await res.json()
      // sort by fechaPublicacion desc if present
      data.sort((a, b) => {
        const da = a.fechaPublicacion ? new Date(a.fechaPublicacion).getTime() : 0
        const db = b.fechaPublicacion ? new Date(b.fechaPublicacion).getTime() : 0
        return db - da
      })
      setPosts(data)
    } catch (e) {
      console.error('Error loading posts:', e)
    }
  }

  useEffect(() => {
    refreshPosts()
  }, [])

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f4f9f4', color: '#333' }}>
      <Toaster 
        position='top-center' 
        reverseOrder={false} 
        toastOptions={{
          error: {
            style: {
              background: '#d32f2f',
              color: '#fff'
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#d32f2f'
            }
          }
        }}
      />
      
      <SideBar onOpenModal={() => setIsModalOpen(true)} />
      
      <div className="main-area flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/about" replace/>}/>
            <Route path="/HomePage" element={<HomePage posts={posts} refreshPosts={refreshPosts} />}/>
            <Route path="/StoryView" element={<StoryViewPage />}/>
            <Route path="/terms" element={<Terms />}/>
            <Route path="/privacy" element={<Privacy />}/>
            <Route path="/about" element={<AboutUsPage />}/>
            <Route path="/login" element={<LoginRegister />}/>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
      
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={refreshPosts} />
      
    </div>
  )
}

export default App