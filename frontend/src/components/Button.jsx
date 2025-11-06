import React from 'react'

export default function Button({ variant = 'default', children, className = '', ...rest }) {
  const base = 'btn'
  const map = {
    default: 'btn',
    primary: 'btn btn-primary',
    ghost: 'btn btn-ghost'
  }
  const cls = `${map[variant] || base} ${className}`.trim()
  return (
    <button className={cls} {...rest}>{children}</button>
  )
}


