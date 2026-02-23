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
        jsonDocumentUrl: '/docs/openapi.json',
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
        nav.innerHTML = '<div class="brand">Magang Hub API</div><div><a href="/">Home</a><a href="/health">Health</a><a class="active" href="/docs">Docs</a><a href="/docs/openapi.json">OpenAPI</a></div>';

        document.body.insertBefore(nav, document.body.firstChild);
      });
    `,
        swaggerOptions: {
            url: '/docs/openapi.json',
            persistAuthorization: true,
        },
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map