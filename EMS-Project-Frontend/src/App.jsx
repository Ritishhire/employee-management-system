import React, { use, useEffect } from 'react'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthUserStore } from './Store/useAuthUserStore'


const App = () => {

  return (
    <div>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        <Toaster/>
        </BrowserRouter>
    
    
    </div>
  )
}

export default App
