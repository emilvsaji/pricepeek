import crypto from 'crypto';
import Product from '../models/Product';
import PriceHistory from '../models/PriceHistory';
import { scrapeProduct, ScrapedProduct } from '../scrapers';

/**
 * Generate hash for URL to use as cache key
 * @param url - Product URL
 */
const generateUrlHash = (url: string): string => {
  return crypto.createHash('md5').update(url).digest('hex');
};

/**
 * Calculate Best Value Score
 * Formula: 70% price weight + 30% rating weight
 * Lower price and higher rating = better score
 * @param price - Product price
 * @param rating - Product rating (0-5)
 * @param maxPrice - Maximum price among compared products
 */
export const calculateBestValueScore = (price: number, rating: number = 0, maxPrice: number): number => {
  if (maxPrice === 0) return 0;
  
  // Normalize price (0-100, lower is better)
  const priceScore = ((maxPrice - price) / maxPrice) * 100;
  
  // Normalize rating (0-100, higher is better)
  const ratingScore = (rating / 5) * 100;
  
  // Weighted score: 70% price, 30% rating
  const totalScore = (priceScore * 0.7) + (ratingScore * 0.3);
  
  return Math.round(totalScore * 10) / 10; // Round to 1 decimal
};

/**
 * Check if cached data is still valid (within 2 hours)
 * @param lastUpdated - Date when data was last updated
 */
const isCacheValid = (lastUpdated: Date): boolean => {
  const cacheExpiry = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const now = new Date().getTime();
  const updatedTime = new Date(lastUpdated).getTime();
  
  return (now - updatedTime) < cacheExpiry;
};

/**
 * Get product data - either from cache or by scraping
 * @param url - Product URL
 * @returns Product data or null
 */
export const getProductData = async (url: string): Promise<ScrapedProduct | null> => {
  try {
    const urlHash = generateUrlHash(url);
    
    // Check if we have cached data in MongoDB
    const cachedProduct = await Product.findOne({ urlHash }).sort({ lastUpdated: -1 });
    
    if (cachedProduct && isCacheValid(cachedProduct.lastUpdated)) {
      console.log('✅ Using cached data for:', url);
      
      return {
        title: cachedProduct.title,
        price: cachedProduct.price,
        originalPrice: cachedProduct.originalPrice,
        discount: cachedProduct.discount,
        rating: cachedProduct.rating,
        imageUrl: cachedProduct.imageUrl,
        platform: cachedProduct.platform,
        url: cachedProduct.url
      };
    }
    
    // Cache expired or doesn't exist - scrape fresh data
    console.log('🔄 Cache expired or not found. Scraping fresh data...');
    const scrapedData = await scrapeProduct(url);
    
    if (!scrapedData) {
      return null;
    }
    
    // Save to database
    const productData = new Product({
      url,
      platform: scrapedData.platform,
      title: scrapedData.title,
      price: scrapedData.price,
      originalPrice: scrapedData.originalPrice,
      discount: scrapedData.discount,
      rating: scrapedData.rating,
      imageUrl: scrapedData.imageUrl,
      lastUpdated: new Date(),
      urlHash
    });
    
    const savedProduct = await productData.save();
    
    // Also save to price history
    const historyData = new PriceHistory({
      productId: savedProduct._id,
      url,
      platform: scrapedData.platform,
      price: scrapedData.price,
      originalPrice: scrapedData.originalPrice,
      discount: scrapedData.discount,
      recordedAt: new Date()
    });
    
    await historyData.save();
    
    return scrapedData;
    
  } catch (error) {
    console.error('❌ Error getting product data:', error);
    return null;
  }
};

/**
 * Compare products from multiple URLs
 * @param urls - Array of product URLs
 * @returns Comparison results with best value identified
 */
export const compareProducts = async (urls: string[]) => {
  try {
    // Scrape all products in parallel (with delays handled inside scraper)
    const scrapingPromises = urls.map(url => getProductData(url));
    const results = await Promise.all(scrapingPromises);
    
    // Filter out failed scrapes
    const validProducts = results.filter(product => product !== null) as ScrapedProduct[];
    
    if (validProducts.length === 0) {
      return {
        success: false,
        message: 'Failed to scrape any products',
        products: []
      };
    }
    
    // Find max price for best value calculation
    const maxPrice = Math.max(...validProducts.map(p => p.price));
    
    // Calculate best value score for each product
    const productsWithScore = validProducts.map(product => ({
      ...product,
      bestValueScore: calculateBestValueScore(
        product.price,
        product.rating || 0,
        maxPrice
      )
    }));
    
    // Sort by best value score (highest first)
    productsWithScore.sort((a, b) => b.bestValueScore - a.bestValueScore);
    
    // Mark the best deal
    const bestDeal = productsWithScore[0];
    const lowestPrice = Math.min(...validProducts.map(p => p.price));
    
    return {
      success: true,
      products: productsWithScore,
      bestDeal: {
        platform: bestDeal.platform,
        price: bestDeal.price,
        title: bestDeal.title,
        url: bestDeal.url,
        bestValueScore: bestDeal.bestValueScore
      },
      lowestPrice,
      comparedAt: new Date()
    };
    
  } catch (error) {
    console.error('❌ Error comparing products:', error);
    throw error;
  }
};

/**
 * Get price history for a product
 * @param productId - MongoDB Product ID
 * @param days - Number of days to fetch (default 30)
 */
export const getPriceHistory = async (productId: string, days: number = 30) => {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const history = await PriceHistory.find({
      productId,
      recordedAt: { $gte: daysAgo }
    }).sort({ recordedAt: 1 });
    
    // Also get product details
    const product = await Product.findById(productId);
    
    return {
      success: true,
      product: product ? {
        title: product.title,
        platform: product.platform,
        currentPrice: product.price
      } : null,
      history: history.map(h => ({
        price: h.price,
        originalPrice: h.originalPrice,
        discount: h.discount,
        date: h.recordedAt
      }))
    };
    
  } catch (error) {
    console.error('❌ Error fetching price history:', error);
    throw error;
  }
};

/**
 * Placeholder for future sentiment analysis feature
 * This can be expanded later to analyze reviews and ratings
 * @param productUrl - Product URL
 */
export const analyzeSentiment = async (productUrl: string): Promise<any> => {
  // TODO: Implement sentiment analysis
  // Could scrape reviews and use NLP to determine sentiment
  console.log('📊 Sentiment analysis placeholder called for:', productUrl);
  
  return {
    implemented: false,
    message: 'Sentiment analysis feature coming soon'
  };
};
