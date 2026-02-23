"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
let ScraperService = class ScraperService {
    baseUrl = process.env.MAGANG_HUB_BASE_URL?.replace(/\/$/, '') ||
        'https://maganghub.com';
    async scrapeInternships(query) {
        const fetchedAt = new Date().toISOString();
        const notes = [];
        const jsonFeed = await this.tryFetchJsonFeed();
        const htmlFeed = jsonFeed.length
            ? []
            : await this.scrapeFromHtmlCandidates(notes);
        const merged = this.uniqueByUrl([...jsonFeed, ...htmlFeed]);
        const filtered = this.filterInternships(merged, query);
        const limited = filtered.slice(0, this.normalizeLimit(query.limit));
        if (!jsonFeed.length && !htmlFeed.length) {
            notes.push('Tidak ada data lowongan yang terdeteksi. Cek MAGANG_HUB_BASE_URL atau struktur halaman terbaru.');
        }
        return {
            sourceUrl: this.baseUrl,
            fetchedAt,
            total: limited.length,
            items: limited,
            notes: notes.length ? notes : undefined,
        };
    }
    async scrapeCompanies(query) {
        const internships = await this.scrapeInternships({
            keyword: query.keyword,
            limit: Math.max(this.normalizeLimit(query.limit), 50),
        });
        const companies = Array.from(new Set(internships.items.map((item) => item.company.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        return {
            sourceUrl: internships.sourceUrl,
            fetchedAt: internships.fetchedAt,
            total: companies.length,
            companies,
        };
    }
    async tryFetchJsonFeed() {
        const jsonCandidates = [
            '/api/internships',
            '/api/jobs',
            '/api/v1/internships',
            '/internships.json',
            '/jobs.json',
        ];
        for (const path of jsonCandidates) {
            const response = await this.safeFetch(`${this.baseUrl}${path}`);
            if (!response.ok) {
                continue;
            }
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.toLowerCase().includes('application/json')) {
                continue;
            }
            const payload = await response.json();
            const parsed = this.parseJsonPayload(payload);
            if (parsed.length) {
                return parsed;
            }
        }
        return [];
    }
    parseJsonPayload(payload) {
        if (Array.isArray(payload)) {
            return payload
                .map((row) => this.toInternshipFromUnknown(row))
                .filter((item) => item !== null);
        }
        if (payload && typeof payload === 'object') {
            const candidates = ['data', 'items', 'results', 'jobs', 'internships'];
            for (const field of candidates) {
                const value = payload[field];
                if (Array.isArray(value)) {
                    return value
                        .map((row) => this.toInternshipFromUnknown(row))
                        .filter((item) => item !== null);
                }
            }
        }
        return [];
    }
    toInternshipFromUnknown(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }
        const row = value;
        const title = this.asString(row.title) || this.asString(row.position);
        const company = this.asString(row.company) ||
            this.asString(row.hiringOrganization?.name) ||
            this.asString(row.companyName);
        const url = this.asString(row.url) ||
            this.asString(row.link) ||
            this.asString(row.applyUrl) ||
            this.asString(row.slug);
        if (!title || !company || !url) {
            return null;
        }
        return {
            title: this.cleanText(title),
            company: this.cleanText(company),
            location: this.cleanText(this.asString(row.location) || this.asString(row.city) || ''),
            type: this.cleanText(this.asString(row.type) || this.asString(row.employmentType) || ''),
            url: this.toAbsoluteUrl(url),
            postedAt: this.asString(row.postedAt) || this.asString(row.datePosted),
        };
    }
    async scrapeFromHtmlCandidates(notes) {
        const htmlCandidates = [
            '/internship',
            '/lowongan-magang',
            '/jobs',
            '/magang',
            '/',
        ];
        for (const path of htmlCandidates) {
            const target = `${this.baseUrl}${path}`;
            const response = await this.safeFetch(target);
            if (!response.ok) {
                continue;
            }
            const html = await response.text();
            const parsed = this.parseHtml(html);
            if (parsed.length) {
                return parsed;
            }
            notes.push(`Tidak menemukan entri lowongan dari ${target}`);
        }
        return [];
    }
    parseHtml(html) {
        const fromLdJson = this.parseLdJson(html);
        if (fromLdJson.length) {
            return fromLdJson;
        }
        const anchorRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
        const results = [];
        for (const match of html.matchAll(anchorRegex)) {
            const rawHref = match[1] || '';
            const anchorBody = this.stripTags(match[2] || '');
            const text = this.cleanText(anchorBody);
            if (!text) {
                continue;
            }
            const looksLikeInternship = /(magang|intern|internship|trainee)/i.test(text + ' ' + rawHref);
            if (!looksLikeInternship) {
                continue;
            }
            const normalizedHref = this.toAbsoluteUrl(rawHref);
            const segments = text
                .split('|')
                .map((part) => this.cleanText(part))
                .filter(Boolean);
            const title = segments[0] || text;
            const company = segments[1] || 'Perusahaan belum terdeteksi';
            if (!normalizedHref || !title) {
                continue;
            }
            results.push({
                title,
                company,
                url: normalizedHref,
            });
        }
        return this.uniqueByUrl(results);
    }
    parseLdJson(html) {
        const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        const results = [];
        for (const match of html.matchAll(scriptRegex)) {
            const rawJson = match[1]?.trim();
            if (!rawJson) {
                continue;
            }
            const parsed = this.tryParseJson(rawJson);
            if (!parsed) {
                continue;
            }
            const entries = Array.isArray(parsed) ? parsed : [parsed];
            for (const entry of entries) {
                if (!entry || typeof entry !== 'object') {
                    continue;
                }
                const row = entry;
                const type = this.asString(row['@type']);
                if (!type || !/JobPosting/i.test(type)) {
                    continue;
                }
                const title = this.asString(row.title);
                const company = this.asString(row.hiringOrganization?.name);
                const url = this.asString(row.url);
                if (!title || !company || !url) {
                    continue;
                }
                results.push({
                    title: this.cleanText(title),
                    company: this.cleanText(company),
                    location: this.cleanText(this.asString(row.jobLocation?.address) || ''),
                    type: this.cleanText(this.asString(row.employmentType) || ''),
                    url: this.toAbsoluteUrl(url),
                    postedAt: this.asString(row.datePosted),
                });
            }
        }
        return this.uniqueByUrl(results);
    }
    filterInternships(items, query) {
        const keyword = (query.keyword || '').trim().toLowerCase();
        const company = (query.company || '').trim().toLowerCase();
        return items.filter((item) => {
            const title = item.title.toLowerCase();
            const itemCompany = item.company.toLowerCase();
            const keywordMatch = !keyword || title.includes(keyword) || itemCompany.includes(keyword);
            const companyMatch = !company || itemCompany.includes(company);
            return keywordMatch && companyMatch;
        });
    }
    uniqueByUrl(items) {
        const map = new Map();
        for (const item of items) {
            if (!item.url) {
                continue;
            }
            const key = item.url.trim();
            if (!key) {
                continue;
            }
            if (!map.has(key)) {
                map.set(key, item);
            }
        }
        return Array.from(map.values());
    }
    normalizeLimit(limit) {
        if (!limit || Number.isNaN(Number(limit))) {
            return 20;
        }
        return Math.max(1, Math.min(Number(limit), 100));
    }
    stripTags(input) {
        return input.replace(/<[^>]+>/g, ' ');
    }
    cleanText(input) {
        return input.replace(/\s+/g, ' ').trim();
    }
    tryParseJson(raw) {
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    asString(value) {
        return typeof value === 'string' ? value : '';
    }
    toAbsoluteUrl(value) {
        if (!value) {
            return '';
        }
        if (/^https?:\/\//i.test(value)) {
            return value;
        }
        if (value.startsWith('/')) {
            return `${this.baseUrl}${value}`;
        }
        return `${this.baseUrl}/${value}`;
    }
    async safeFetch(url) {
        try {
            return await fetch(url, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (compatible; MagangHubScraper/1.0; +https://maganghub.com)',
                    accept: 'application/json, text/html;q=0.9,*/*;q=0.8',
                },
            });
        }
        catch {
            return new Response(null, { status: 503 });
        }
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = __decorate([
    (0, common_1.Injectable)()
], ScraperService);
//# sourceMappingURL=scraper.service.js.map