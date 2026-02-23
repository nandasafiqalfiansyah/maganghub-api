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
    summary: 'Ambil list perusahaan dari API Kemnaker',
  })
  @ApiQuery({ name: 'order_direction', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '21' })
  @ApiQuery({ name: 'per_page', required: false, type: String, example: '21' })
  @Get('companies')
  async getCompanies(
    @Query('order_direction') order_direction?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('per_page') per_page?: string,
  ) {
    return this.scraperService.scrapeCompanies({
      order_direction,
      page,
      limit,
      per_page,
    });
  }

  @ApiOperation({ summary: 'Ambil list provinsi dari API Kemnaker' })
  @ApiQuery({
    name: 'order_by',
    required: false,
    type: String,
    example: 'nama_propinsi',
  })
  @ApiQuery({ name: 'order_direction', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: 'all' })
  @ApiQuery({ name: 'per_page', required: false, type: String, example: 'all' })
  @Get('provinces')
  async getProvinces(
    @Query('order_by') order_by?: string,
    @Query('order_direction') order_direction?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('per_page') per_page?: string,
  ) {
    return this.scraperService.scrapeProvinces({
      order_by,
      order_direction,
      page,
      limit,
      per_page,
    });
  }

  @ApiOperation({ summary: 'Ambil list kota/kabupaten dari API Kemnaker' })
  @ApiQuery({
    name: 'order_by',
    required: false,
    type: String,
    example: 'nama_kabupaten',
  })
  @ApiQuery({ name: 'order_direction', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: 'all' })
  @ApiQuery({ name: 'per_page', required: false, type: String, example: 'all' })
  @Get('cities')
  async getCities(
    @Query('order_by') order_by?: string,
    @Query('order_direction') order_direction?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('per_page') per_page?: string,
  ) {
    return this.scraperService.scrapeCities({
      order_by,
      order_direction,
      page,
      limit,
      per_page,
    });
  }
}
