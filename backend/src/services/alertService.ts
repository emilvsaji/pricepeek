import Alert from '../models/Alert';
import { detectPlatform } from '../scrapers';

/**
 * Create a new price alert
 * @param url - Product URL
 * @param targetPrice - Desired price threshold
 * @param email - Optional email for notifications
 */
export const createAlert = async (url: string, targetPrice: number, email?: string) => {
  try {
    const platform = detectPlatform(url);
    
    if (!platform) {
      throw new Error('Invalid product URL. Must be from Amazon, Flipkart, or Meesho');
    }
    
    const alert = new Alert({
      url,
      platform,
      targetPrice,
      email,
      isActive: true
    });
    
    await alert.save();
    
    return {
      success: true,
      message: 'Price alert created successfully',
      alert: {
        id: alert._id,
        url: alert.url,
        platform: alert.platform,
        targetPrice: alert.targetPrice,
        createdAt: alert.createdAt
      }
    };
    
  } catch (error) {
    console.error('❌ Error creating alert:', error);
    throw error;
  }
};

/**
 * Get all active alerts
 */
export const getActiveAlerts = async () => {
  try {
    const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 });
    
    return {
      success: true,
      alerts: alerts.map(alert => ({
        id: alert._id,
        url: alert.url,
        platform: alert.platform,
        targetPrice: alert.targetPrice,
        email: alert.email,
        createdAt: alert.createdAt
      }))
    };
    
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    throw error;
  }
};

/**
 * Delete an alert
 * @param alertId - Alert ID to delete
 */
export const deleteAlert = async (alertId: string) => {
  try {
    await Alert.findByIdAndDelete(alertId);
    
    return {
      success: true,
      message: 'Alert deleted successfully'
    };
    
  } catch (error) {
    console.error('❌ Error deleting alert:', error);
    throw error;
  }
};

/**
 * Placeholder for future alert notification feature
 * This would check current prices against target prices and send notifications
 */
export const checkAndNotifyAlerts = async (): Promise<void> => {
  // TODO: Implement alert checking and notification
  // 1. Fetch all active alerts
  // 2. Scrape current prices
  // 3. Compare with target prices
  // 4. Send email/notification if price is below target
  
  console.log('📧 Alert notification system placeholder');
};
