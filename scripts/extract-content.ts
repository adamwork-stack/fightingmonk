import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';

const pageData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'scraped-content/pages/_.json'), 'utf8')
);

const $ = cheerio.load(pageData.html);

// Extract main sections
const sections: Record<string, string> = {};

// Try to find main content areas
$('section, .section, [id]').each((_, el) => {
  const id = $(el).attr('id');
  const text = $(el).text().trim();
  if (id && text.length > 50) {
    sections[id] = text.substring(0, 500);
  }
});

// Extract paragraphs
const paragraphs: string[] = [];
$('p').each((_, el) => {
  const text = $(el).text().trim();
  if (text.length > 20) {
    paragraphs.push(text);
  }
});

console.log('Sections found:', Object.keys(sections));
console.log('\nParagraphs:', paragraphs.slice(0, 5));
console.log('\nTitle:', $('title').text());
console.log('\nMain heading:', $('h1').first().text());
