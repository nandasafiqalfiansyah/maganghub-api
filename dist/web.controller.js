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
      :root { color-scheme: dark; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #050913;
        color: #e2e8f0;
        min-height: 100vh;
        overflow-x: hidden;
      }
      #three-canvas {
        position: fixed;
        inset: 0;
        z-index: 0;
      }
      /* CSS 3D floating orbs — always visible fallback */
      .orb {
        position: fixed;
        border-radius: 50%;
        filter: blur(70px);
        opacity: 0.22;
        z-index: 0;
        pointer-events: none;
        animation: orbFloat var(--dur, 10s) ease-in-out infinite var(--delay, 0s);
      }
      .orb1 { width: 520px; height: 520px; background: #3b82f6; top: -160px; left: -160px; --dur: 12s; }
      .orb2 { width: 400px; height: 400px; background: #818cf8; bottom: -120px; right: -120px; --dur: 10s; --delay: -3s; }
      .orb3 { width: 300px; height: 300px; background: #22c55e; top: 40%; left: 55%; --dur: 14s; --delay: -6s; }
      /* CSS 3D spinning rings */
      .ring-wrap {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        perspective: 900px;
        overflow: hidden;
      }
      .ring {
        position: absolute;
        border-radius: 50%;
        border: 2px solid rgba(99,102,241,.18);
        transform-style: preserve-3d;
        animation: ringRotate var(--rdur, 18s) linear infinite var(--rdelay, 0s);
      }
      .ring1 { width: 460px; height: 460px; top: calc(50% - 230px); left: calc(50% - 230px); --rdur: 18s; }
      .ring2 { width: 320px; height: 320px; top: 8%; right: 6%; border-color: rgba(59,130,246,.22); --rdur: 12s; --rdelay: -4s; }
      .ring3 { width: 200px; height: 200px; bottom: 12%; left: 8%; border-color: rgba(34,197,94,.18); --rdur: 10s; --rdelay: -8s; }
      .content {
        position: relative;
        z-index: 1;
        min-height: 100vh;
      }

      /* ── NAV ── */
      .nav {
        position: sticky;
        top: 14px;
        z-index: 10;
        max-width: 960px;
        margin: 14px auto 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.18);
        backdrop-filter: blur(12px);
        border-radius: 14px;
        padding: 12px 18px;
        animation: fadeDown .6s ease both;
      }
      .brand {
        font-size: 15px;
        color: #bfdbfe;
        font-weight: 800;
        letter-spacing: .5px;
      }
      .nav-links a {
        color: #cbd5e1;
        text-decoration: none;
        margin-left: 14px;
        font-size: 14px;
        transition: color .2s;
      }
      .nav-links a:hover { color: #93c5fd; }
      .nav-links a.active { color: #93c5fd; font-weight: 700; }

      /* ── HERO ── */
      .hero {
        max-width: 960px;
        margin: 0 auto;
        padding: 80px 18px 40px;
        text-align: center;
        animation: fadeUp .8s .1s ease both;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 999px;
        border: 1px solid rgba(34,197,94,.45);
        background: rgba(34,197,94,.1);
        font-size: 13px;
        color: #86efac;
        margin-bottom: 28px;
        animation: pulse-glow 2.5s infinite;
      }
      .dot {
        width: 9px; height: 9px;
        background: #22c55e;
        border-radius: 50%;
        animation: pulse 1.8s infinite;
      }
      .hero h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 900;
        line-height: 1.15;
        margin-bottom: 18px;
        background: linear-gradient(135deg, #e2e8f0 0%, #93c5fd 50%, #818cf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
        background-size: 200% auto;
      }
      .hero p {
        font-size: 1.1rem;
        color: #94a3b8;
        max-width: 560px;
        margin: 0 auto 36px;
        line-height: 1.7;
      }
      .cta-row {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 60px;
      }
      .btn-cta {
        padding: 12px 28px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 15px;
        text-decoration: none;
        cursor: pointer;
        border: none;
        transition: transform .2s, box-shadow .2s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(59,130,246,.35); }
      .btn-primary {
        background: linear-gradient(135deg, #3b82f6, #6366f1);
        color: #fff;
        box-shadow: 0 8px 24px rgba(99,102,241,.35);
      }
      .btn-secondary {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.28);
        color: #cbd5e1;
      }
      .btn-secondary:hover { box-shadow: 0 16px 40px rgba(0,0,0,.3); }

      /* ── STATS STRIP ── */
      .stats-strip {
        display: flex;
        justify-content: center;
        gap: 40px;
        flex-wrap: wrap;
        margin-bottom: 60px;
        animation: fadeUp .8s .25s ease both;
      }
      .stat { text-align: center; }
      .stat-num {
        font-size: 2rem;
        font-weight: 900;
        background: linear-gradient(135deg, #93c5fd, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .stat-label { font-size: 13px; color: #64748b; margin-top: 2px; }

      /* ── CARDS ── */
      .wrap {
        max-width: 960px;
        margin: 0 auto;
        padding: 0 18px 60px;
      }
      .card {
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.14);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 22px;
        margin-bottom: 18px;
        transition: transform .3s, border-color .3s, box-shadow .3s;
        animation: fadeUp .6s ease both;
      }
      .card:hover {
        transform: translateY(-4px);
        border-color: rgba(99,102,241,.4);
        box-shadow: 0 20px 60px rgba(99,102,241,.12);
      }
      .section-title {
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 16px;
      }

      /* ── FEATURE GRID ── */
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 14px;
        margin-bottom: 18px;
      }
      .feature {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.12);
        border-radius: 14px;
        padding: 16px;
        text-align: center;
        transition: transform .2s, border-color .2s;
        animation: float3d 6s ease-in-out infinite;
      }
      .feature:hover { transform: scale(1.06) translateZ(0); border-color: rgba(99,102,241,.4); }
      .feature:nth-child(2) { animation-delay: -.8s; }
      .feature:nth-child(3) { animation-delay: -1.6s; }
      .feature:nth-child(4) { animation-delay: -2.4s; }
      .feature-icon { font-size: 2rem; margin-bottom: 8px; display: block; }
      .feature-label { font-size: 13px; font-weight: 700; color: #bfdbfe; margin-bottom: 4px; }
      .feature-desc { font-size: 12px; color: #64748b; }

      /* ── SEARCH PANEL ── */
      .grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
      .panel {
        border: 1px solid rgba(148, 163, 184, 0.14);
        border-radius: 14px;
        padding: 16px;
        background: rgba(15, 23, 42, 0.5);
      }
      .panel-title { color: #bfdbfe; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
      .input-col { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
      input {
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 10px 12px;
        background: #0f172a;
        color: #e2e8f0;
        font-size: 14px;
        outline: none;
        transition: border-color .2s;
      }
      input:focus { border-color: rgba(99,102,241,.6); }
      input::placeholder { color: #475569; }
      .btn {
        border: 1px solid rgba(59, 130, 246, 0.45);
        border-radius: 10px;
        padding: 10px 16px;
        background: rgba(59, 130, 246, 0.14);
        color: #93c5fd;
        cursor: pointer;
        font-weight: 700;
        font-size: 14px;
        transition: background .2s, transform .15s;
      }
      .btn:hover { background: rgba(59, 130, 246, 0.26); transform: translateY(-1px); }
      .btn.secondary {
        border-color: rgba(148, 163, 184, 0.28);
        background: rgba(148, 163, 184, 0.08);
        color: #cbd5e1;
      }
      .btn.secondary:hover { background: rgba(148, 163, 184, 0.16); }
      .btn-group { display: flex; flex-wrap: wrap; gap: 8px; }

      /* ── RESULT ── */
      .result-meta { font-size: 13px; color: #bfdbfe; margin-bottom: 10px; }
      .result-empty { color: #475569; border: 1px dashed rgba(148, 163, 184, 0.2); border-radius: 10px; padding: 14px; font-size: 14px; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 720px; }
      th, td { border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding: 10px 8px; text-align: left; vertical-align: top; }
      th { color: #bfdbfe; font-weight: 700; font-size: 13px; }
      td { color: #cbd5e1; font-size: 14px; }
      code { background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; padding: 2px 7px; font-size: 13px; }
      .method { display: inline-block; border-radius: 999px; padding: 3px 10px; border: 1px solid rgba(148,163,184,.25); font-size: 12px; font-weight: 700; }
      .get { color: #93c5fd; border-color: rgba(59,130,246,.45); background: rgba(59,130,246,.12); }
      .post { color: #86efac; border-color: rgba(34,197,94,.45); background: rgba(34,197,94,.12); }
      .delete { color: #fca5a5; border-color: rgba(239,68,68,.45); background: rgba(239,68,68,.12); }

      /* ── GITHUB CORNER ── */
      .github-corner {
        position: fixed; right: 16px; bottom: 16px;
        width: 44px; height: 44px;
        border-radius: 50%;
        display: inline-flex; align-items: center; justify-content: center;
        color: #e2e8f0;
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(148, 163, 184, 0.28);
        text-decoration: none; z-index: 20;
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.45);
        transition: color .2s, border-color .2s, transform .2s;
      }
      .github-corner:hover { color: #93c5fd; border-color: rgba(59,130,246,.45); transform: scale(1.1); }

      /* ── KEYFRAMES ── */
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(34,197,94,.6); }
        70% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
        100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
      }
      @keyframes pulse-glow {
        0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        50% { box-shadow: 0 0 16px 2px rgba(34,197,94,.25); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeDown {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes float3d {
        0%,100% { transform: translateY(0) rotateX(0deg); }
        50% { transform: translateY(-6px) rotateX(2deg); }
      }
      @keyframes orbFloat {
        0%,100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(40px, -30px) scale(1.08); }
        66% { transform: translate(-30px, 20px) scale(0.95); }
      }
      @keyframes ringRotate {
        0% { transform: rotateX(65deg) rotateZ(0deg); }
        100% { transform: rotateX(65deg) rotateZ(360deg); }
      }
    </style>
  </head>
  <body>
    <canvas id="three-canvas"></canvas>
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
    <div class="orb orb3"></div>
    <div class="ring-wrap">
      <div class="ring ring1"></div>
      <div class="ring ring2"></div>
      <div class="ring ring3"></div>
    </div>

    <div class="content">
      <nav class="nav">
        <div class="brand">⚡ Magang Hub API</div>
        <div class="nav-links">
          <a class="active" href="/">Home</a>
          <a href="/docs">Docs</a>
        </div>
      </nav>

      <section class="hero">
        <div class="hero-badge"><span class="dot"></span> Service Ready</div>
        <h1>Magang Hub<br>Scraper API</h1>
        <p>API canggih untuk scraping lowongan magang, list perusahaan, provinsi, kota, dan tracking by email — real-time &amp; cepat.</p>
        <div class="cta-row">
          <a class="btn-cta btn-primary" href="/docs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            Lihat Swagger Docs
          </a>
          <a class="btn-cta btn-secondary" href="https://github.com/nandasafiqalfiansyah/maganghub-api" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.1-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .1-.78.42-1.31.76-1.61-2.67-.31-5.48-1.34-5.48-5.97 0-1.32.47-2.4 1.23-3.25-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.3 1.24a11.4 11.4 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.66.24 2.89.12 3.19.77.85 1.23 1.93 1.23 3.25 0 4.65-2.81 5.65-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>
            GitHub
          </a>
        </div>

        <div class="stats-strip">
          <div class="stat"><div class="stat-num">8+</div><div class="stat-label">Endpoints</div></div>
          <div class="stat"><div class="stat-num">4</div><div class="stat-label">Sumber Data</div></div>
          <div class="stat"><div class="stat-num">∞</div><div class="stat-label">Real-time</div></div>
        </div>
      </section>

      <div class="wrap">
        <div class="card" style="animation-delay:.05s">
          <div class="section-title">Fitur Utama</div>
          <div class="feature-grid">
            <div class="feature">
              <span class="feature-icon">🔍</span>
              <div class="feature-label">Internship Search</div>
              <div class="feature-desc">Cari lowongan dengan keyword &amp; filter</div>
            </div>
            <div class="feature">
              <span class="feature-icon">🏢</span>
              <div class="feature-label">Companies</div>
              <div class="feature-desc">List perusahaan dengan paginasi</div>
            </div>
            <div class="feature">
              <span class="feature-icon">📍</span>
              <div class="feature-label">Wilayah</div>
              <div class="feature-desc">Provinsi &amp; kota seluruh Indonesia</div>
            </div>
            <div class="feature">
              <span class="feature-icon">📧</span>
              <div class="feature-label">Email Tracking</div>
              <div class="feature-desc">Track lowongan &amp; notifikasi match</div>
            </div>
          </div>
        </div>

        <div class="card" style="animation-delay:.1s">
          <div class="section-title">Quick API Test</div>
          <div class="grid2">
            <div class="panel">
              <div class="panel-title">Search Internship (GET)</div>
              <form id="internship-search-form">
                <div class="input-col">
                  <input id="search-keyword" placeholder="keyword, contoh: backend" />
                  <input id="search-company" placeholder="company, contoh: tokopedia" />
                  <input id="search-limit" type="number" min="1" max="100" placeholder="limit, contoh: 20" />
                </div>
                <button class="btn" type="submit">Search / Get Data</button>
              </form>
            </div>
            <div class="panel">
              <div class="panel-title">Quick GET All</div>
              <div class="btn-group">
                <button class="btn secondary" id="load-internships" type="button">Internships</button>
                <button class="btn secondary" id="load-companies" type="button">Companies</button>
                <button class="btn secondary" id="load-provinces" type="button">Provinces</button>
                <button class="btn secondary" id="load-cities" type="button">Cities</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="animation-delay:.15s">
          <div class="section-title">Hasil API</div>
          <div id="result-meta" class="result-meta">Belum ada request.</div>
          <div id="result-table" class="result-empty">Sample data akan tampil di sini.</div>
        </div>

        <div class="card table-wrap" style="animation-delay:.2s">
          <div class="section-title">Semua Endpoint</div>
          <table>
            <thead>
              <tr><th>Method</th><th>Path</th><th>Keterangan</th><th>Query / Body</th></tr>
            </thead>
            <tbody>
              <tr><td><span class="method get">GET</span></td><td><code>/api/scrape/internships</code></td><td>Scrape daftar lowongan magang</td><td style="color:#64748b">query: keyword, company, limit</td></tr>
              <tr><td><span class="method get">GET</span></td><td><code>/api/scrape/companies</code></td><td>Ambil list perusahaan</td><td style="color:#64748b">query: order_direction, page, limit, per_page</td></tr>
              <tr><td><span class="method get">GET</span></td><td><code>/api/scrape/provinces</code></td><td>Ambil list provinsi</td><td style="color:#64748b">query: order_by, order_direction, page, limit, per_page</td></tr>
              <tr><td><span class="method get">GET</span></td><td><code>/api/scrape/cities</code></td><td>Ambil list kota/kabupaten</td><td style="color:#64748b">query: order_by, order_direction, page, limit, per_page</td></tr>
              <tr><td><span class="method post">POST</span></td><td><code>/api/tracking/email</code></td><td>Tambah tracking berdasarkan email</td><td style="color:#64748b">body: email, keyword?, company?</td></tr>
              <tr><td><span class="method get">GET</span></td><td><code>/api/tracking/email/:email</code></td><td>Lihat daftar tracking milik email</td><td style="color:#64748b">path param: email</td></tr>
              <tr><td><span class="method delete">DELETE</span></td><td><code>/api/tracking/email/:email/:trackingId</code></td><td>Hapus tracking tertentu</td><td style="color:#64748b">path param: email, trackingId</td></tr>
              <tr><td><span class="method get">GET</span></td><td><code>/api/tracking/email/:email/matches</code></td><td>Cek lowongan yang match untuk email</td><td style="color:#64748b">path param: email</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <a class="github-corner" href="https://github.com/nandasafiqalfiansyah/maganghub-api" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" title="GitHub Repository">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.1-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .1-.78.42-1.31.76-1.61-2.67-.31-5.48-1.34-5.48-5.97 0-1.32.47-2.4 1.23-3.25-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.3 1.24a11.4 11.4 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.66.24 2.89.12 3.19.77.85 1.23 1.93 1.23 3.25 0 4.65-2.81 5.65-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>
    </a>

    <script src="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.min.js"></script>
    <script>
    (function () {
      /* ── THREE.JS 3D BACKGROUND ── */
      try {
        var canvas = document.getElementById('three-canvas');
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 40;

      /* Ambient + point lights */
      scene.add(new THREE.AmbientLight(0x334466, 1.5));
      var pt1 = new THREE.PointLight(0x3b82f6, 120, 80);
      pt1.position.set(20, 20, 10);
      scene.add(pt1);
      var pt2 = new THREE.PointLight(0x818cf8, 80, 60);
      pt2.position.set(-20, -15, 5);
      scene.add(pt2);
      var pt3 = new THREE.PointLight(0x22c55e, 50, 50);
      pt3.position.set(0, 20, -10);
      scene.add(pt3);

      /* Floating torus knot */
      var torusGeo = new THREE.TorusKnotGeometry(7, 2, 128, 20);
      var torusMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.25,
        metalness: 0.7,
        wireframe: false,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.3,
      });
      var torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.position.set(18, 4, -10);
      scene.add(torusMesh);

      /* Wireframe icosahedron */
      var icoGeo = new THREE.IcosahedronGeometry(5, 1);
      var icoMat = new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        roughness: 0.4,
        metalness: 0.6,
        wireframe: true,
      });
      var icoMesh = new THREE.Mesh(icoGeo, icoMat);
      icoMesh.position.set(-20, -6, -8);
      scene.add(icoMesh);

      /* Particle field */
      var MAX_PARTICLE_COUNT = window.matchMedia('(max-width: 768px)').matches ? 300 : 600;
      var positions = new Float32Array(MAX_PARTICLE_COUNT * 3);
      for (var i = 0; i < MAX_PARTICLE_COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 160;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      }
      var particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var particleMat = new THREE.PointsMaterial({ color: 0x4f86c6, size: 0.28, transparent: true, opacity: 0.75 });
      var particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      /* Small orbiting spheres */
      var orbiters = [];
      var orbitColors = [0x3b82f6, 0x818cf8, 0x22c55e, 0x0ea5e9, 0xa78bfa];
      for (var j = 0; j < 5; j++) {
        var sg = new THREE.SphereGeometry(0.55 + Math.random() * 0.5, 16, 16);
        var sm = new THREE.MeshStandardMaterial({ color: orbitColors[j], metalness: 0.8, roughness: 0.2, emissive: orbitColors[j], emissiveIntensity: 0.4 });
        var sphere = new THREE.Mesh(sg, sm);
        sphere.userData.radius  = 10 + j * 5;
        sphere.userData.speed   = 0.004 + j * 0.002;
        sphere.userData.angle   = (j / 5) * Math.PI * 2;
        sphere.userData.yOffset = (Math.random() - 0.5) * 8;
        scene.add(sphere);
        orbiters.push(sphere);
      }

      /* Mouse parallax */
      var mouse = { x: 0, y: 0 };
      window.addEventListener('mousemove', function (e) {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      });

      window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      /* Animate */
      var clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        var t = clock.getElapsedTime();

        torusMesh.rotation.x = t * 0.22;
        torusMesh.rotation.y = t * 0.15;
        icoMesh.rotation.x   = t * 0.18;
        icoMesh.rotation.y   = t * 0.25;
        particles.rotation.y = t * 0.018;
        particles.rotation.x = t * 0.008;

        for (var k = 0; k < orbiters.length; k++) {
          orbiters[k].userData.angle += orbiters[k].userData.speed;
          var a = orbiters[k].userData.angle;
          var r = orbiters[k].userData.radius;
          orbiters[k].position.x = Math.cos(a) * r;
          orbiters[k].position.z = Math.sin(a) * r - 10;
          orbiters[k].position.y = orbiters[k].userData.yOffset + Math.sin(a * 1.5) * 3;
        }

        camera.position.x += (mouse.x * 3 - camera.position.x) * 0.04;
        camera.position.y += (mouse.y * 2 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      animate();
      } catch (e) { console.error('Three.js initialization failed:', e); /* CSS fallback active */ }

      /* ── API TEST PANEL ── */
      var form = document.getElementById('internship-search-form');
      var keywordInput = document.getElementById('search-keyword');
      var companyInput = document.getElementById('search-company');
      var limitInput   = document.getElementById('search-limit');
      var resultMeta   = document.getElementById('result-meta');
      var resultTable  = document.getElementById('result-table');

      function pickList(payload) {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== 'object') return [];
        if (Array.isArray(payload.items))     return payload.items;
        if (Array.isArray(payload.companies)) return payload.companies;
        if (Array.isArray(payload.data))      return payload.data;
        if (Array.isArray(payload.results))   return payload.results;
        if (Array.isArray(payload.result))    return payload.result;
        if (payload.data && typeof payload.data === 'object') {
          if (Array.isArray(payload.data.items))     return payload.data.items;
          if (Array.isArray(payload.data.companies)) return payload.data.companies;
          if (Array.isArray(payload.data.results))   return payload.data.results;
        }
        return [];
      }

      function escapeHtml(v) {
        return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
      }

      function renderTableRows(list) {
        if (!list.length) {
          resultTable.className = 'result-empty';
          resultTable.innerHTML = 'Tidak ada item untuk ditampilkan.';
          return;
        }
        var sample = list.slice(0, 10);
        var keysMap = {};
        for (var i = 0; i < sample.length; i++) {
          Object.keys(sample[i] || {}).forEach(function (k) { keysMap[k] = true; });
        }
        var keys = Object.keys(keysMap).slice(0, 6);
        var headerHtml = keys.map(function (k) { return '<th>' + escapeHtml(k) + '</th>'; }).join('');
        var bodyHtml = sample.map(function (row) {
          return '<tr>' + keys.map(function (k) {
            var v = row && row[k] != null ? row[k] : '';
            if (typeof v === 'object') v = JSON.stringify(v);
            return '<td>' + escapeHtml(v) + '</td>';
          }).join('') + '</tr>';
        }).join('');
        resultTable.className = 'table-wrap';
        resultTable.innerHTML = '<table><thead><tr>' + headerHtml + '</tr></thead><tbody>' + bodyHtml + '</tbody></table>';
      }

      async function fetchAndRender(url, label) {
        resultMeta.textContent = 'Loading ' + label + '...';
        resultTable.className = 'result-empty';
        resultTable.textContent = 'Mengambil data...';
        try {
          var res = await fetch(url, { headers: { Accept: 'application/json' } });
          var payload = await res.json();
          var list = pickList(payload);
          var total = Array.isArray(payload) ? payload.length : (typeof payload.total === 'number' ? payload.total : list.length);
          resultMeta.textContent = label + ' • status ' + res.status + ' • total ' + total + ' • max 10 baris';
          renderTableRows(list);
        } catch (e) {
          resultMeta.textContent = label + ' • gagal';
          resultTable.className = 'result-empty';
          resultTable.textContent = 'Error: ' + (e && e.message ? e.message : 'Unknown error');
        }
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var params = new URLSearchParams();
        var kw = keywordInput.value.trim();
        var co = companyInput.value.trim();
        var lm = limitInput.value.trim();
        if (kw) params.set('keyword', kw);
        if (co) params.set('company', co);
        if (lm) params.set('limit', lm);
        fetchAndRender('/api/scrape/internships' + (params.toString() ? '?' + params : ''), 'Internship Search');
      });

      document.getElementById('load-internships').addEventListener('click', function () { fetchAndRender('/api/scrape/internships', 'Internships'); });
      document.getElementById('load-companies').addEventListener('click',   function () { fetchAndRender('/api/scrape/companies', 'Companies'); });
      document.getElementById('load-provinces').addEventListener('click',   function () { fetchAndRender('/api/scrape/provinces', 'Provinces'); });
      document.getElementById('load-cities').addEventListener('click',      function () { fetchAndRender('/api/scrape/cities', 'Cities'); });
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