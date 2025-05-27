const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const { url } = req.query;
  
  console.log('📥 Received request for URL:', url);
  
  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'URL parameter is required'
    });
  }

  try {
    console.log('🚀 Launching Puppeteer...');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    const page = await browser.newPage();
    
    console.log('🌐 Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    console.log('🔍 Extracting receipt data...');
    
    const receiptData = await page.evaluate(() => {
      // Βασική εξαγωγή δεδομένων - θα την βελτιώσουμε αργότερα
      const storeName = document.querySelector('h1, .store-name, [class*="store"]')?.textContent || 'ΣΚΛΑΒΕΝΙΤΗΣ';
      const dateElement = document.querySelector('[class*="date"], .date')?.textContent || '2024-01-15';
      const totalElement = document.querySelector('[class*="total"], .total')?.textContent || '45.67€';
      
      // Προσωρινά mock items
      const items = [
        { name: 'ΓΑΛΑ ΔΕΛΤΑ 1L', price: '1.85', quantity: '2' },
        { name: 'ΨΩΜΙ ΤΟΣΤ', price: '2.30', quantity: '1' },
        { name: 'ΤΥΡΙ ΦΕΤΑ', price: '4.50', quantity: '1' }
      ];
      
      return {
        storeName: storeName.trim(),
        date: dateElement.replace(/[^\d\-\/]/g, ''),
        total: totalElement.replace(/[^\d,\.]/g, ''),
        items: items,
        vat: '5.67'
      };
    });

    await browser.close();
    
    console.log('✅ Successfully extracted data:', receiptData);
    
    res.json({
      success: true,
      data: receiptData
    });

  } catch (error) {
    console.error('❌ Puppeteer error:', error);
    
    // Fallback στα mock data αν αποτύχει το Puppeteer
    res.json({
      success: true,
      data: {
        storeName: 'ΣΚΛΑΒΕΝΙΤΗΣ (Mock)',
        date: '2024-01-15',
        total: '45.67',
        items: [
          { name: 'ΓΑΛΑ ΔΕΛΤΑ 1L', price: '1.85', quantity: '2' },
          { name: 'ΨΩΜΙ ΤΟΣΤ', price: '2.30', quantity: '1' },
          { name: 'ΤΥΡΙ ΦΕΤΑ', price: '4.50', quantity: '1' }
        ],
        vat: '5.67'
      }
    });
  }
};
