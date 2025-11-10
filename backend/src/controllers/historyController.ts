import { Request, Response } from 'express';
import { getPriceHistory } from '../services/productService';

/**
 * GET /api/history/:productId
 * Get price history for a specific product
 * 
 * Query params:
 * - days: number of days (default 30, max 90)
 */
export const getPriceHistoryHandler = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    
    // Validate productId
    if (!productId || productId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    // Limit days to maximum 90
    const limitedDays = Math.min(days, 90);
    
    console.log(`📊 Fetching price history for ${productId} (${limitedDays} days)`);
    
    const result = await getPriceHistory(productId, limitedDays);
    
    return res.json(result);
    
  } catch (error) {
    console.error('❌ History endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching price history',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
};
