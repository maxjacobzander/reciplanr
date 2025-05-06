import { chromium } from "playwright";
import * as cheerio from "cheerio";

/**
 * Scrapes visible ingredient text from a recipe URL using Playwright and Cheerio.
 * @param {string} url
 * @returns {Promise<{ ingredients: string[], title?: string }>}
 */
export async function scrapeRecipe(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const html = await page.content();
    const $ = cheerio.load(html);

    // Broad fallback selector for ingredient items
    const fallbackIngredients = [];
    $(
      '[class*="ingredient"], li.ingredient, .ingredients-item-name, .recipe-ingredients__list-item'
    ).each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200 && /\w/.test(text)) {
        fallbackIngredients.push(text);
      }
    });

    if (fallbackIngredients.length) {
      console.log("line 30", fallbackIngredients);
      return {
        ingredients: fallbackIngredients,
        title: $("title").text().trim(),
      };
    }

    throw new Error("No ingredients found in fallback.");
  } catch (err) {
    console.error(`Scraping failed for ${url}:`, err.message);
    return { ingredients: [], title: undefined };
  } finally {
    await browser.close();
  }
}
