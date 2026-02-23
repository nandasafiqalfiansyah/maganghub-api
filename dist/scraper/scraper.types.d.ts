export interface InternshipItem {
    title: string;
    company: string;
    location?: string;
    type?: string;
    url: string;
    postedAt?: string;
}
export interface InternshipQuery {
    keyword?: string;
    company?: string;
    limit?: number;
}
export interface ScrapeInternshipsResult {
    sourceUrl: string;
    fetchedAt: string;
    total: number;
    items: InternshipItem[];
    notes?: string[];
}
export interface CompanyResult {
    sourceUrl: string;
    fetchedAt: string;
    total: number;
    companies: string[];
}
