const axios = require('axios');
const cheerio = require('cheerio');
const receiptParser = require('./receiptParser');

module.exports = {
  scrapeReceiptData: async (url) => {
    console.log('🚀 ==> RAILWAY API CALLED <== 🚀');
    console.log('📥 Received request for URL:', url);
    console.log('🕐 Timestamp:', new Date().toISOString());
    
    console.log('🌐 Starting axios request to:', url);
    console.log('⏱️ Setting timeout to 20 seconds...');
    
    const response = await axios.get(url, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'el-GR,el;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    console.log('📡 Axios response received!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data length:', response.data?.length || 'N/A');
    console.log('🔤 Content-Type:', response.headers['content-type']);

    const $ = cheerio.load(response.data);
    
    console.log('🔍 Cheerio loaded, starting data extraction...');
    console.log('📄 Page title:', $('title').text());
    
    // Debug: Log first 2000 characters of HTML
    console.log('🔧 HTML snippet (first 2000 chars):', response.data.substring(0, 2000));
    
    // Log all text content for debugging
    const bodyText = $('body').text().trim();
    console.log('📝 Body text (first 1000 chars):', bodyText.substring(0, 1000));
    
    // Count all elements
    console.log('📊 Total elements found:', $('*').length);
    console.log('📊 Tables found:', $('table').length);
    console.log('📊 Rows found:', $('tr').length);
    console.log('📊 Cells found:', $('td').length);
    
    const receiptData = receiptParser.extractReceiptData($, bodyText);
    
    console.log('✅ Final extracted data:');
    console.log('🏪 Store:', receiptData.storeName);
    console.log('📅 Date:', receiptData.date);
    console.log('🛒 Items found:', receiptData.items.length);
    console.log('💰 Total:', receiptData.total);
    console.log('📦 Items:', receiptData.items);
    
    return {
      receiptData,
      debug: {
        scrapedItems: receiptData.items.length,
        usedFallback: receiptData.items.length === 0,
        htmlLength: response.data.length,
        tablesFound: $('table').length,
        rowsFound: $('tr').length
      }
    };
  }
};
</lov-write>

Finally, update the main fetch-receipt.js file to use these modules:
