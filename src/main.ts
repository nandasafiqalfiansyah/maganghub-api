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
  SwaggerModule.setup('/', app, document, {
    jsonDocumentUrl: '/openapi.json',
    customCssUrl: ['https://unpkg.com/swagger-ui-dist@5/swagger-ui.css'],
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      url: '/openapi.json',
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
