import React from 'react'

export default function OrderCard({ order, onAction }){
  return (
    <article className="bg-white p-3 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
          <h3 className="font-semibold">{order.type === 'consumables' ? 'Consumables' : 'Others'} — #{order.id}</h3>
        </div>
        <div className="text-sm px-2 py-1 rounded-full text-white" style={{background: order.status==='pending'? '#f59e0b' : order.status==='accepted'? '#10b981' : '#ef4444'}}>{order.status}</div>
      </div>

      <ul className="mt-3 space-y-2">
        {order.items.map((it, idx)=> (
          <li key={idx} className="border rounded p-2">
            <div className="flex justify-between"><div className="font-medium">{it.name}</div><div>Qty: {it.qty}</div></div>
            {it.note && <div className="text-sm text-slate-500 mt-1">{it.note}</div>}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-2">
        {onAction}
      </div>
    </article>
  )
}
