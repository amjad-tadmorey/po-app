import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Manager from './pages/Manager'
import Admin from './pages/Admin'
import Buyer from './pages/Buyer'
import Login from './pages/Login'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="p-4 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/manager" element={<Manager/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/buyer" element={<Buyer/>} />
        </Routes>
      </main>
    </div>
  )
}
