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
      ul { margin: 10px 0 0 18px; }
      li { margin: 6px 0; }
      .muted { color: #94a3b8; }
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
          <a href="/docs/openapi.json">OpenAPI</a>
        </div>
      </nav>

      <section class="card">
        <div class="status"><span class="dot"></span> Service Ready</div>
        <h1>Magang Hub Scraper API</h1>
        <p>API untuk scraping lowongan, list perusahaan, provinsi, kota, dan tracking by email.</p>
      </section>

      <section class="card">
        <p class="muted">Endpoint utama:</p>
        <ul>
          <li><code>GET /api/scrape/internships</code></li>
          <li><code>GET /api/scrape/companies</code></li>
          <li><code>GET /api/scrape/provinces</code></li>
          <li><code>GET /api/scrape/cities</code></li>
          <li><code>POST /api/tracking/email</code></li>
          <li><code>GET /api/tracking/email/:email</code></li>
          <li><code>GET /api/tracking/email/:email/matches</code></li>
        </ul>
      </section>
    </main>
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