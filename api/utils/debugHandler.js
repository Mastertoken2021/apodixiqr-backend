module.exports = {
  handleDebugEndpoint: (req, res) => {
    const { debug } = req.query;
    
    if (debug === 'version') {
      console.log('🔧 DEBUG VERSION CHECK - Code deployed at:', new Date().toISOString());
      res.json({
        success: true,
        version: 'v4.0-fixed-debug-endpoint',
        timestamp: new Date().toISOString(),
        message: 'Fixed debug endpoint - now checking debug parameter before URL validation',
        queryParams: req.query
      });
      return true;
    }
    
    return false;
  }
};
