# Magang Hub Scraper API

API NestJS untuk scraping lowongan magang, list perusahaan, dan tracking filter lowongan berdasarkan email.

## Menjalankan project

```bash
npm install
npm run start:dev
```

Default server: `http://localhost:3000`

Website: `http://localhost:3000/`

API list (non-doc): `http://localhost:3000/api`

Swagger UI: `http://localhost:3000/docs`

Health check (HTML page): `http://localhost:3000/health`

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

- `order_direction` (optional, default: `ASC`)
- `page` (optional, default: `1`)
- `limit` (optional, default: `21`)
- `per_page` (optional, default: `21`)

Contoh:

```bash
curl "http://localhost:3000/api/scrape/companies?order_direction=ASC&page=1&limit=21&per_page=21"
```

### 3) List provinsi

`GET /api/scrape/provinces`

Default request mengikuti endpoint Kemnaker:

```bash
curl "http://localhost:3000/api/scrape/provinces?order_by=nama_propinsi&order_direction=ASC&page=1&limit=all&per_page=all"
```

### 4) List kota/kabupaten

`GET /api/scrape/cities`

Default request mengikuti endpoint Kemnaker:

```bash
curl "http://localhost:3000/api/scrape/cities?order_by=nama_kabupaten&order_direction=ASC&page=1&limit=all&per_page=all"
```

### 5) Tambah tracking berdasarkan email

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

### 6) Lihat tracking email

`GET /api/tracking/email/:email`

Contoh:

```bash
curl "http://localhost:3000/api/tracking/email/user@example.com"
```

### 7) Hapus tracking tertentu

`DELETE /api/tracking/email/:email/:trackingId`

### 8) Cek lowongan yang match untuk email

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
