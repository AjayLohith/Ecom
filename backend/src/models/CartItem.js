import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

cartItemSchema.index({ userId: 1, product: 1 }, { unique: true });

export default mongoose.model('CartItem', cartItemSchema);


