import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

interface ScrapedPage {
  url: string;
  title: string;
  content: string;
  html: string;
  images: string[];
}

const BASE_URL = 'https://fightingmonk.com';
const OUTPUT_DIR = path.join(process.cwd(), 'scraped-content');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');
const PAGES_DIR = path.join(OUTPUT_DIR, 'pages');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });

const visitedUrls = new Set<string>();
const pages: ScrapedPage[] = [];
const imageUrls = new Set<string>();

function normalizeUrl(url: string, baseUrl: string): string {
  try {
    const urlObj = new URL(url, baseUrl);
    // Only process URLs from the same domain
    if (urlObj.hostname !== new URL(baseUrl).hostname) {
      return '';
    }
    return urlObj.href.split('#')[0]; // Remove hash
  } catch {
    return '';
  }
}

async function downloadImage(imageUrl: string): Promise<string | null> {
  try {
    const urlObj = new URL(imageUrl, BASE_URL);
    const imagePath = urlObj.pathname;
    const filename = path.basename(imagePath) || 'image.jpg';
    const localPath = path.join(IMAGES_DIR, filename);

    // Skip if already downloaded
    if (fs.existsSync(localPath)) {
      return `/images/${filename}`;
    }

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    fs.writeFileSync(localPath, response.data);
    console.log(`Downloaded image: ${filename}`);
    return `/images/${filename}`;
  } catch (error) {
    console.error(`Failed to download image ${imageUrl}:`, error);
    return null;
  }
}

async function scrapePage(url: string): Promise<void> {
  const normalizedUrl = normalizeUrl(url, BASE_URL);
  if (!normalizedUrl || visitedUrls.has(normalizedUrl)) {
    return;
  }

  visitedUrls.add(normalizedUrl);
  console.log(`Scraping: ${normalizedUrl}`);

  try {
    const response = await axios.get(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const title = $('title').text() || 'Untitled';
    const pageImages: string[] = [];

    // Extract and download images
    $('img').each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src');
      if (src) {
        const imageUrl = normalizeUrl(src, normalizedUrl);
        if (imageUrl && !imageUrls.has(imageUrl)) {
          imageUrls.add(imageUrl);
          pageImages.push(imageUrl);
        }
      }
    });

    // Download images
    const downloadedImages: string[] = [];
    for (const imgUrl of pageImages) {
      const localPath = await downloadImage(imgUrl);
      if (localPath) {
        downloadedImages.push(localPath);
      }
    }

    // Extract links for further crawling
    const links: string[] = [];
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const linkUrl = normalizeUrl(href, normalizedUrl);
        if (linkUrl && linkUrl.startsWith(BASE_URL)) {
          links.push(linkUrl);
        }
      }
    });

    const page: ScrapedPage = {
      url: normalizedUrl,
      title,
      content: $('body').text().trim(),
      html: response.data,
      images: downloadedImages,
    };

    pages.push(page);

    // Save page data
    const pageFilename = normalizedUrl
      .replace(BASE_URL, '')
      .replace(/\//g, '_') || 'index';
    const pagePath = path.join(PAGES_DIR, `${pageFilename}.json`);
    fs.writeFileSync(pagePath, JSON.stringify(page, null, 2));

    // Crawl linked pages (limit depth)
    for (const link of links.slice(0, 10)) {
      if (!visitedUrls.has(link)) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        await scrapePage(link);
      }
    }
  } catch (error) {
    console.error(`Failed to scrape ${normalizedUrl}:`, error);
  }
}

async function main() {
  console.log('Starting site scrape...');
  await scrapePage(BASE_URL);

  // Save summary
  const summary = {
    totalPages: pages.length,
    totalImages: imageUrls.size,
    pages: pages.map(p => ({
      url: p.url,
      title: p.title,
      imageCount: p.images.length,
    })),
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log(`\nScraping complete!`);
  console.log(`- Pages scraped: ${pages.length}`);
  console.log(`- Images downloaded: ${imageUrls.size}`);
  console.log(`- Output directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
