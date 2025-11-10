import axios from 'axios';

// API base URL - change this for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Product interface matching backend response
 */
export interface Product {
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  imageUrl?: string;
  platform: 'amazon' | 'flipkart' | 'meesho';
  url: string;
  bestValueScore?: number;
}

/**
 * Compare response interface
 */
export interface CompareResponse {
  success: boolean;
  products: Product[];
  bestDeal?: {
    platform: string;
    price: number;
    title: string;
    url: string;
    bestValueScore: number;
  };
  lowestPrice?: number;
  comparedAt?: Date;
  message?: string;
}

/**
 * Price history data point
 */
export interface PriceHistoryPoint {
  price: number;
  originalPrice?: number;
  discount?: number;
  date: Date;
}

/**
 * Compare products across platforms
 */
export const compareProducts = async (urls: string[]): Promise<CompareResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/compare`, { urls });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

/**
 * Get price history for a product
 */
export const getPriceHistory = async (productId: string, days: number = 30) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/${productId}?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

/**
 * Create a price alert
 */
export const createAlert = async (url: string, targetPrice: number, email?: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/alert`, {
      url,
      targetPrice,
      email
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

/**
 * Get all active alerts
 */
export const getAlerts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alert`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

/**
 * Delete an alert
 */
export const deleteAlert = async (alertId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/alert/${alertId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw error;
  }
};
