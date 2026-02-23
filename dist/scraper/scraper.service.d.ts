import type { InternshipQuery, ScrapeInternshipsResult } from './scraper.types';
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
export declare class ScraperService {
    private readonly baseUrl;
    private readonly kemnakerApiBaseUrl;
    scrapeInternships(query: InternshipQuery): Promise<ScrapeInternshipsResult>;
    scrapeCompanies(query: {
        page?: string;
        limit?: string;
        per_page?: string;
        order_direction?: string;
    }): Promise<CompanyApiResult>;
    scrapeProvinces(query: {
        page?: string;
        limit?: string;
        per_page?: string;
        order_by?: string;
        order_direction?: string;
    }): Promise<RegionApiResult<ProvinceApiItem>>;
    scrapeCities(query: {
        page?: string;
        limit?: string;
        per_page?: string;
        order_by?: string;
        order_direction?: string;
    }): Promise<RegionApiResult<CityApiItem>>;
    private fetchKemnakerList;
    private extractListFromPayload;
    private toProvinceItem;
    private toCityItem;
    private toCompanyItem;
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
    private asNullableString;
    private asNullableNumber;
    private asRecord;
    private toAbsoluteUrl;
    private safeFetch;
}
