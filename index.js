const express = require('express');
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🧾 ApodixiQR Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Mock receipt endpoint (για τώρα)
app.get('/api/fetch-receipt', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ 
      error: "Missing URL parameter"
    });
  }

  // Επιστροφή mock data προσωρινά
  res.json({
    success: true,
    data: {
      storeName: "ΣΚΛΑΒΕΝΙΤΗΣ",
      date: "2024-01-15",
      time: "14:30:25",
      total: "45.67",
      items: [
        { name: "ΓΑΛΑ ΦΡΕΣΚΟ 1L", price: "1.89", quantity: "2" },
        { name: "ΨΩΜΙ ΤΟΣΤ", price: "2.45", quantity: "1" },
        { name: "ΜΠΑΝΑΝΕΣ ΚΓ", price: "3.20", quantity: "1.5" }
      ],
      vat: "5.67",
      payment_method: "ΚΑΡΤΑ"
    },
    url: url,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
