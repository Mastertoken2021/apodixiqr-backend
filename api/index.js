const express = require('express');
const fetchReceipt = require('./api/fetch-receipt');
const app = express();

app.get('/api/fetch-receipt', fetchReceipt);

app.get('/', (req, res) => {
  res.send('🧾 ApodixiQR Puppeteer Backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
