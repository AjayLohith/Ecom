import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isActive = (path) => (location.pathname === path ? 'active' : '')
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">Vibe Commerce</Link>
        <nav className="nav-links">
          <Link className={isActive('/')} to="/">Products</Link>
          {/* <Link className={isActive('/about')} to="/about">About</Link> */}
          <Link className={isActive('/cart')} to="/cart">Cart</Link>
          <Link className={isActive('/checkout')} to="/checkout">Checkout</Link>
        </nav>
      </div>
    </header>
  )
}


