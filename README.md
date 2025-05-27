# ApodixiQR Backend

Backend service για την εφαρμογή ApodixiQR που επεξεργάζεται αποδείξεις από QR codes.

## Features

- REST API για επεξεργασία αποδείξεων
- CORS enabled για frontend integration
- Mock data support
- Railway deployment ready

## API Endpoints

### GET /
Health check endpoint

### GET /api/fetch-receipt?url={url}
Επεξεργάζεται απόδειξη από QR code URL

**Parameters:**
- `url` (required): Το URL της απόδειξης

**Response:**
```json
{
  "success": true,
  "data": {
    "storeName": "ΣΚΛΑΒΕΝΙΤΗΣ",
    "date": "2024-01-15",
    "total": "45.67",
    "items": [...],
    "vat": "5.67"
  }
}
