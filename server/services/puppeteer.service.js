import puppeteer from 'puppeteer';

/**
 * Renders an HTML resume template into an ATS-friendly, single-column PDF document
 * @param {string} htmlContent - Populated HTML template content
 * @param {string} outputPath - Local filesystem file path to output the PDF
 * @returns {Promise<void>}
 */
export const generatePdfFromHtml = async (htmlContent, outputPath) => {
  let browser = null;
  try {
    // Launch headless Chromium browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport dimensions
    await page.setViewport({ width: 800, height: 1130, deviceScaleFactor: 1 });

    // Inject the raw HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Print to PDF with industry-standard resume dimensions (A4, 0.5-inch margins)
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

  } catch (error) {
    console.error('[Puppeteer Service Error]:', error);
    throw new Error(`Failed to compile PDF document: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
