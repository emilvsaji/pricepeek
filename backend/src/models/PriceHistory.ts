import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for PriceHistory document
 * Tracks price changes over time for trend analysis
 */
export interface IPriceHistory extends Document {
  productId: mongoose.Types.ObjectId;
  url: string;
  platform: 'amazon' | 'flipkart' | 'meesho';
  price: number;
  originalPrice?: number;
  discount?: number;
  recordedAt: Date;
}

/**
 * PriceHistory Schema
 * Keeps historical record of product prices for trend graphs
 */
const PriceHistorySchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true // Index for faster queries by product
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['amazon', 'flipkart', 'meesho']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  recordedAt: {
    type: Date,
    default: Date.now,
    index: true // Index for date-based queries
  }
}, {
  timestamps: false // We use recordedAt instead
});

// Compound index for efficient historical queries
PriceHistorySchema.index({ productId: 1, recordedAt: -1 });

export default mongoose.model<IPriceHistory>('PriceHistory', PriceHistorySchema);
