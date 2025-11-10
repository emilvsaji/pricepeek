import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for Product document in MongoDB
 */
export interface IProduct extends Document {
  url: string;
  platform: 'amazon' | 'flipkart' | 'meesho';
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  imageUrl?: string;
  lastUpdated: Date;
  urlHash: string; // Used for quick lookup and caching
}

/**
 * Product Schema
 * Stores scraped product information from different platforms
 */
const ProductSchema: Schema = new Schema({
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
  title: {
    type: String,
    required: true,
    trim: true
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
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  imageUrl: {
    type: String,
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  urlHash: {
    type: String,
    required: true,
    index: true // Index for faster queries
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create compound index for efficient queries
ProductSchema.index({ urlHash: 1, lastUpdated: -1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
