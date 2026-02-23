import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperController } from './scraper/scraper.controller';
import { ScraperService } from './scraper/scraper.service';
import { TrackingController } from './tracking/tracking.controller';
import { TrackingService } from './tracking/tracking.service';
import { WebController } from './web.controller';

@Module({
  imports: [],
  controllers: [
    WebController,
    AppController,
    ScraperController,
    TrackingController,
  ],
  providers: [AppService, ScraperService, TrackingService],
})
export class AppModule {}
