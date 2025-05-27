
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
  console.log('🔗 Full Request URL:', req.url);
  console.log('📋 Standard req.query:', req.query);
  
  // Super robust query parameter parsing
  let queryParams = {};
  
  // Method 1: Parse from URL manually
  if (req.url && req.url.includes('?')) {
    const urlParts = req.url.split('?');
    const queryString = urlParts[1];
    console.log('🔍 Raw query string:', queryString);
    
    if (queryString) {
      const pairs = queryString.split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value !== undefined) {
          queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
  }
  
  console.log('📋 Manually parsed query params:', queryParams);
  
  // Check for debug parameter immediately
  const debugParam = queryParams.debug || req.query?.debug;
  const urlParam = queryParams.url || req.query?.url;
  
  console.log('🔧 Debug parameter found:', debugParam);
  console.log('🔗 URL parameter found:', urlParam);
  
  // Handle debug endpoint FIRST - check for debug=version specifically
  if (debugParam === 'version') {
    console.log('✅ DEBUG=VERSION DETECTED - Calling debug handler immediately');
    return res.json({
      success: true,
      version: 'v8.0-super-robust-debug',
      timestamp: new Date().toISOString(),
      message: 'Debug endpoint working with super robust parsing',
      debugParam: debugParam,
      urlParam: urlParam,
      rawQuery: req.url,
      parsedQuery: queryParams,
      standardQuery: req.query,
      status: 'Debug endpoint is fully functional'
    });
  }
  
  // If no URL parameter, return error
  if (!urlParam) {
    console.log('❌ No URL provided in request');
    return res.status(400).json({
      success: false,
      error: 'URL parameter is required',
      debug: { 
        timestamp: new Date().toISOString(),
        receivedParams: queryParams,
        originalQuery: req.query,
        debugParam: debugParam,
        missingParam: 'url'
      }
    });
  }

  try {
    // Check if it's a test URL
    if (urlParam === 'test') {
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
        url: urlParam,
        timestamp: new Date().toISOString()
      });
    }

    const { receiptData, debug } = await receiptScraper.scrapeReceiptData(urlParam);
    
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
