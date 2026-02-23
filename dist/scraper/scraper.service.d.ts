import { CompanyResult, InternshipQuery, ScrapeInternshipsResult } from './scraper.types';
export declare class ScraperService {
    private readonly baseUrl;
    scrapeInternships(query: InternshipQuery): Promise<ScrapeInternshipsResult>;
    scrapeCompanies(query: Pick<InternshipQuery, 'keyword' | 'limit'>): Promise<CompanyResult>;
    private tryFetchJsonFeed;
    private parseJsonPayload;
    private toInternshipFromUnknown;
    private scrapeFromHtmlCandidates;
    private parseHtml;
    private parseLdJson;
    private filterInternships;
    private uniqueByUrl;
    private normalizeLimit;
    private stripTags;
    private cleanText;
    private tryParseJson;
    private asString;
    private toAbsoluteUrl;
    private safeFetch;
}
