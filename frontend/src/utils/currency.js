const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })

export function formatINR(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '₹0.00'
  return inr.format(amount)
}


