import React from 'react'
import { formatINR } from '../utils/currency.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Cart() {
  const [items, setItems] = React.useState([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  async function load() {
    setLoading(true)
    const res = await fetch(`${API_BASE}/api/cart`)
    const data = await res.json()
    setItems(data.items || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  async function removeItem(id) {
    await fetch(`${API_BASE}/api/cart/${id}`, { method: 'DELETE' })
    await load()
  }

  async function updateQty(id, qty) {
    await fetch(`${API_BASE}/api/cart/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qty }) })
    await load()
  }

  if (loading) return <p className="muted">Loading…</p>

  return (
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 && <p className="muted">Your cart is empty.</p>}
      {items.map(ci => (
        <div key={ci._id} className="row">
          <div className="grow">{ci.product?.name}</div>
          <div>{formatINR(Number(ci.product?.price || 0))}</div>
          <div>
            <button className="btn-ghost" onClick={() => updateQty(ci._id, Math.max(1, ci.qty - 1))}>-</button>
            <span style={{ margin: '0 8px' }}>{ci.qty}</span>
            <button className="btn-ghost" onClick={() => updateQty(ci._id, ci.qty + 1)}>+</button>
          </div>
          <div>{formatINR(Number((ci.product?.price || 0) * ci.qty))}</div>
          <button className="btn" onClick={() => removeItem(ci._id)}>Remove</button>
        </div>
      ))}
      <hr />
      <h3>Total: {formatINR(Number(total))}</h3>
    </div>
  )
}


