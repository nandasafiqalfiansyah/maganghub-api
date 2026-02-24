import { Module } from '@nestjs/common';
import { ScraperController } from './scraper/scraper.controller';
import { ScraperService } from './scraper/scraper.service';
import { TrackingController } from './tracking/tracking.controller';
import { TrackingService } from './tracking/tracking.service';
import { WebController } from './web.controller';

@Module({
  imports: [],
  controllers: [
    WebController,
    ScraperController,
    TrackingController,
  ],
  providers: [ScraperService, TrackingService],
})
export class AppModule {}
