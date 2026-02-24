"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebController = void 0;
const common_1 = require("@nestjs/common");
let WebController = class WebController {
    home() {
        return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Magang Hub API</title>
    <style>
      :root {
        color-scheme: dark;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: radial-gradient(circle at 20% 10%, #1e293b 0%, #0b1220 40%, #050913 100%);
        color: #e2e8f0;
        min-height: 100vh;
        overflow-x: hidden;
      }
      .bg-glow {
        position: fixed;
        width: 380px;
        height: 380px;
        border-radius: 999px;
        filter: blur(64px);
        opacity: 0.35;
        z-index: 0;
        animation: float 8s ease-in-out infinite;
      }
      .g1 { background: #22c55e; top: -120px; left: -120px; }
      .g2 { background: #3b82f6; right: -120px; bottom: -140px; animation-delay: -2s; }
      .wrap {
        position: relative;
        z-index: 1;
        max-width: 920px;
        margin: 0 auto;
        padding: 20px 18px 42px;
      }
      .nav {
        position: sticky;
        top: 14px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: rgba(15, 23, 42, 0.78);
        border: 1px solid rgba(148, 163, 184, 0.18);
        backdrop-filter: blur(8px);
        border-radius: 14px;
        padding: 12px 14px;
        margin-bottom: 14px;
      }
      .brand {
        font-size: 14px;
        color: #bfdbfe;
        font-weight: 700;
      }
      .nav-links a {
        color: #cbd5e1;
        text-decoration: none;
        margin-left: 10px;
        font-size: 14px;
      }
      .nav-links a:hover { color: #93c5fd; }
      .nav-links a.active { color: #93c5fd; font-weight: 600; }
      .status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px solid rgba(34,197,94,.45);
        background: rgba(34,197,94,.12);
      }
      .dot {
        width: 10px;
        height: 10px;
        background: #22c55e;
        border-radius: 999px;
        box-shadow: 0 0 0 rgba(34,197,94,.6);
        animation: pulse 1.7s infinite;
      }
      .card {
        background: rgba(15, 23, 42, 0.78);
        border: 1px solid rgba(148, 163, 184, 0.18);
        backdrop-filter: blur(8px);
        border-radius: 16px;
        padding: 18px;
        margin-bottom: 14px;
        animation: fadeUp .5s ease both;
      }
      h1 { margin: 10px 0 6px; font-size: 28px; }
      p { margin: 0 0 8px 0; color: #93a4bd; }
      code {
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 8px;
        padding: 2px 8px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
      }
      .panel {
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 12px;
        padding: 12px;
        background: rgba(15, 23, 42, 0.5);
      }
      .panel-title {
        margin: 0 0 8px;
        color: #bfdbfe;
        font-weight: 700;
        font-size: 14px;
      }
      .input-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        margin-bottom: 10px;
      }
      input {
        width: 100%;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 10px 11px;
        background: #0f172a;
        color: #e2e8f0;
      }
      input::placeholder {
        color: #64748b;
      }
      .btn {
        border: 1px solid rgba(59, 130, 246, 0.45);
        border-radius: 10px;
        padding: 10px 12px;
        background: rgba(59, 130, 246, 0.12);
        color: #93c5fd;
        cursor: pointer;
        font-weight: 700;
      }
      .btn:hover {
        background: rgba(59, 130, 246, 0.2);
      }
      .btn.secondary {
        border-color: rgba(148, 163, 184, 0.35);
        background: rgba(148, 163, 184, 0.08);
        color: #cbd5e1;
        font-weight: 600;
      }
      .btn.secondary:hover {
        background: rgba(148, 163, 184, 0.16);
      }
      .btn-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .quick-links a {
        display: inline-block;
        margin: 4px 8px 4px 0;
        padding: 7px 10px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 999px;
        color: #cbd5e1;
        text-decoration: none;
        font-size: 13px;
      }
      .quick-links a:hover {
        color: #93c5fd;
        border-color: rgba(59, 130, 246, 0.45);
      }
      .table-wrap {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 760px;
      }
      th, td {
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        padding: 10px 8px;
        text-align: left;
        vertical-align: top;
      }
      th {
        color: #bfdbfe;
        font-weight: 700;
        font-size: 13px;
      }
      td {
        color: #cbd5e1;
        font-size: 14px;
      }
      .method {
        display: inline-block;
        border-radius: 999px;
        padding: 3px 10px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        font-size: 12px;
        font-weight: 700;
      }
      .get { color: #93c5fd; border-color: rgba(59, 130, 246, 0.45); background: rgba(59, 130, 246, 0.12); }
      .post { color: #86efac; border-color: rgba(34, 197, 94, 0.45); background: rgba(34, 197, 94, 0.12); }
      .delete { color: #fca5a5; border-color: rgba(239, 68, 68, 0.45); background: rgba(239, 68, 68, 0.12); }
      ul { margin: 10px 0 0 18px; }
      li { margin: 6px 0; }
      .muted { color: #94a3b8; }
      .result-meta {
        margin-bottom: 10px;
        color: #bfdbfe;
        font-size: 14px;
      }
      .result-empty {
        color: #94a3b8;
        border: 1px dashed rgba(148, 163, 184, 0.3);
        border-radius: 10px;
        padding: 12px;
      }
      .github-corner {
        position: fixed;
        right: 16px;
        bottom: 16px;
        width: 44px;
        height: 44px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #e2e8f0;
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(148, 163, 184, 0.28);
        text-decoration: none;
        z-index: 20;
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.45);
      }
      .github-corner:hover {
        color: #93c5fd;
        border-color: rgba(59, 130, 246, 0.45);
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(34,197,94,.6); }
        70% { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
        100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
      }
      @keyframes float {
        0%,100% { transform: translateY(0px); }
        50% { transform: translateY(-22px); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  </head>
  <body>
    <div class="bg-glow g1"></div>
    <div class="bg-glow g2"></div>

    <main class="wrap">
      <nav class="nav">
        <div class="brand">Magang Hub API</div>
        <div class="nav-links">
          <a class="active" href="/">Home</a>
          <a href="/health">Health</a>
          <a href="/docs">Docs</a>
        </div>
      </nav>

      <section class="card">
        <div class="status"><span class="dot"></span> Service Ready</div>
        <h1>Magang Hub Scraper API</h1>
        <p>API untuk scraping lowongan, list perusahaan, provinsi, kota, dan tracking by email.</p>
      </section>

      <section class="card">
        <p class="muted">Quick view & search API:</p>
        <div class="grid">
          <div class="panel">
            <p class="panel-title">Search Internship (GET)</p>
            <form id="internship-search-form">
              <div class="input-row">
                <input id="search-keyword" name="keyword" placeholder="keyword, contoh: backend" />
                <input id="search-company" name="company" placeholder="company, contoh: tokopedia" />
                <input id="search-limit" name="limit" type="number" min="1" max="100" placeholder="limit, contoh: 20" />
              </div>
              <button class="btn" type="submit">Search / Get Data</button>
            </form>
          </div>
          <div class="panel">
            <p class="panel-title">Quick GET All</p>
            <div class="btn-group">
              <button class="btn secondary" id="load-internships" type="button">Internships</button>
              <button class="btn secondary" id="load-companies" type="button">Companies</button>
              <button class="btn secondary" id="load-provinces" type="button">Provinces</button>
              <button class="btn secondary" id="load-cities" type="button">Cities</button>
            </div>
          </div>
        </div>
      </section>

      <section class="card">
        <p class="panel-title">Hasil API di halaman ini</p>
        <div id="result-meta" class="result-meta">Belum ada request. Jalankan search atau pilih quick GET.</div>
        <div id="result-table" class="table-wrap result-empty">Sample data akan tampil di sini.</div>
      </section>

      <section class="card table-wrap">
        <p class="muted">Semua endpoint API:</p>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Path</th>
              <th>Keterangan</th>
              <th>Query / Body</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="method get">GET</span></td>
              <td><code>/api/scrape/internships</code></td>
              <td>Scrape daftar lowongan magang</td>
              <td class="muted">query: keyword, company, limit</td>
            </tr>
            <tr>
              <td><span class="method get">GET</span></td>
              <td><code>/api/scrape/companies</code></td>
              <td>Ambil list perusahaan</td>
              <td class="muted">query: order_direction, page, limit, per_page</td>
            </tr>
            <tr>
              <td><span class="method get">GET</span></td>
              <td><code>/api/scrape/provinces</code></td>
              <td>Ambil list provinsi</td>
              <td class="muted">query: order_by, order_direction, page, limit, per_page</td>
            </tr>
            <tr>
              <td><span class="method get">GET</span></td>
              <td><code>/api/scrape/cities</code></td>
              <td>Ambil list kota/kabupaten</td>
              <td class="muted">query: order_by, order_direction, page, limit, per_page</td>
            </tr>
            <tr>
              <td><span class="method post">POST</span></td>
              <td><code>/api/tracking/email</code></td>
              <td>Tambah tracking berdasarkan email</td>
              <td class="muted">body: email, keyword?, company?</td>
            </tr>
            <tr>
              <td><span class="method get">GET</span></td>
              <td><code>/api/tracking/email/:email</code></td>
              <td>Lihat daftar tracking milik email</td>
              <td class="muted">path param: email</td>
            </tr>
            <tr>
              <td><span class="method delete">DELETE</span></td>
              <td><code>/api/tracking/email/:email/:trackingId</code></td>
              <td>Hapus tracking tertentu</td>
              <td class="muted">path param: email, trackingId</td>
            </tr>
            <tr>
              <td><span class="method get">GET</span></td>
              <td><code>/api/tracking/email/:email/matches</code></td>
              <td>Cek lowongan yang match untuk email</td>
              <td class="muted">path param: email</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
    <a
      class="github-corner"
      href="https://github.com/nandasafiqalfiansyah/maganghub-api"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub Repository"
      title="GitHub Repository"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.1-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .1-.78.42-1.31.76-1.61-2.67-.31-5.48-1.34-5.48-5.97 0-1.32.47-2.4 1.23-3.25-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.3 1.24a11.4 11.4 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.66.24 2.89.12 3.19.77.85 1.23 1.93 1.23 3.25 0 4.65-2.81 5.65-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>
      </svg>
    </a>
    <script>
      (function () {
        var form = document.getElementById('internship-search-form');
        var keywordInput = document.getElementById('search-keyword');
        var companyInput = document.getElementById('search-company');
        var limitInput = document.getElementById('search-limit');

        var resultMeta = document.getElementById('result-meta');
        var resultTable = document.getElementById('result-table');
        function pickList(payload) {
          if (Array.isArray(payload)) return payload;
          if (!payload || typeof payload !== 'object') return [];
          if (Array.isArray(payload.items)) return payload.items;
          if (Array.isArray(payload.companies)) return payload.companies;
          if (Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload.results)) return payload.results;
          if (Array.isArray(payload.result)) return payload.result;
          if (payload.data && typeof payload.data === 'object') {
            if (Array.isArray(payload.data.items)) return payload.data.items;
            if (Array.isArray(payload.data.companies)) return payload.data.companies;
            if (Array.isArray(payload.data.results)) return payload.data.results;
          }
          return [];
        }

        function escapeHtml(value) {
          return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }

        function renderTableRows(list) {
          if (!list.length) {
            resultTable.className = 'table-wrap result-empty';
            resultTable.innerHTML = 'Tidak ada item untuk ditampilkan.';
            return;
          }

          var sample = list.slice(0, 10);
          var keysMap = {};
          for (var i = 0; i < sample.length; i += 1) {
            var row = sample[i] || {};
            Object.keys(row).forEach(function (key) {
              keysMap[key] = true;
            });
          }

          var keys = Object.keys(keysMap).slice(0, 6);
          var headerHtml = keys.map(function (key) {
            return '<th>' + escapeHtml(key) + '</th>';
          }).join('');

          var bodyHtml = sample.map(function (row) {
            return '<tr>' + keys.map(function (key) {
              var value = row && row[key] !== undefined && row[key] !== null ? row[key] : '';
              if (typeof value === 'object') {
                value = JSON.stringify(value);
              }
              return '<td>' + escapeHtml(value) + '</td>';
            }).join('') + '</tr>';
          }).join('');

          resultTable.className = 'table-wrap';
          resultTable.innerHTML = '<table><thead><tr>' + headerHtml + '</tr></thead><tbody>' + bodyHtml + '</tbody></table>';
        }

        async function fetchAndRender(url, label) {
          resultMeta.textContent = 'Loading ' + label + '...';
          resultTable.className = 'table-wrap result-empty';
          resultTable.textContent = 'Mengambil data...';

          try {
            var response = await fetch(url, { headers: { Accept: 'application/json' } });
            var payload = await response.json();
            var list = pickList(payload);

            var total = Array.isArray(payload) ? payload.length : (typeof payload.total === 'number' ? payload.total : list.length);
            resultMeta.textContent = label + ' • status ' + response.status + ' • total ' + total + ' • menampilkan sample max 10 baris';

            renderTableRows(list);
          } catch (error) {
            resultMeta.textContent = label + ' • gagal mengambil data';
            resultTable.className = 'table-wrap result-empty';
            resultTable.textContent = 'Error: ' + (error && error.message ? error.message : 'Unknown error');
          }
        }

        form.addEventListener('submit', function (event) {
          event.preventDefault();

          var params = new URLSearchParams();
          var keyword = keywordInput.value.trim();
          var company = companyInput.value.trim();
          var limit = limitInput.value.trim();

          if (keyword) params.set('keyword', keyword);
          if (company) params.set('company', company);
          if (limit) params.set('limit', limit);

          var query = params.toString();
          var url = '/api/scrape/internships' + (query ? '?' + query : '');
          fetchAndRender(url, 'Internship Search');
        });

        document.getElementById('load-internships').addEventListener('click', function () {
          fetchAndRender('/api/scrape/internships', 'Internships');
        });

        document.getElementById('load-companies').addEventListener('click', function () {
          fetchAndRender('/api/scrape/companies', 'Companies');
        });

        document.getElementById('load-provinces').addEventListener('click', function () {
          fetchAndRender('/api/scrape/provinces', 'Provinces');
        });

        document.getElementById('load-cities').addEventListener('click', function () {
          fetchAndRender('/api/scrape/cities', 'Cities');
        });
      })();
    </script>
  </body>
</html>`;
    }
};
exports.WebController = WebController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Header)('content-type', 'text/html; charset=utf-8'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], WebController.prototype, "home", null);
exports.WebController = WebController = __decorate([
    (0, common_1.Controller)()
], WebController);
//# sourceMappingURL=web.controller.js.map