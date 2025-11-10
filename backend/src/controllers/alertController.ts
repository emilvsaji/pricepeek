import { Request, Response } from 'express';
import { createAlert, getActiveAlerts, deleteAlert } from '../services/alertService';

/**
 * POST /api/alert
 * Create a new price alert
 * 
 * Request body:
 * {
 *   "url": "product_url",
 *   "targetPrice": 1000,
 *   "email": "user@example.com" (optional)
 * }
 */
export const createAlertHandler = async (req: Request, res: Response) => {
  try {
    const { url, targetPrice, email } = req.body;
    
    // Validate input
    if (!url || !targetPrice) {
      return res.status(400).json({
        success: false,
        message: 'URL and target price are required'
      });
    }
    
    if (typeof targetPrice !== 'number' || targetPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target price must be a positive number'
      });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }
    
    console.log(`🔔 Creating price alert for ${url} at ₹${targetPrice}`);
    
    const result = await createAlert(url, targetPrice, email);
    
    return res.status(201).json(result);
    
  } catch (error) {
    console.error('❌ Alert creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating alert',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
};

/**
 * GET /api/alert
 * Get all active alerts
 */
export const getAlertsHandler = async (req: Request, res: Response) => {
  try {
    const result = await getActiveAlerts();
    return res.json(result);
  } catch (error) {
    console.error('❌ Get alerts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching alerts'
    });
  }
};

/**
 * DELETE /api/alert/:alertId
 * Delete a specific alert
 */
export const deleteAlertHandler = async (req: Request, res: Response) => {
  try {
    const { alertId } = req.params;
    
    if (!alertId || alertId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert ID'
      });
    }
    
    const result = await deleteAlert(alertId);
    return res.json(result);
    
  } catch (error) {
    console.error('❌ Delete alert error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting alert'
    });
  }
};
