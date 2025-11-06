import React from 'react'
import ProductCard from '../components/ProductCard.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Products() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [products, setProducts] = React.useState([])
  const [addingId, setAddingId] = React.useState('')

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function addToCart(productId) {
    setAddingId(productId)
    try {
      await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty: 1 })
      })
      alert('Added to cart')
    } catch {
      alert('Failed to add to cart')
    } finally {
      setAddingId('')
    }
  }

  if (loading) return <p className="muted">Loading…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div>
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <ProductCard key={p._id} product={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  )
}


