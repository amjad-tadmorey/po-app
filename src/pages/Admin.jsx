import React, { useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard'
import { API_BASE } from '../config'

export default function Admin() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let isCancelled = false

    async function fetchOrders() {
      try {
        const res = await fetch(`${API_BASE}/orders`)
        const data = await res.json()
        if (!isCancelled) setOrders(data.orders || [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      }
    }

    fetchOrders()

    return () => {
      isCancelled = true // cleanup flag
    }
  }, [])

  const setStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Admin — All Orders</h1>
      <div className="space-y-3">
        {orders.map(o => (
          <OrderCard
            key={o.id}
            order={o}
            onAction={
              <>
                <button
                  onClick={() => setStatus(o.id, 'accepted')}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => setStatus(o.id, 'rejected')}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </>
            }
          />
        ))}
      </div>
    </div>
  )
}
