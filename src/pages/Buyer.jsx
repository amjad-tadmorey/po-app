import React, { useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard'
import { API_BASE } from '../config'

// simple buyer that toggles in-progress
export default function Buyer() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let ignore = false // prevent state update if component unmounts

    async function loadOrders() {
      try {
        const res = await fetch(`${API_BASE}/orders?type=consumables`)
        const data = await res.json()
        if (!ignore) setOrders(data.orders || [])
      } catch (err) {
        console.error('Failed to fetch orders', err)
      }
    }

    loadOrders()

    return () => { ignore = true } // cleanup
  }, [])

  const setInProgress = async (id) => {
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in-progress' })
      })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'in-progress' } : o))
    } catch (err) {
      console.error('Failed to update order', err)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Buyer — Consumables</h1>
      <div className="space-y-3">
        {orders.map(o => (
          <OrderCard key={o.id} order={o} onAction={
            <>
              {o.status === 'accepted' && (
                <button
                  onClick={() => setInProgress(o.id)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Start
                </button>
              )}
            </>
          } />
        ))}
      </div>
    </div>
  )
}
