
module.exports = {
  handleDebugEndpoint: (req, res) => {
    console.log('🔧 DEBUG HANDLER: Checking debug parameter...');
    console.log('🔧 DEBUG HANDLER: req.query.debug =', req.query.debug);
    
    const { debug } = req.query;
    
    if (debug === 'version') {
      console.log('🔧 DEBUG VERSION CHECK TRIGGERED - Code deployed at:', new Date().toISOString());
      res.json({
        success: true,
        version: 'v5.0-enhanced-debugging',
        timestamp: new Date().toISOString(),
        message: 'Enhanced debugging - checking parameter parsing',
        queryParams: req.query,
        debugParam: debug,
        allParams: Object.keys(req.query)
      });
      return true;
    }
    
    console.log('🔧 DEBUG HANDLER: No debug=version found, returning false');
    return false;
  }
};
