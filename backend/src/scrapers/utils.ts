import UserAgent from 'user-agents';

/**
 * Interface for scraped product data
 */
export interface ScrapedProduct {
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  imageUrl?: string;
  platform: 'amazon' | 'flipkart' | 'meesho';
  url: string;
}

/**
 * Generate a random user agent string
 * This helps avoid detection by websites
 */
export const getRandomUserAgent = (): string => {
  const userAgent = new UserAgent();
  return userAgent.toString();
};

/**
 * Add a random delay between requests
 * Helps prevent rate limiting and detection
 * @param min - Minimum delay in milliseconds (default 1500ms)
 * @param max - Maximum delay in milliseconds (default 2200ms)
 */
export const randomDelay = async (min: number = 1500, max: number = 2200): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Extract numeric value from price string
 * Example: "₹1,234.56" -> 1234.56
 * @param priceText - Raw price text from webpage
 */
export const extractPrice = (priceText: string): number => {
  // Remove currency symbols, commas, and whitespace
  const cleanPrice = priceText.replace(/[₹$,\s]/g, '');
  const price = parseFloat(cleanPrice);
  return isNaN(price) ? 0 : price;
};

/**
 * Extract numeric rating from rating text
 * Example: "4.5 out of 5" -> 4.5
 * @param ratingText - Raw rating text from webpage
 */
export const extractRating = (ratingText: string): number => {
  const match = ratingText.match(/[\d.]+/);
  if (match) {
    const rating = parseFloat(match[0]);
    return isNaN(rating) ? 0 : Math.min(rating, 5);
  }
  return 0;
};

/**
 * Calculate discount percentage
 * @param originalPrice - Original/MRP price
 * @param currentPrice - Current selling price
 */
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};
