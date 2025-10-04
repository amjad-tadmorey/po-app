import React, { useEffect, useState } from 'react'
import OrderForm from '../components/OrderForm'
import OrderCard from '../components/OrderCard'
import { API_BASE } from '../config'

export default function Manager() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => fetch(`${API_BASE}/orders?createdBy=u-manager`).then(r => r.json()).then(d => { setOrders(d.orders || []); setLoading(false) })
  useEffect(() => { load() }, [])

  const markDelivered = async (id) => {
    await fetch(`${API_BASE}/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'delivered' }) })
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Manager — Create Order</h1>
      <OrderForm onSaved={load} />

      <h2 className="text-lg font-semibold">My Orders</h2>
      <div className="space-y-3">
        {loading ? <div>Loading...</div> : orders.map(o => (
          <OrderCard key={o.id} order={o} onAction={<>
            {o.status === 'in-progress' && <button onClick={() => markDelivered(o.id)} className="px-3 py-1 bg-green-600 text-white rounded">Mark Delivered</button>}
          </>} />
        ))}
      </div>
    </div>
  )
}
