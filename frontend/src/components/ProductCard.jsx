import React from 'react'
import Button from './Button.jsx'
import { formatINR } from '../utils/currency.js'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      {product.image && (
        <img src={product.image} alt={product.name} />
      )}
      <div className="card-title">{product.name}</div>
      {product.description && <p className="muted small">{product.description}</p>}
      <div className="card-price">{formatINR(Number(product.price || 0))}</div>
      <Button variant="primary" onClick={() => onAdd?.(product._id)}>Add to Cart</Button>
    </div>
  )}


