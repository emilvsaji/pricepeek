import { Request, Response } from 'express';
import { compareProducts } from '../services/productService';

/**
 * POST /api/compare
 * Compare products from multiple e-commerce platforms
 * 
 * Request body:
 * {
 *   "urls": ["amazon_url", "flipkart_url", "meesho_url"]
 * }
 */
export const compareProductsHandler = async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;
    
    // Validate input
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of product URLs'
      });
    }
    
    if (urls.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 URLs allowed per comparison'
      });
    }
    
    // Validate URLs
    const validUrls = urls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
    
    if (validUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid URLs provided'
      });
    }
    
    console.log(`🔍 Comparing ${validUrls.length} products...`);
    
    // Compare products
    const result = await compareProducts(validUrls);
    
    return res.json(result);
    
  } catch (error) {
    console.error('❌ Compare endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while comparing products',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
};
