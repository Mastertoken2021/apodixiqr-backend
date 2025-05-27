
module.exports = {
  handleDebugEndpoint: (req, res) => {
    console.log('🔧 DEBUG HANDLER: Checking debug parameter...');
    console.log('🔧 DEBUG HANDLER: req.query =', req.query);
    
    const { debug } = req.query;
    console.log('🔧 DEBUG HANDLER: debug value =', debug);
    
    if (debug === 'version') {
      console.log('🔧 DEBUG VERSION CHECK TRIGGERED - Code deployed at:', new Date().toISOString());
      res.json({
        success: true,
        version: 'v7.0-debug-endpoint-fixed',
        timestamp: new Date().toISOString(),
        message: 'Debug endpoint now working correctly on Railway',
        queryParams: req.query,
        debugParam: debug,
        allParams: Object.keys(req.query || {}),
        railwayCompatible: true,
        status: 'Debug endpoint is functional'
      });
      return true;
    }
    
    console.log('🔧 DEBUG HANDLER: No debug=version found, returning false');
    return false;
  }
};
