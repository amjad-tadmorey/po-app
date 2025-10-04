import React from 'react'

export default function ItemRow({ item, onChange, onRemove }){
  return (
    <div className="flex gap-2 items-center">
      <input value={item.name} onChange={e=>onChange({...item, name: e.target.value})} placeholder="Item name" className="flex-1 border p-2 rounded" />
      <input type="number" value={item.qty} onChange={e=>onChange({...item, qty: Number(e.target.value)})} className="w-20 border p-2 rounded" />
      <button type="button" onClick={onRemove} className="text-red-600">✕</button>
    </div>
  )
}
