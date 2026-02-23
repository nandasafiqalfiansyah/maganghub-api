import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Magang Hub Scraper API')
    .setDescription(
      'API untuk scraping lowongan magang, list perusahaan, dan tracking by email',
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
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
