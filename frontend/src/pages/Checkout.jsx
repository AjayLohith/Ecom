import React from 'react'
import { formatINR } from '../utils/currency.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Checkout() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [receipt, setReceipt] = React.useState(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [items, setItems] = React.useState([])
  const [selected, setSelected] = React.useState({}) // map of cartItemId -> boolean

  React.useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch(`${API_BASE}/api/cart`)
        const data = await res.json()
        setItems(data.items || [])
        // default select all
        const next = {}
        for (const it of data.items || []) next[it._id] = true
        setSelected(next)
      } catch {}
    }
    loadCart()
  }, [])

  function toggle(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // build selected cartItems payload in the shape backend expects
      const selectedItems = items.filter((it) => selected[it._id])
      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, cartItems: selectedItems })
      })
      const data = await res.json()
      setReceipt(data.receipt)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Checkout</h2>
      <div className="card" style={{ padding: 16, margin: '12px 0' }}>
        <h3 className="muted" style={{ marginBottom: 8 }}>Cart Items</h3>
        {items.length === 0 && <p className="muted">Your cart is empty.</p>}
        {items.map((ci) => (
          <label key={ci._id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <input type="checkbox" checked={!!selected[ci._id]} onChange={() => toggle(ci._id)} />
            <div className="muted">{ci.product?.name} × {ci.qty}</div>
            <div className="card-price">{formatINR(Number((ci.product?.price || 0) * ci.qty))}</div>
          </label>
        ))}
      </div>
      <form onSubmit={submit} className="form">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? 'Processing…' : 'Checkout'}</button>
      </form>
      {receipt && (
        <div className="modal">
          <div className="modal-body">
            <h3>Receipt</h3>
            <p>Total: {formatINR(Number(receipt.total || 0))}</p>
            <p>When: {new Date(receipt.timestamp).toLocaleString()}</p>
            <p>Id: {receipt.id}</p>
            <button onClick={() => setReceipt(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}


