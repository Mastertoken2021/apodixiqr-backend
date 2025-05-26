// api/fetch-receipt.js
const puppeteer = require('puppeteer');

module.exports = async function (req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing receipt URL' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const text = await page.evaluate(() => document.body.innerText);
    const lines = text.split('\n').filter(l => /\d+[,\\.]\d{2}/.test(l));
    const items = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const price = parseFloat(parts.pop().replace(',', '.'));
      const name = parts.join(' ');
      return { name, quantity: 1, price, vat: '13%' };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.price, 0);
    await browser.close();

    res.status(200).json({
      storeName: 'Epsilon Digital',
      date: new Date().toLocaleDateString('el-GR'),
      items,
      totalAmount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Scraping error', details: err.message });
  }
};
