import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('content-type', 'text/html; charset=utf-8')
  getHealth(): string {
    const health = this.appService.getHealth();

    return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Health Check - ${health.service}</title>
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
      .nav-links a.active-green { color: #86efac; font-weight: 700; }
      .nav-links a.active-green:hover { color: #86efac; }
      .hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
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
      h1 { margin: 10px 0 6px; font-size: 28px; }
      .muted { color: #93a4bd; margin: 0; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .metric {
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 12px;
        padding: 12px;
        background: rgba(15, 23, 42, 0.5);
      }
      .label { color: #93a4bd; font-size: 13px; margin-bottom: 5px; }
      .value { font-size: 15px; font-weight: 600; word-break: break-word; }
      .links a {
        color: #93c5fd;
        text-decoration: none;
        margin-right: 14px;
      }
      .links a:hover { text-decoration: underline; }
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
          <a href="/">Home</a>
          <a href="/api">API</a>
          <a class="active-green" href="/health">Health</a>
          <a href="/docs">Docs</a>
          <a href="/docs/openapi.json">OpenAPI</a>
        </div>
      </nav>

      <section class="card">
        <div class="hero">
          <div>
            <div class="status"><span class="dot"></span> Service Healthy</div>
            <h1>${health.service}</h1>
            <p class="muted">Health check page dengan status runtime real-time.</p>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="grid">
          <div class="metric"><div class="label">Status</div><div class="value">${health.status.toUpperCase()}</div></div>
          <div class="metric"><div class="label">Environment</div><div class="value">${health.environment}</div></div>
          <div class="metric"><div class="label">Version</div><div class="value">${health.version}</div></div>
          <div class="metric"><div class="label">Node</div><div class="value">${health.nodeVersion}</div></div>
          <div class="metric"><div class="label">Uptime</div><div class="value">${health.uptimeHuman} (${health.uptimeSeconds}s)</div></div>
          <div class="metric"><div class="label">Checked At</div><div class="value">${health.timestamp}</div></div>
          <div class="metric"><div class="label">RSS Memory</div><div class="value">${Math.round(health.memory.rss / 1024 / 1024)} MB</div></div>
          <div class="metric"><div class="label">Heap Used</div><div class="value">${Math.round(health.memory.heapUsed / 1024 / 1024)} MB</div></div>
        </div>
      </section>

      <section class="card links">
        <a href="${health.links.home}">Home</a>
        <a href="${health.links.swagger}">Swagger</a>
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
  </body>
</html>`;
  }
}
