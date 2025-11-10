import { scrapeAmazon } from './amazon';
import { scrapeFlipkart } from './flipkart';
import { scrapeMeesho } from './meesho';
import { ScrapedProduct, randomDelay } from './utils';

/**
 * Detect platform from URL
 * @param url - Product URL
 * @returns Platform name or null
 */
export const detectPlatform = (url: string): 'amazon' | 'flipkart' | 'meesho' | null => {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('amazon.')) return 'amazon';
  if (urlLower.includes('flipkart.')) return 'flipkart';
  if (urlLower.includes('meesho.')) return 'meesho';
  
  return null;
};

/**
 * Scrape product from any supported platform
 * Automatically detects platform and uses appropriate scraper
 * @param url - Product URL
 * @returns Scraped product data or null
 */
export const scrapeProduct = async (url: string): Promise<ScrapedProduct | null> => {
  try {
    const platform = detectPlatform(url);
    
    if (!platform) {
      console.error('❌ Unsupported platform. URL must be from Amazon, Flipkart, or Meesho');
      return null;
    }

    // Add delay before scraping to avoid rate limits
    await randomDelay();

    // Call appropriate scraper based on platform
    switch (platform) {
      case 'amazon':
        return await scrapeAmazon(url);
      case 'flipkart':
        return await scrapeFlipkart(url);
      case 'meesho':
        return await scrapeMeesho(url);
      default:
        return null;
    }
  } catch (error) {
    console.error('❌ Scraping error:', error);
    return null;
  }
};

export { ScrapedProduct };
