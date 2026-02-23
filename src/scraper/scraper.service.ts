import { Injectable } from '@nestjs/common';
import type {
  InternshipItem,
  InternshipQuery,
  ScrapeInternshipsResult,
} from './scraper.types';

export interface ProvinceApiItem {
  id_propinsi: string;
  id_negara: string | null;
  kode_propinsi: string | null;
  nama_propinsi: string;
  ref_negara: {
    id_negara: string;
    kode_negara: string | null;
    nama_negara: string | null;
  } | null;
}

export interface CityApiItem {
  id_kabupaten: string;
  id_propinsi: string | null;
  kode_kabupaten: string | null;
  nama_kabupaten: string;
  ref_propinsi: {
    id_propinsi: string;
    id_negara: string | null;
    kode_propinsi: string | null;
    nama_propinsi: string | null;
  } | null;
}

export interface CompanyApiItem {
  id_perusahaan: string;
  id_desa: string | null;
  nama_perusahaan: string;
  deskripsi_perusahaan: string | null;
  alamat: string | null;
  logo: string | null;
  banner: string | null;
  created_at: string | null;
  updated_at: string | null;
  email: string | null;
  telepon: string | null;
  kode_sektor_usaha: string | null;
  nama_sektor_usaha: string | null;
  kode_kabupaten: string | null;
  nama_kabupaten: string | null;
  kode_provinsi: string | null;
  nama_provinsi: string | null;
  kode_pos: string | null;
  skala_usaha: string | null;
  id_jumlah_pegawai: string | null;
  kode_wlkp: string | null;
  nib: string | null;
  npwp: string | null;
  ref_jumlah_pegawai: {
    id_jumlah_pegawai: string;
    jumlah_pegawai: string | null;
    norut: number | null;
  } | null;
}

export interface CompanyApiResult {
  sourceUrl: string;
  fetchedAt: string;
  total: number;
  companies: CompanyApiItem[];
}

export interface RegionApiResult<TItem> {
  sourceUrl: string;
  fetchedAt: string;
  total: number;
  items: TItem[];
}

@Injectable()
export class ScraperService {
  private readonly baseUrl =
    process.env.MAGANG_HUB_BASE_URL?.replace(/\/$/, '') ||
    'https://maganghub.com';
  private readonly kemnakerApiBaseUrl =
    'https://maganghub.kemnaker.go.id/be/v1/api/list';

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

  async scrapeCompanies(query: {
    page?: string;
    limit?: string;
    per_page?: string;
    order_direction?: string;
  }): Promise<CompanyApiResult> {
    const params = new URLSearchParams({
      order_direction: query.order_direction || 'ASC',
      page: query.page || '1',
      limit: query.limit || '21',
      per_page: query.per_page || '21',
    });
    const sourceUrl = `${this.kemnakerApiBaseUrl}/companies?${params.toString()}`;
    const rows = await this.fetchKemnakerList(sourceUrl);
    const companies = rows
      .map((item) => this.toCompanyItem(item))
      .filter((item): item is CompanyApiItem => item !== null);

    return {
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      total: companies.length,
      companies,
    };
  }

  async scrapeProvinces(query: {
    page?: string;
    limit?: string;
    per_page?: string;
    order_by?: string;
    order_direction?: string;
  }): Promise<RegionApiResult<ProvinceApiItem>> {
    const params = new URLSearchParams({
      order_by: query.order_by || 'nama_propinsi',
      order_direction: query.order_direction || 'ASC',
      page: query.page || '1',
      limit: query.limit || 'all',
      per_page: query.per_page || 'all',
    });
    const sourceUrl = `${this.kemnakerApiBaseUrl}/provinces?${params.toString()}`;
    const rows = await this.fetchKemnakerList(sourceUrl);
    const provinces = rows
      .map((item) => this.toProvinceItem(item))
      .filter((item): item is ProvinceApiItem => item !== null);

    return {
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      total: provinces.length,
      items: provinces,
    };
  }

  async scrapeCities(query: {
    page?: string;
    limit?: string;
    per_page?: string;
    order_by?: string;
    order_direction?: string;
  }): Promise<RegionApiResult<CityApiItem>> {
    const params = new URLSearchParams({
      order_by: query.order_by || 'nama_kabupaten',
      order_direction: query.order_direction || 'ASC',
      page: query.page || '1',
      limit: query.limit || 'all',
      per_page: query.per_page || 'all',
    });
    const sourceUrl = `${this.kemnakerApiBaseUrl}/cities?${params.toString()}`;
    const rows = await this.fetchKemnakerList(sourceUrl);
    const cities = rows
      .map((item) => this.toCityItem(item))
      .filter((item): item is CityApiItem => item !== null);

    return {
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      total: cities.length,
      items: cities,
    };
  }

  private async fetchKemnakerList(url: string): Promise<unknown[]> {
    const response = await this.safeFetch(url);
    if (!response.ok) {
      return [];
    }

    const payload: unknown = await response.json();
    return this.extractListFromPayload(payload);
  }

  private extractListFromPayload(payload: unknown): unknown[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const root = payload as Record<string, unknown>;
    const directCandidates = ['data', 'items', 'results', 'rows'];

    for (const key of directCandidates) {
      const value = root[key];
      if (Array.isArray(value)) {
        return value;
      }
    }

    if (root.data && typeof root.data === 'object') {
      const dataObj = root.data as Record<string, unknown>;
      for (const key of directCandidates) {
        const value = dataObj[key];
        if (Array.isArray(value)) {
          return value;
        }
      }
    }

    return [];
  }

  private toProvinceItem(value: unknown): ProvinceApiItem | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const row = value as Record<string, unknown>;
    const id_propinsi =
      this.asString(row.id_propinsi) ||
      this.asString(row.province_id) ||
      this.asString(row.id);
    const nama_propinsi =
      this.asString(row.nama_propinsi) ||
      this.asString(row.province) ||
      this.asString(row.name);

    if (!id_propinsi || !nama_propinsi) {
      return null;
    }

    const refNegaraRaw = this.asRecord(row.ref_negara);

    return {
      id_propinsi,
      id_negara: this.asNullableString(row.id_negara),
      kode_propinsi: this.asNullableString(row.kode_propinsi),
      nama_propinsi: this.cleanText(nama_propinsi),
      ref_negara: refNegaraRaw
        ? {
            id_negara: this.asString(refNegaraRaw.id_negara),
            kode_negara: this.asNullableString(refNegaraRaw.kode_negara),
            nama_negara: this.asNullableString(refNegaraRaw.nama_negara),
          }
        : null,
    };
  }

  private toCityItem(value: unknown): CityApiItem | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const row = value as Record<string, unknown>;
    const id_kabupaten =
      this.asString(row.id_kabupaten) ||
      this.asString(row.city_id) ||
      this.asString(row.id);
    const nama_kabupaten =
      this.asString(row.nama_kabupaten) ||
      this.asString(row.city) ||
      this.asString(row.name);

    if (!id_kabupaten || !nama_kabupaten) {
      return null;
    }

    const refPropinsiRaw = this.asRecord(row.ref_propinsi);

    return {
      id_kabupaten,
      id_propinsi:
        this.asNullableString(row.id_propinsi) ||
        this.asNullableString(row.province_id),
      kode_kabupaten: this.asNullableString(row.kode_kabupaten),
      nama_kabupaten: this.cleanText(nama_kabupaten),
      ref_propinsi: refPropinsiRaw
        ? {
            id_propinsi: this.asString(refPropinsiRaw.id_propinsi),
            id_negara:
              this.asNullableString(refPropinsiRaw.id_negara) ||
              this.asNullableString(refPropinsiRaw.country_id),
            kode_propinsi: this.asNullableString(refPropinsiRaw.kode_propinsi),
            nama_propinsi: this.asNullableString(refPropinsiRaw.nama_propinsi),
          }
        : null,
    };
  }

  private toCompanyItem(value: unknown): CompanyApiItem | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const row = value as Record<string, unknown>;
    const id_perusahaan =
      this.asString(row.id_perusahaan) ||
      this.asString(row.company_id) ||
      this.asString(row.id);
    const nama_perusahaan =
      this.asString(row.nama_perusahaan) ||
      this.asString(row.company) ||
      this.asString(row.name);

    if (!id_perusahaan || !nama_perusahaan) {
      return null;
    }

    const refJumlahPegawaiRaw = this.asRecord(row.ref_jumlah_pegawai);

    return {
      id_perusahaan,
      id_desa: this.asNullableString(row.id_desa),
      nama_perusahaan: this.cleanText(nama_perusahaan),
      deskripsi_perusahaan: this.asNullableString(row.deskripsi_perusahaan),
      alamat: this.asNullableString(row.alamat),
      logo: this.asNullableString(row.logo),
      banner: this.asNullableString(row.banner),
      created_at: this.asNullableString(row.created_at),
      updated_at: this.asNullableString(row.updated_at),
      email: this.asNullableString(row.email),
      telepon: this.asNullableString(row.telepon),
      kode_sektor_usaha: this.asNullableString(row.kode_sektor_usaha),
      nama_sektor_usaha: this.asNullableString(row.nama_sektor_usaha),
      kode_kabupaten: this.asNullableString(row.kode_kabupaten),
      nama_kabupaten: this.asNullableString(row.nama_kabupaten),
      kode_provinsi: this.asNullableString(row.kode_provinsi),
      nama_provinsi: this.asNullableString(row.nama_provinsi),
      kode_pos: this.asNullableString(row.kode_pos),
      skala_usaha: this.asNullableString(row.skala_usaha),
      id_jumlah_pegawai: this.asNullableString(row.id_jumlah_pegawai),
      kode_wlkp: this.asNullableString(row.kode_wlkp),
      nib: this.asNullableString(row.nib),
      npwp: this.asNullableString(row.npwp),
      ref_jumlah_pegawai: refJumlahPegawaiRaw
        ? {
            id_jumlah_pegawai: this.asString(
              refJumlahPegawaiRaw.id_jumlah_pegawai,
            ),
            jumlah_pegawai: this.asNullableString(
              refJumlahPegawaiRaw.jumlah_pegawai,
            ),
            norut: this.asNullableNumber(refJumlahPegawaiRaw.norut),
          }
        : null,
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

  private asNullableString(value: unknown): string | null {
    if (typeof value === 'string') {
      const cleaned = this.cleanText(value);
      return cleaned || null;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return null;
  }

  private asNullableNumber(value: unknown): number | null {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
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
