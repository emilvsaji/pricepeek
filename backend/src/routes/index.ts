import express from 'express';
import { compareProductsHandler } from '../controllers/compareController';
import { getPriceHistoryHandler } from '../controllers/historyController';
import { createAlertHandler, getAlertsHandler, deleteAlertHandler } from '../controllers/alertController';

const router = express.Router();

/**
 * @route   POST /api/compare
 * @desc    Compare products from multiple platforms
 * @access  Public (rate limited)
 */
router.post('/compare', compareProductsHandler);

/**
 * @route   GET /api/history/:productId
 * @desc    Get price history for a product
 * @access  Public
 */
router.get('/history/:productId', getPriceHistoryHandler);

/**
 * @route   POST /api/alert
 * @desc    Create a new price alert
 * @access  Public
 */
router.post('/alert', createAlertHandler);

/**
 * @route   GET /api/alert
 * @desc    Get all active alerts
 * @access  Public
 */
router.get('/alert', getAlertsHandler);

/**
 * @route   DELETE /api/alert/:alertId
 * @desc    Delete a price alert
 * @access  Public
 */
router.delete('/alert/:alertId', deleteAlertHandler);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PricePeek API is running',
    timestamp: new Date()
  });
});

export default router;
