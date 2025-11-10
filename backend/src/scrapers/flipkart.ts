import { chromium, Browser, Page } from 'playwright';
import { ScrapedProduct, getRandomUserAgent, randomDelay, extractPrice, extractRating, calculateDiscount } from './utils';

/**
 * Scrape product data from Flipkart
 * @param url - Flipkart product URL
 * @returns Scraped product data or null if failed
 */
export const scrapeFlipkart = async (url: string): Promise<ScrapedProduct | null> => {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🔍 Scraping Flipkart:', url);

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
    const title = await page.locator('span.VU-ZEz, h1.yhB1nd, span.B_NuCI').first().textContent({ timeout: 10000 });
    if (!title) throw new Error('Product title not found');

    // Extract current price
    const priceText = await page.locator('div.Nx9bqj, div._30jeq3, div._16Jk6d').first().textContent({ timeout: 10000 });
    if (!priceText) throw new Error('Price not found');
    const price = extractPrice(priceText);

    // Extract original price (MRP) if available
    let originalPrice: number | undefined;
    const originalPriceElement = await page.locator('div.yRaY8j, div._3I9_wc, div._3auQ3N').first().textContent().catch(() => null);
    if (originalPriceElement) {
      originalPrice = extractPrice(originalPriceElement);
    }

    // Calculate discount
    const discount = originalPrice ? calculateDiscount(originalPrice, price) : undefined;

    // Alternative: Extract discount directly if shown
    if (!discount) {
      const discountElement = await page.locator('div.UkUFwK, div._3Ay6sb, span._2Khksd').first().textContent().catch(() => null);
      if (discountElement) {
        const discountMatch = discountElement.match(/(\d+)%/);
        if (discountMatch) {
          const directDiscount = parseInt(discountMatch[1]);
          if (!isNaN(directDiscount)) {
            // Calculate original price from discount
            originalPrice = Math.round(price / (1 - directDiscount / 100));
          }
        }
      }
    }

    // Extract rating
    let rating: number | undefined;
    const ratingElement = await page.locator('div.XQDdHH, div._3LWZlK, div._3sQBTj').first().textContent().catch(() => null);
    if (ratingElement) {
      rating = extractRating(ratingElement);
    }

    // Extract image URL
    let imageUrl: string | undefined;
    const imageElement = await page.locator('img._396cs4, img._2r_T1I, div._1AtVbE img').first().getAttribute('src').catch(() => null);
    if (imageElement) {
      imageUrl = imageElement;
    }

    console.log('✅ Flipkart scraping successful');

    return {
      title: title.trim(),
      price,
      originalPrice,
      discount,
      rating,
      imageUrl,
      platform: 'flipkart',
      url
    };

  } catch (error) {
    console.error('❌ Flipkart scraping failed:', error);
    return null;
  } finally {
    // Always close browser to free resources
    if (page) await page.close();
    if (browser) await browser.close();
  }
};
