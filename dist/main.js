"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Magang Hub Scraper API')
        .setDescription('API untuk scraping lowongan magang, list perusahaan, dan tracking by email')
        .setVersion('1.0.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        customCssUrl: ['https://unpkg.com/swagger-ui-dist@5/swagger-ui.css'],
        customCss: `
      body { background: radial-gradient(circle at 20% 10%, #1e293b 0%, #0b1220 40%, #050913 100%) !important; }
      .swagger-ui .topbar { display: none; }
      #copilot-custom-nav {
        position: sticky;
        top: 14px;
        z-index: 1000;
        margin: 16px auto 12px;
        max-width: 1100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: rgba(15, 23, 42, 0.78);
        border: 1px solid rgba(148, 163, 184, 0.18);
        backdrop-filter: blur(8px);
        border-radius: 14px;
        padding: 12px 14px;
      }
      #copilot-custom-nav .brand { color: #bfdbfe; font-weight: 700; font-family: Inter, sans-serif; font-size: 14px; }
      #copilot-custom-nav a { color: #cbd5e1; text-decoration: none; margin-left: 10px; font-family: Inter, sans-serif; font-size: 14px; }
      #copilot-custom-nav a:hover { color: #93c5fd; }
      #copilot-custom-nav a.active { color: #93c5fd; font-weight: 700; }
      #copilot-github-corner {
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
        z-index: 1100;
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.45);
      }
      #copilot-github-corner:hover {
        color: #93c5fd;
        border-color: rgba(59, 130, 246, 0.45);
      }
      .swagger-ui { max-width: 1100px; margin: 0 auto; padding: 0 10px 30px; }
      .swagger-ui .information-container,
      .swagger-ui .scheme-container,
      .swagger-ui .opblock,
      .swagger-ui .opblock-tag,
      .swagger-ui .responses-wrapper,
      .swagger-ui .opblock-section-header {
        border-radius: 12px;
      }
    `,
        customJs: [
            'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
            'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
        ],
        customJsStr: `
      window.addEventListener('load', function () {
        if (document.getElementById('copilot-custom-nav')) {
          return;
        }

        var nav = document.createElement('div');
        nav.id = 'copilot-custom-nav';
        nav.innerHTML = '<div class="brand">Magang Hub API</div><div><a href="/">Home</a><a href="/health">Health</a><a class="active" href="/docs">Docs</a></div>';

        document.body.insertBefore(nav, document.body.firstChild);

        if (!document.getElementById('copilot-github-corner')) {
          var github = document.createElement('a');
          github.id = 'copilot-github-corner';
          github.href = 'https://github.com/nandasafiqalfiansyah/maganghub-api';
          github.target = '_blank';
          github.rel = 'noopener noreferrer';
          github.setAttribute('aria-label', 'GitHub Repository');
          github.setAttribute('title', 'GitHub Repository');
          github.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.1-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .1-.78.42-1.31.76-1.61-2.67-.31-5.48-1.34-5.48-5.97 0-1.32.47-2.4 1.23-3.25-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.3 1.24a11.4 11.4 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.66.24 2.89.12 3.19.77.85 1.23 1.93 1.23 3.25 0 4.65-2.81 5.65-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>';
          document.body.appendChild(github);
        }
      });
    `,
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map