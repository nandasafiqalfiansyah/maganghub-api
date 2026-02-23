import { ScraperService } from '../scraper/scraper.service';
import { InternshipItem } from '../scraper/scraper.types';
export interface EmailTrackingItem {
    id: string;
    keyword?: string;
    company?: string;
    createdAt: string;
}
export interface TrackingMatchResult {
    email: string;
    checkedAt: string;
    filters: EmailTrackingItem[];
    totalMatches: number;
    matches: Array<InternshipItem & {
        matchedFilterId: string;
    }>;
}
export declare class TrackingService {
    private readonly scraperService;
    private readonly store;
    constructor(scraperService: ScraperService);
    addTrackingByEmail(emailRaw: string, keyword?: string, company?: string): {
        email: string;
        tracking: EmailTrackingItem;
        total: number;
    };
    listTrackingByEmail(emailRaw: string): {
        email: string;
        total: number;
        trackings: EmailTrackingItem[];
    };
    removeTrackingByEmail(emailRaw: string, trackingId: string): {
        email: string;
        removedId: string;
        remaining: number;
    };
    checkMatchesByEmail(emailRaw: string): Promise<TrackingMatchResult>;
    private uniqueMatches;
    private normalizeEmail;
    private generateId;
}
