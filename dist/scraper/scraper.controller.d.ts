import { ScraperService } from './scraper.service';
export declare class ScraperController {
    private readonly scraperService;
    constructor(scraperService: ScraperService);
    getInternships(keyword?: string, company?: string, limit?: string): Promise<import("./scraper.types").ScrapeInternshipsResult>;
    getCompanies(keyword?: string, limit?: string): Promise<import("./scraper.types").CompanyResult>;
}
