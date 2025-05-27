
const corsHandler = require('./utils/corsHandler');
const debugHandler = require('./utils/debugHandler');
const receiptScraper = require('./utils/receiptScraper');
const receiptParser = require('./utils/receiptParser');

module.exports = async (req, res) => {
  // Add CORS headers
  corsHandler.setCorsHeaders(res);
  
  // Handle preflight OPTIONS request
  if (corsHandler.handlePreflight(req, res)) {
    return;
  }
  
  console.log('🚀 ==> RAILWAY API ENDPOINT HIT <== 🚀');
  console.log('🌍 Request method:', req.method);
  console.log('🔗 Request URL:', req.url);
  
  // Parse query parameters manually from URL for Railway compatibility
  let queryParams = {};
  if (req.url && req.url.includes('?')) {
    const urlParts = req.url.split('?');
    const queryString = urlParts[1];
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }
  
  // Also try the standard req.query as fallback
  const finalQuery = { ...req.query, ...queryParams };
  
  console.log('📋 Parsed query params:', finalQuery);
  console.log('🔍 Debug param specifically:', finalQuery.debug);
  console.log('🔗 URL param specifically:', finalQuery.url);
  
  // Handle debug endpoint FIRST - check for debug parameter only
  if (finalQuery.debug) {
    console.log('🔧 Debug parameter detected, calling debug handler...');
    if (debugHandler.handleDebugEndpoint({ query: finalQuery }, res)) {
      console.log('✅ Debug endpoint handled successfully, returning early');
      return;
    }
  }
  
  const { url } = finalQuery;
  
  if (!url) {
    console.log('❌ No URL provided in request');
    console.log('❌ Available query params:', Object.keys(finalQuery));
    return res.status(400).json({
      success: false,
      error: 'URL parameter is required',
      debug: { 
        timestamp: new Date().toISOString(),
        receivedParams: finalQuery,
        originalQuery: req.query,
        parsedFromUrl: queryParams,
        missingParam: 'url'
      }
    });
  }

  try {
    // Check if it's a test URL
    if (url === 'test') {
      console.log('🧪 Test URL detected, returning test data');
      const testData = {
        storeName: 'ΣΚΛΑΒΕΝΙΤΗΣ',
        date: '2024-01-15',
        time: '14:30:25',
        total: '45.67',
        items: [
          { name: 'ΓΑΛΑ ΦΡΕΣΚΟ 1L', price: '1.89', quantity: '2' },
          { name: 'ΨΩΜΙ ΤΟΣΤ', price: '2.45', quantity: '1' },
          { name: 'ΜΠΑΝΑΝΕΣ ΚΓ', price: '3.20', quantity: '1.5' }
        ],
        vat: '5.67',
        payment_method: 'ΚΑΡΤΑ'
      };
      
      return res.json({
        success: true,
        data: testData,
        url: url,
        timestamp: new Date().toISOString()
      });
    }

    const { receiptData, debug } = await receiptScraper.scrapeReceiptData(url);
    
    res.json({
      success: true,
      data: receiptData,
      debug
    });

  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    const fallbackData = receiptParser.getFallbackData();
    
    console.log('🔄 Using fallback data due to error');
    
    res.json({
      success: true,
      data: fallbackData,
      debug: {
        error: error.message,
        usedFallback: true
      }
    });
  }
};
