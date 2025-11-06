import express from 'express';
import CartItem from '../models/CartItem.js';

const router = express.Router();
const MOCK_USER_ID = 'mock-user';

// POST /api/checkout: { cartItems? } -> mock receipt
router.post('/', async (req, res) => {
  try {
    let items;
    if (Array.isArray(req.body?.cartItems) && req.body.cartItems.length > 0) {
      items = req.body.cartItems;
    } else {
      items = await CartItem.find({ userId: MOCK_USER_ID }).populate('product').lean();
    }
    const total = items.reduce((sum, item) => sum + item.qty * (item.product?.price || 0), 0);
    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      id: `rcpt_${Math.random().toString(36).slice(2, 10)}`
    };

    // Clear cart for mock user after checkout
    await CartItem.deleteMany({ userId: MOCK_USER_ID });

    res.json({ receipt });
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed' });
  }
});

export default router;


