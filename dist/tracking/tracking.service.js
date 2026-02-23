"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const scraper_service_1 = require("../scraper/scraper.service");
let TrackingService = class TrackingService {
    scraperService;
    store = new Map();
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    addTrackingByEmail(emailRaw, keyword, company) {
        const email = this.normalizeEmail(emailRaw);
        if (!keyword && !company) {
            throw new common_1.BadRequestException('keyword atau company wajib diisi minimal satu.');
        }
        const tracking = {
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
    listTrackingByEmail(emailRaw) {
        const email = this.normalizeEmail(emailRaw);
        return {
            email,
            total: this.store.get(email)?.length || 0,
            trackings: this.store.get(email) || [],
        };
    }
    removeTrackingByEmail(emailRaw, trackingId) {
        const email = this.normalizeEmail(emailRaw);
        const existing = this.store.get(email) || [];
        const filtered = existing.filter((item) => item.id !== trackingId);
        if (filtered.length === existing.length) {
            throw new common_1.BadRequestException('trackingId tidak ditemukan untuk email tersebut.');
        }
        if (!filtered.length) {
            this.store.delete(email);
        }
        else {
            this.store.set(email, filtered);
        }
        return {
            email,
            removedId: trackingId,
            remaining: filtered.length,
        };
    }
    async checkMatchesByEmail(emailRaw) {
        const email = this.normalizeEmail(emailRaw);
        const filters = this.store.get(email) || [];
        if (!filters.length) {
            throw new common_1.BadRequestException('Belum ada tracking filter untuk email ini.');
        }
        const allMatches = [];
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
    uniqueMatches(items) {
        const map = new Map();
        for (const item of items) {
            const key = `${item.url}::${item.matchedFilterId}`;
            if (!map.has(key)) {
                map.set(key, item);
            }
        }
        return Array.from(map.values());
    }
    normalizeEmail(emailRaw) {
        const email = (emailRaw || '').trim().toLowerCase();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid) {
            throw new common_1.BadRequestException('Format email tidak valid.');
        }
        return email;
    }
    generateId() {
        return `trk_${Math.random().toString(36).slice(2, 10)}`;
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map