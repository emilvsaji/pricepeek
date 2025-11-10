import { chromium, Browser, Page } from 'playwright';
import { ScrapedProduct, getRandomUserAgent, randomDelay, extractPrice, extractRating, calculateDiscount } from './utils';

/**
 * Scrape product data from Amazon
 * @param url - Amazon product URL
 * @returns Scraped product data or null if failed
 */
export const scrapeAmazon = async (url: string): Promise<ScrapedProduct | null> => {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🔍 Scraping Amazon:', url);

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

    // Extract product title
    const title = await page.locator('#productTitle, h1.product-title').first().textContent({ timeout: 10000 });
    if (!title) throw new Error('Product title not found');

    // Extract current price
    const priceText = await page.locator('.a-price-whole, .a-price .a-offscreen').first().textContent({ timeout: 10000 });
    if (!priceText) throw new Error('Price not found');
    const price = extractPrice(priceText);

    // Extract original price (MRP) if available
    let originalPrice: number | undefined;
    const originalPriceElement = await page.locator('.a-price.a-text-price .a-offscreen, .basisPrice .a-offscreen').first().textContent().catch(() => null);
    if (originalPriceElement) {
      originalPrice = extractPrice(originalPriceElement);
    }

    // Calculate discount
    const discount = originalPrice ? calculateDiscount(originalPrice, price) : undefined;

    // Extract rating
    let rating: number | undefined;
    const ratingElement = await page.locator('span.a-icon-alt, span[data-hook="rating-out-of-text"]').first().textContent().catch(() => null);
    if (ratingElement) {
      rating = extractRating(ratingElement);
    }

    // Extract image URL
    let imageUrl: string | undefined;
    const imageElement = await page.locator('#landingImage, #imgTagWrapperId img').first().getAttribute('src').catch(() => null);
    if (imageElement) {
      imageUrl = imageElement;
    }

    console.log('✅ Amazon scraping successful');

    return {
      title: title.trim(),
      price,
      originalPrice,
      discount,
      rating,
      imageUrl,
      platform: 'amazon',
      url
    };

  } catch (error) {
    console.error('❌ Amazon scraping failed:', error);
    return null;
  } finally {
    // Always close browser to free resources
    if (page) await page.close();
    if (browser) await browser.close();
  }
};
