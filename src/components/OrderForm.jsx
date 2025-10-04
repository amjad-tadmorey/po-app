import React, { useState } from 'react'
import ItemRow from './ItemRow'
import { API_BASE } from '../config'

export default function OrderForm({ defaultType='consumables', onSaved }){
  const [type, setType] = useState(defaultType)
  const [items, setItems] = useState([{ id: Date.now().toString(), name:'', qty:1, note:'' }])

  const addItem = ()=> setItems(prev => [...prev, { id: Date.now().toString(), name:'', qty:1, note:'' }])
  const updateItem = (idx, next) => setItems(prev => prev.map((p,i)=> i===idx? next : p))
  const removeItem = (idx) => setItems(prev => prev.filter((_,i)=> i!==idx))

  const submit = async (e) =>{
    e.preventDefault()
    const payload = { type, items, createdBy: 'u-manager' }
    await fetch(`${API_BASE}/orders`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    onSaved && onSaved()
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-3 rounded">
      <div className="flex gap-2">
        <label className="flex-1">
          <div className="text-xs text-slate-500">Type</div>
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full border p-2 rounded">
            <option value="consumables">Consumables</option>
            <option value="others">Others</option>
          </select>
        </label>
      </div>

      <div className="space-y-2">
        {items.map((it, idx)=> (
          <div key={it.id} className="space-y-1">
            <ItemRow item={it} onChange={next => updateItem(idx, next)} onRemove={()=>removeItem(idx)} />
            <textarea placeholder="Note (optional)" value={it.note} onChange={e=>updateItem(idx, {...it, note: e.target.value})} className="w-full border p-2 rounded text-sm" />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={addItem} className="flex-1 border p-2 rounded">+ Add item</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </form>
  )
}
