import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';

@ApiTags('Scrape')
@Controller('api/scrape')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiOperation({ summary: 'Scrape daftar lowongan magang' })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'company', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @Get('internships')
  async getInternships(
    @Query('keyword') keyword?: string,
    @Query('company') company?: string,
    @Query('limit') limit?: string,
  ) {
    return this.scraperService.scrapeInternships({
      keyword,
      company,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @ApiOperation({
    summary: 'Ambil list nama perusahaan dari lowongan yang terdeteksi',
  })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @Get('companies')
  async getCompanies(
    @Query('keyword') keyword?: string,
    @Query('limit') limit?: string,
  ) {
    return this.scraperService.scrapeCompanies({
      keyword,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
