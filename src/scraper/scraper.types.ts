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
  companies: CompanyItem[];
}

export interface RefNegaraItem {
  id_negara: string;
  kode_negara: string | null;
  nama_negara: string | null;
}

export interface RefPropinsiItem {
  id_propinsi: string;
  id_negara: string | null;
  kode_propinsi: string | null;
  nama_propinsi: string | null;
}

export interface RefJumlahPegawaiItem {
  id_jumlah_pegawai: string;
  jumlah_pegawai: string | null;
  norut: number | null;
}

export interface CompanyItem {
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
  ref_jumlah_pegawai: RefJumlahPegawaiItem | null;
}

export interface ProvinceItem {
  id_propinsi: string;
  id_negara: string | null;
  kode_propinsi: string | null;
  nama_propinsi: string;
  ref_negara: RefNegaraItem | null;
}

export interface CityItem {
  id_kabupaten: string;
  id_propinsi: string | null;
  kode_kabupaten: string | null;
  nama_kabupaten: string;
  ref_propinsi: RefPropinsiItem | null;
}

export interface RegionResult<TItem> {
  sourceUrl: string;
  fetchedAt: string;
  total: number;
  items: TItem[];
}
