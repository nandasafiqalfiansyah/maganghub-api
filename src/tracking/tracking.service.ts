import { BadRequestException, Injectable } from '@nestjs/common';
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
  matches: Array<InternshipItem & { matchedFilterId: string }>;
}

@Injectable()
export class TrackingService {
  private readonly store = new Map<string, EmailTrackingItem[]>();

  constructor(private readonly scraperService: ScraperService) {}

  addTrackingByEmail(emailRaw: string, keyword?: string, company?: string) {
    const email = this.normalizeEmail(emailRaw);
    if (!keyword && !company) {
      throw new BadRequestException(
        'keyword atau company wajib diisi minimal satu.',
      );
    }

    const tracking: EmailTrackingItem = {
      id: this.generateId(),
      keyword: keyword?.trim(),
      company: company?.trim(),
      createdAt: new Date().toISOString(),
    };

    const previous = this.store.get(email) || [];
    this.store.set(email, [...previous, tracking]);

    return {
      email,
      tracking,
      total: this.store.get(email)?.length || 0,
    };
  }

  listTrackingByEmail(emailRaw: string) {
    const email = this.normalizeEmail(emailRaw);
    return {
      email,
      total: this.store.get(email)?.length || 0,
      trackings: this.store.get(email) || [],
    };
  }

  removeTrackingByEmail(emailRaw: string, trackingId: string) {
    const email = this.normalizeEmail(emailRaw);
    const existing = this.store.get(email) || [];
    const filtered = existing.filter((item) => item.id !== trackingId);

    if (filtered.length === existing.length) {
      throw new BadRequestException(
        'trackingId tidak ditemukan untuk email tersebut.',
      );
    }

    if (!filtered.length) {
      this.store.delete(email);
    } else {
      this.store.set(email, filtered);
    }

    return {
      email,
      removedId: trackingId,
      remaining: filtered.length,
    };
  }

  async checkMatchesByEmail(emailRaw: string): Promise<TrackingMatchResult> {
    const email = this.normalizeEmail(emailRaw);
    const filters = this.store.get(email) || [];

    if (!filters.length) {
      throw new BadRequestException(
        'Belum ada tracking filter untuk email ini.',
      );
    }

    const allMatches: Array<InternshipItem & { matchedFilterId: string }> = [];

    for (const filter of filters) {
      const result = await this.scraperService.scrapeInternships({
        keyword: filter.keyword,
        company: filter.company,
        limit: 100,
      });

      for (const item of result.items) {
        allMatches.push({
          ...item,
          matchedFilterId: filter.id,
        });
      }
    }

    const deduped = this.uniqueMatches(allMatches);

    return {
      email,
      checkedAt: new Date().toISOString(),
      filters,
      totalMatches: deduped.length,
      matches: deduped,
    };
  }

  private uniqueMatches(
    items: Array<InternshipItem & { matchedFilterId: string }>,
  ): Array<InternshipItem & { matchedFilterId: string }> {
    const map = new Map<string, InternshipItem & { matchedFilterId: string }>();
    for (const item of items) {
      const key = `${item.url}::${item.matchedFilterId}`;
      if (!map.has(key)) {
        map.set(key, item);
      }
    }
    return Array.from(map.values());
  }

  private normalizeEmail(emailRaw: string): string {
    const email = (emailRaw || '').trim().toLowerCase();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      throw new BadRequestException('Format email tidak valid.');
    }

    return email;
  }

  private generateId(): string {
    return `trk_${Math.random().toString(36).slice(2, 10)}`;
  }
}
