import { chromium, Browser, Page } from 'playwright';
import { ScrapedProduct, getRandomUserAgent, randomDelay, extractPrice, extractRating, calculateDiscount } from './utils';

/**
 * Scrape product data from Meesho
 * @param url - Meesho product URL
 * @returns Scraped product data or null if failed
 */
export const scrapeMeesho = async (url: string): Promise<ScrapedProduct | null> => {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🔍 Scraping Meesho:', url);

    // Launch browser with headless mode
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    // Create new page with random user agent
    const context = await browser.newContext({
      userAgent: getRandomUserAgent(),
      viewport: { width: 1920, height: 1080 }
    });
    page = await context.newPage();

    // Navigate to the product page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Add random delay to mimic human behavior
    await randomDelay();

    // Wait for content to load
    await page.waitForSelector('body', { timeout: 10000 });

    // Extract product title
    const title = await page.locator('h1, span[class*="title"], div[class*="product-title"]').first().textContent({ timeout: 10000 });
    if (!title) throw new Error('Product title not found');

    // Extract current price (Meesho uses different selectors)
    const priceText = await page.locator('span[class*="price"], div[class*="price"], h4[class*="price"]').first().textContent({ timeout: 10000 });
    if (!priceText) throw new Error('Price not found');
    const price = extractPrice(priceText);

    // Extract original price (MRP) if available
    let originalPrice: number | undefined;
    const originalPriceElement = await page.locator('span[class*="original"], span[class*="mrp"], s').first().textContent().catch(() => null);
    if (originalPriceElement) {
      originalPrice = extractPrice(originalPriceElement);
    }

    // Calculate discount
    const discount = originalPrice ? calculateDiscount(originalPrice, price) : undefined;

    // Extract rating
    let rating: number | undefined;
    const ratingElement = await page.locator('span[class*="rating"], div[class*="rating"]').first().textContent().catch(() => null);
    if (ratingElement) {
      rating = extractRating(ratingElement);
    }

    // Extract image URL
    let imageUrl: string | undefined;
    const imageElement = await page.locator('img[class*="product"], img[alt*="product"], div[class*="image"] img').first().getAttribute('src').catch(() => null);
    if (imageElement) {
      imageUrl = imageElement;
    }

    console.log('✅ Meesho scraping successful');

    return {
      title: title.trim(),
      price,
      originalPrice,
      discount,
      rating,
      imageUrl,
      platform: 'meesho',
      url
    };

  } catch (error) {
    console.error('❌ Meesho scraping failed:', error);
    return null;
  } finally {
    // Always close browser to free resources
    if (page) await page.close();
    if (browser) await browser.close();
  }
};
