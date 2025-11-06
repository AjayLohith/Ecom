import express from 'express';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

const router = express.Router();
const MOCK_USER_ID = 'mock-user';

function computeTotal(items) {
  return items.reduce((sum, item) => sum + item.qty * (item.product?.price || 0), 0);
}

// GET /api/cart: items + total
router.get('/', async (_req, res) => {
  try {
    const items = await CartItem.find({ userId: MOCK_USER_ID }).populate('product').lean();
    const total = computeTotal(items);
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load cart' });
  }
});

// POST /api/cart: { productId, qty }
router.post('/', async (req, res) => {
  try {
    const { productId, qty } = req.body || {};
    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ message: 'productId and positive qty are required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await CartItem.findOne({ userId: MOCK_USER_ID, product: productId });
    if (existing) {
      existing.qty += qty;
      await existing.save();
      return res.status(200).json(existing);
    }
    const created = await CartItem.create({ userId: MOCK_USER_ID, product: productId, qty });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// DELETE /api/cart/:id  (cart item id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CartItem.findOneAndDelete({ _id: id, userId: MOCK_USER_ID });
    if (!deleted) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

// PATCH /api/cart/:id  to update qty (bonus for update)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body || {};
    if (!qty || qty <= 0) return res.status(400).json({ message: 'Positive qty required' });
    const updated = await CartItem.findOneAndUpdate(
      { _id: id, userId: MOCK_USER_ID },
      { $set: { qty } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Cart item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item' });
  }
});

export default router;


