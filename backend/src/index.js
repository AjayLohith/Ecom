import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*'}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in environment');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();


