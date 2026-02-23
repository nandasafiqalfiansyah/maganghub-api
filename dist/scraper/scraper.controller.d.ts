import { ScraperService } from './scraper.service';
export declare class ScraperController {
    private readonly scraperService;
    constructor(scraperService: ScraperService);
    getInternships(keyword?: string, company?: string, limit?: string): Promise<import("./scraper.types").ScrapeInternshipsResult>;
    getCompanies(order_direction?: string, page?: string, limit?: string, per_page?: string): Promise<import("./scraper.service").CompanyApiResult>;
    getProvinces(order_by?: string, order_direction?: string, page?: string, limit?: string, per_page?: string): Promise<import("./scraper.service").RegionApiResult<import("./scraper.service").ProvinceApiItem>>;
    getCities(order_by?: string, order_direction?: string, page?: string, limit?: string, per_page?: string): Promise<import("./scraper.service").RegionApiResult<import("./scraper.service").CityApiItem>>;
}
