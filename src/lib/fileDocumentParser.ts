import JSZip from 'jszip';

export interface ExtractedDocResult {
  rawText: string;
  hasColoredAnswers: boolean;
  coloredKeywordsCount: number;
}

/**
 * Parses .docx file buffer and extracts paragraphs while detecting colored/highlighted runs
 */
export async function parseDocxWithColorDetection(buffer: Buffer): Promise<ExtractedDocResult> {
  const zip = new JSZip();
  await zip.loadAsync(buffer);

  const documentXml = await zip.file('word/document.xml')?.async('text');
  if (!documentXml) {
    throw new Error('Không tìm thấy nội dung word/document.xml trong file .docx');
  }

  // Parse paragraphs <w:p>
  const paragraphRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;
  const runRegex = /<w:r(?:\s[^>]*)?>([\s\S]*?)<\/w:r>/g;
  const textRegex = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g;
  const colorRegex = /<w:color\s+[^>]*w:val="([^"]+)"/i;
  const highlightRegex = /<w:highlight\s+[^>]*w:val="([^"]+)"/i;

  const paragraphs: string[] = [];
  let coloredKeywordsCount = 0;

  let pMatch;
  while ((pMatch = paragraphRegex.exec(documentXml)) !== null) {
    const pContent = pMatch[1];
    let pText = '';

    let rMatch;
    while ((rMatch = runRegex.exec(pContent)) !== null) {
      const rContent = rMatch[1];

      // Extract text in this run
      let rText = '';
      let tMatch;
      while ((tMatch = textRegex.exec(rContent)) !== null) {
        rText += tMatch[1];
      }

      if (!rText) continue;

      // Check if this run has colored font or highlight
      const colorValMatch = rContent.match(colorRegex);
      const highlightValMatch = rContent.match(highlightRegex);

      const colorVal = colorValMatch ? colorValMatch[1].toUpperCase() : null;
      const highlightVal = highlightValMatch ? highlightValMatch[1].toLowerCase() : null;

      // Standard non-answers: '000000', 'AUTO', 'DEFAULT', 'FFFFFF'
      const isColored =
        (colorVal && !['000000', 'AUTO', 'DEFAULT', 'FFFFFF'].includes(colorVal)) ||
        (highlightVal && highlightVal !== 'none');

      if (isColored && rText.trim()) {
        coloredKeywordsCount++;
        // Tag with [CORRECT] marker for AI parser
        pText += ` [CORRECT]${rText}[/CORRECT] `;
      } else {
        pText += rText;
      }
    }

    if (pText.trim()) {
      paragraphs.push(pText.replace(/\s+/g, ' ').trim());
    }
  }

  return {
    rawText: paragraphs.join('\n'),
    hasColoredAnswers: coloredKeywordsCount > 0,
    coloredKeywordsCount,
  };
}

/**
 * Parses PDF buffer and extracts text
 */
export async function parsePdfDocument(buffer: Buffer): Promise<ExtractedDocResult> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return {
    rawText: data.text || '',
    hasColoredAnswers: false,
    coloredKeywordsCount: 0,
  };
}
