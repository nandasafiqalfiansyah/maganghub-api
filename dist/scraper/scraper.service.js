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
    kemnakerApiBaseUrl = 'https://maganghub.kemnaker.go.id/be/v1/api/list';
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
            .filter((item) => item !== null);
        return {
            sourceUrl,
            fetchedAt: new Date().toISOString(),
            total: companies.length,
            companies,
        };
    }
    async scrapeProvinces(query) {
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
            .filter((item) => item !== null);
        return {
            sourceUrl,
            fetchedAt: new Date().toISOString(),
            total: provinces.length,
            items: provinces,
        };
    }
    async scrapeCities(query) {
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
            .filter((item) => item !== null);
        return {
            sourceUrl,
            fetchedAt: new Date().toISOString(),
            total: cities.length,
            items: cities,
        };
    }
    async fetchKemnakerList(url) {
        const response = await this.safeFetch(url);
        if (!response.ok) {
            return [];
        }
        const payload = await response.json();
        return this.extractListFromPayload(payload);
    }
    extractListFromPayload(payload) {
        if (Array.isArray(payload)) {
            return payload;
        }
        if (!payload || typeof payload !== 'object') {
            return [];
        }
        const root = payload;
        const directCandidates = ['data', 'items', 'results', 'rows'];
        for (const key of directCandidates) {
            const value = root[key];
            if (Array.isArray(value)) {
                return value;
            }
        }
        if (root.data && typeof root.data === 'object') {
            const dataObj = root.data;
            for (const key of directCandidates) {
                const value = dataObj[key];
                if (Array.isArray(value)) {
                    return value;
                }
            }
        }
        return [];
    }
    toProvinceItem(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }
        const row = value;
        const id_propinsi = this.asString(row.id_propinsi) ||
            this.asString(row.province_id) ||
            this.asString(row.id);
        const nama_propinsi = this.asString(row.nama_propinsi) ||
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
    toCityItem(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }
        const row = value;
        const id_kabupaten = this.asString(row.id_kabupaten) ||
            this.asString(row.city_id) ||
            this.asString(row.id);
        const nama_kabupaten = this.asString(row.nama_kabupaten) ||
            this.asString(row.city) ||
            this.asString(row.name);
        if (!id_kabupaten || !nama_kabupaten) {
            return null;
        }
        const refPropinsiRaw = this.asRecord(row.ref_propinsi);
        return {
            id_kabupaten,
            id_propinsi: this.asNullableString(row.id_propinsi) ||
                this.asNullableString(row.province_id),
            kode_kabupaten: this.asNullableString(row.kode_kabupaten),
            nama_kabupaten: this.cleanText(nama_kabupaten),
            ref_propinsi: refPropinsiRaw
                ? {
                    id_propinsi: this.asString(refPropinsiRaw.id_propinsi),
                    id_negara: this.asNullableString(refPropinsiRaw.id_negara) ||
                        this.asNullableString(refPropinsiRaw.country_id),
                    kode_propinsi: this.asNullableString(refPropinsiRaw.kode_propinsi),
                    nama_propinsi: this.asNullableString(refPropinsiRaw.nama_propinsi),
                }
                : null,
        };
    }
    toCompanyItem(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }
        const row = value;
        const id_perusahaan = this.asString(row.id_perusahaan) ||
            this.asString(row.company_id) ||
            this.asString(row.id);
        const nama_perusahaan = this.asString(row.nama_perusahaan) ||
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
                    id_jumlah_pegawai: this.asString(refJumlahPegawaiRaw.id_jumlah_pegawai),
                    jumlah_pegawai: this.asNullableString(refJumlahPegawaiRaw.jumlah_pegawai),
                    norut: this.asNullableNumber(refJumlahPegawaiRaw.norut),
                }
                : null,
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
    asNullableString(value) {
        if (typeof value === 'string') {
            const cleaned = this.cleanText(value);
            return cleaned || null;
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
        return null;
    }
    asNullableNumber(value) {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : null;
        }
        if (typeof value === 'string' && value.trim()) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        }
        return null;
    }
    asRecord(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
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