import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for Alert document
 * Stores user price alert preferences
 */
export interface IAlert extends Document {
  url: string;
  platform: 'amazon' | 'flipkart' | 'meesho';
  targetPrice: number;
  email?: string; // Optional: for future email notification feature
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Alert Schema
 * Saves target price alerts (notification logic can be added later)
 */
const AlertSchema: Schema = new Schema({
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
  targetPrice: {
    type: Number,
    required: true,
    min: 0
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for querying active alerts
AlertSchema.index({ isActive: 1, url: 1 });

export default mongoose.model<IAlert>('Alert', AlertSchema);
