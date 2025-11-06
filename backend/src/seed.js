import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const defaults = [
  { name: 'Minimal Desk Set', price: 2999, image: 'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=1200', description: 'Curated essentials for a clean workspace.' },
  { name: 'Designer Sneakers', price: 4999, image: 'https://images.unsplash.com/photo-1590080875831-c9a7b3a5f35a?w=1200', description: 'Comfort meets style for everyday wear.' },
  { name: 'Leather Backpack', price: 3499, image: 'https://images.unsplash.com/photo-1606813909027-3884cf06b9e8?w=1200', description: 'Premium leather pack for work and travel.' },
  { name: 'Activewear Set', price: 2499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200', description: 'Lightweight, breathable, and flexible.' },
  { name: 'Smart Watch', price: 7999, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200', description: 'Track fitness and stay connected all day.' }
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(uri);
  // Upsert products so you can reseed safely
  for (const p of defaults) {
    await Product.findOneAndUpdate(
      { name: p.name },
      { $set: p },
      { upsert: true, new: true }
    );
  }
  console.log(`Upserted ${defaults.length} demo products.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


