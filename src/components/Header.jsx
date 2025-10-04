import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">PO Manager</Link>
        <nav className="flex gap-3">
          <Link to="/manager" className="text-sm">Manager</Link>
          <Link to="/buyer" className="text-sm">Buyer</Link>
          <Link to="/admin" className="text-sm">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
