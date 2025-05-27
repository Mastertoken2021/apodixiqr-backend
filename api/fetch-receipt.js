
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
  
  // Handle debug endpoint FIRST - before URL validation
  console.log('🔧 Checking for debug endpoint...');
  if (debugHandler.handleDebugEndpoint({ query: finalQuery }, res)) {
    console.log('✅ Debug endpoint handled, returning early');
    return;
  }
  console.log('⏭️ Debug endpoint not triggered, continuing...');
  
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
