const puppeteer = require('puppeteer-core');
const path = require('path');

async function generatePDF() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'USER_MANUAL.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.emulateMediaType('print');

  // Inject forced visibility to ensure content renders
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.visibility === 'hidden' || style.opacity === '0') {
        el.style.visibility = 'visible';
        el.style.opacity = '1';
      }
    });
  });

  // Cover page as separate first section (no margins), then content with margins
  await page.pdf({
    path: path.resolve(__dirname, 'USER_MANUAL.pdf'),
    format: 'A4',
    printBackground: true,
    margin: {
      top: '22mm',
      right: '20mm',
      bottom: '25mm',
      left: '20mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;text-align:center;font-size:8pt;color:#94A3B8;font-family:sans-serif;"><span>X-RayCare QC Management System — คู่มือการใช้งาน &nbsp;|&nbsp; หน้า <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  });

  console.log('USER_MANUAL.pdf generated successfully! (' + (require('fs').statSync(path.resolve(__dirname, 'USER_MANUAL.pdf')).size / 1024).toFixed(0) + ' KB)');
  await browser.close();
}

generatePDF().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
