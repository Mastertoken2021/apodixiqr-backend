
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
  console.log('📋 All query params:', req.query);
  console.log('🔍 Debug param specifically:', req.query.debug);
  console.log('🔗 URL param specifically:', req.query.url);
  
  // Handle debug endpoint FIRST - before URL validation
  console.log('🔧 Checking for debug endpoint...');
  if (debugHandler.handleDebugEndpoint(req, res)) {
    console.log('✅ Debug endpoint handled, returning early');
    return;
  }
  console.log('⏭️ Debug endpoint not triggered, continuing...');
  
  const { url } = req.query;
  
  if (!url) {
    console.log('❌ No URL provided in request');
    console.log('❌ Available query params:', Object.keys(req.query));
    return res.status(400).json({
      success: false,
      error: 'URL parameter is required',
      debug: { 
        timestamp: new Date().toISOString(),
        receivedParams: req.query,
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
</lov-write>

