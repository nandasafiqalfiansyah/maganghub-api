import { Injectable } from '@nestjs/common';
import {
  CompanyResult,
  InternshipItem,
  InternshipQuery,
  ScrapeInternshipsResult,
} from './scraper.types';

@Injectable()
export class ScraperService {
  private readonly baseUrl =
    process.env.MAGANG_HUB_BASE_URL?.replace(/\/$/, '') ||
    'https://maganghub.com';

  async scrapeInternships(
    query: InternshipQuery,
  ): Promise<ScrapeInternshipsResult> {
    const fetchedAt = new Date().toISOString();
    const notes: string[] = [];

    const jsonFeed = await this.tryFetchJsonFeed();
    const htmlFeed = jsonFeed.length
      ? []
      : await this.scrapeFromHtmlCandidates(notes);

    const merged = this.uniqueByUrl([...jsonFeed, ...htmlFeed]);
    const filtered = this.filterInternships(merged, query);
    const limited = filtered.slice(0, this.normalizeLimit(query.limit));

    if (!jsonFeed.length && !htmlFeed.length) {
      notes.push(
        'Tidak ada data lowongan yang terdeteksi. Cek MAGANG_HUB_BASE_URL atau struktur halaman terbaru.',
      );
    }

    return {
      sourceUrl: this.baseUrl,
      fetchedAt,
      total: limited.length,
      items: limited,
      notes: notes.length ? notes : undefined,
    };
  }

  async scrapeCompanies(
    query: Pick<InternshipQuery, 'keyword' | 'limit'>,
  ): Promise<CompanyResult> {
    const internships = await this.scrapeInternships({
      keyword: query.keyword,
      limit: Math.max(this.normalizeLimit(query.limit), 50),
    });

    const companies = Array.from(
      new Set(
        internships.items.map((item) => item.company.trim()).filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return {
      sourceUrl: internships.sourceUrl,
      fetchedAt: internships.fetchedAt,
      total: companies.length,
      companies,
    };
  }

  private async tryFetchJsonFeed(): Promise<InternshipItem[]> {
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

      const payload: unknown = await response.json();
      const parsed = this.parseJsonPayload(payload);
      if (parsed.length) {
        return parsed;
      }
    }

    return [];
  }

  private parseJsonPayload(payload: unknown): InternshipItem[] {
    if (Array.isArray(payload)) {
      return payload
        .map((row) => this.toInternshipFromUnknown(row))
        .filter((item): item is InternshipItem => item !== null);
    }

    if (payload && typeof payload === 'object') {
      const candidates = ['data', 'items', 'results', 'jobs', 'internships'];
      for (const field of candidates) {
        const value = (payload as Record<string, unknown>)[field];
        if (Array.isArray(value)) {
          return value
            .map((row) => this.toInternshipFromUnknown(row))
            .filter((item): item is InternshipItem => item !== null);
        }
      }
    }

    return [];
  }

  private toInternshipFromUnknown(value: unknown): InternshipItem | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const row = value as Record<string, unknown>;
    const title = this.asString(row.title) || this.asString(row.position);
    const company =
      this.asString(row.company) ||
      this.asString(
        (row.hiringOrganization as Record<string, unknown>)?.name,
      ) ||
      this.asString(row.companyName);
    const url =
      this.asString(row.url) ||
      this.asString(row.link) ||
      this.asString(row.applyUrl) ||
      this.asString(row.slug);

    if (!title || !company || !url) {
      return null;
    }

    return {
      title: this.cleanText(title),
      company: this.cleanText(company),
      location: this.cleanText(
        this.asString(row.location) || this.asString(row.city) || '',
      ),
      type: this.cleanText(
        this.asString(row.type) || this.asString(row.employmentType) || '',
      ),
      url: this.toAbsoluteUrl(url),
      postedAt: this.asString(row.postedAt) || this.asString(row.datePosted),
    };
  }

  private async scrapeFromHtmlCandidates(
    notes: string[],
  ): Promise<InternshipItem[]> {
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

  private parseHtml(html: string): InternshipItem[] {
    const fromLdJson = this.parseLdJson(html);
    if (fromLdJson.length) {
      return fromLdJson;
    }

    const anchorRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const results: InternshipItem[] = [];

    for (const match of html.matchAll(anchorRegex)) {
      const rawHref = match[1] || '';
      const anchorBody = this.stripTags(match[2] || '');
      const text = this.cleanText(anchorBody);
      if (!text) {
        continue;
      }

      const looksLikeInternship = /(magang|intern|internship|trainee)/i.test(
        text + ' ' + rawHref,
      );
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

  private parseLdJson(html: string): InternshipItem[] {
    const scriptRegex =
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const results: InternshipItem[] = [];

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

        const row = entry as Record<string, unknown>;
        const type = this.asString(row['@type']);
        if (!type || !/JobPosting/i.test(type)) {
          continue;
        }

        const title = this.asString(row.title);
        const company = this.asString(
          (row.hiringOrganization as Record<string, unknown>)?.name,
        );
        const url = this.asString(row.url);

        if (!title || !company || !url) {
          continue;
        }

        results.push({
          title: this.cleanText(title),
          company: this.cleanText(company),
          location: this.cleanText(
            this.asString(
              (row.jobLocation as Record<string, unknown>)?.address,
            ) || '',
          ),
          type: this.cleanText(this.asString(row.employmentType) || ''),
          url: this.toAbsoluteUrl(url),
          postedAt: this.asString(row.datePosted),
        });
      }
    }

    return this.uniqueByUrl(results);
  }

  private filterInternships(
    items: InternshipItem[],
    query: InternshipQuery,
  ): InternshipItem[] {
    const keyword = (query.keyword || '').trim().toLowerCase();
    const company = (query.company || '').trim().toLowerCase();

    return items.filter((item) => {
      const title = item.title.toLowerCase();
      const itemCompany = item.company.toLowerCase();
      const keywordMatch =
        !keyword || title.includes(keyword) || itemCompany.includes(keyword);
      const companyMatch = !company || itemCompany.includes(company);
      return keywordMatch && companyMatch;
    });
  }

  private uniqueByUrl(items: InternshipItem[]): InternshipItem[] {
    const map = new Map<string, InternshipItem>();
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

  private normalizeLimit(limit?: number): number {
    if (!limit || Number.isNaN(Number(limit))) {
      return 20;
    }

    return Math.max(1, Math.min(Number(limit), 100));
  }

  private stripTags(input: string): string {
    return input.replace(/<[^>]+>/g, ' ');
  }

  private cleanText(input: string): string {
    return input.replace(/\s+/g, ' ').trim();
  }

  private tryParseJson(raw: string): unknown {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private asString(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private toAbsoluteUrl(value: string): string {
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

  private async safeFetch(url: string): Promise<Response> {
    try {
      return await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (compatible; MagangHubScraper/1.0; +https://maganghub.com)',
          accept: 'application/json, text/html;q=0.9,*/*;q=0.8',
        },
      });
    } catch {
      return new Response(null, { status: 503 });
    }
  }
}
