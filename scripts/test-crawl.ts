import * as fs from 'fs';
import * as path from 'path';

interface OxfordWordItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  exampleEn: string;
  exampleVi: string;
  imageUrl: string;
  audioUrl: string;
  page: number;
}

// Helper to extract word items from TrumTuVung HTML
function parseTrumTuVungHtml(html: string, pageNum: number): OxfordWordItem[] {
  const items: OxfordWordItem[] = [];
  const serviceItemRegex = /<div class="col-md-12 service-item decoration">([\s\S]*?)<\/div>\s*<!--end col-md-4-->/g;

  let match;
  while ((match = serviceItemRegex.exec(html)) !== null) {
    const block = match[1];

    // Image URL
    const imgMatch = block.match(/src="(https:\/\/trumtuvung\.com\/images\/[^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : '';

    // Word and Phonetic
    const headingMatch = block.match(/<h4 class="media-heading">([^<]+)<span>([^<]*)<\/span><\/h4>/);
    const word = headingMatch ? headingMatch[1].trim() : '';
    const phonetic = headingMatch ? headingMatch[2].trim() : '';

    // Part of speech and Meaning
    const meaningMatch = block.match(/<i class="fa fa-headphones"><\/i>\s*(\([^\)]+\)):\s*([^<]+)<br\/>/);
    const partOfSpeech = meaningMatch ? meaningMatch[1].trim() : '';
    const meaning = meaningMatch ? meaningMatch[2].trim() : '';

    // Example English and Vietnamese
    const exampleMatch = block.match(/<i class="fa fa-hand-o-right"><\/i>\s*Example:\s*([^<]+)<br\/>([^<]+)<br\/>/);
    const exampleEn = exampleMatch ? exampleMatch[1].trim() : '';
    const exampleVi = exampleMatch ? exampleMatch[2].trim() : '';

    // Audio URL
    const audioMatch = block.match(/<source src="(https:\/\/trumtuvung\.com\/audio\/[^"]+)"/);
    const audioUrl = audioMatch ? audioMatch[1] : `https://trumtuvung.com/audio/8/${word.toLowerCase().replace(/\s+/g, '_')}.mp3`;

    if (word && meaning) {
      items.push({
        id: `ox-word-${items.length + 1}-p${pageNum}`,
        word,
        phonetic,
        partOfSpeech,
        meaning,
        exampleEn,
        exampleVi,
        imageUrl,
        audioUrl,
        page: pageNum,
      });
    }
  }

  return items;
}

async function run() {
  console.log('Testing TrumTuVung crawler parser...');
  const firstPageRes = await fetch('https://www.trumtuvung.com/bo-tu-vung-thong-dung-oxford/page-1');
  const html = await firstPageRes.text();
  const words = parseTrumTuVungHtml(html, 1);
  console.log(`Page 1 fetched: ${words.length} words.`);
  console.log('Sample word:', JSON.stringify(words[0], null, 2));
}

run().catch(console.error);
