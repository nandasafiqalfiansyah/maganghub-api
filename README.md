# Magang Hub Scraper API

API NestJS untuk scraping lowongan magang, list perusahaan, dan tracking filter lowongan berdasarkan email.

## Menjalankan project

```bash
npm install
npm run start:dev
```

Default server: `http://localhost:3000`

Swagger UI: `http://localhost:3000/`

Health check: `http://localhost:3000/health`

## Konfigurasi

Set optional environment variable:

- `MAGANG_HUB_BASE_URL` (default: `https://maganghub.com`)

Contoh:

```bash
MAGANG_HUB_BASE_URL=https://maganghub.com npm run start:dev
```

## API Docs

### 1) Scrape daftar lowongan

`GET /api/scrape/internships`

Query params:

- `keyword` (optional)
- `company` (optional)
- `limit` (optional, default 20, max 100)

Contoh:

```bash
curl "http://localhost:3000/api/scrape/internships?keyword=backend&limit=10"
```

Response ringkas:

```json
{
  "sourceUrl": "https://maganghub.com",
  "fetchedAt": "2026-02-23T10:00:00.000Z",
  "total": 2,
  "items": [
    {
      "title": "Backend Intern",
      "company": "PT Contoh",
      "url": "https://maganghub.com/jobs/backend-intern"
    }
  ]
}
```

### 2) Scrape list perusahaan

`GET /api/scrape/companies`

Query params:

- `keyword` (optional)
- `limit` (optional)

Contoh:

```bash
curl "http://localhost:3000/api/scrape/companies?keyword=data"
```

### 3) Tambah tracking berdasarkan email

`POST /api/tracking/email`

Body JSON:

```json
{
  "email": "user@example.com",
  "keyword": "backend",
  "company": "tokopedia"
}
```

Catatan: minimal salah satu dari `keyword` atau `company` wajib diisi.

### 4) Lihat tracking email

`GET /api/tracking/email/:email`

Contoh:

```bash
curl "http://localhost:3000/api/tracking/email/user@example.com"
```

### 5) Hapus tracking tertentu

`DELETE /api/tracking/email/:email/:trackingId`

### 6) Cek lowongan yang match untuk email

`GET /api/tracking/email/:email/matches`

Endpoint ini akan menjalankan scraping lalu filter berdasarkan semua tracking yang dimiliki email tersebut.

## Keterbatasan scraper

- Struktur website target bisa berubah kapan saja.
- Service menggunakan beberapa strategi (JSON feed dan HTML parsing), jadi akurasi mengikuti konten yang tersedia di website saat request dilakukan.
- Tracking saat ini disimpan in-memory (hilang saat server restart). Jika dibutuhkan, bisa dilanjutkan ke database (PostgreSQL/MySQL/MongoDB).

## Script penting

```bash
npm run build
npm run test
npm run lint
```
