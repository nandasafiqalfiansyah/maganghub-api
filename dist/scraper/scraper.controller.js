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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scraper_service_1 = require("./scraper.service");
let ScraperController = class ScraperController {
    scraperService;
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    async getInternships(keyword, company, limit) {
        return this.scraperService.scrapeInternships({
            keyword,
            company,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async getCompanies(order_direction, page, limit, per_page) {
        return this.scraperService.scrapeCompanies({
            order_direction,
            page,
            limit,
            per_page,
        });
    }
    async getProvinces(order_by, order_direction, page, limit, per_page) {
        return this.scraperService.scrapeProvinces({
            order_by,
            order_direction,
            page,
            limit,
            per_page,
        });
    }
    async getCities(order_by, order_direction, page, limit, per_page) {
        return this.scraperService.scrapeCities({
            order_by,
            order_direction,
            page,
            limit,
            per_page,
        });
    }
};
exports.ScraperController = ScraperController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Scrape daftar lowongan magang' }),
    (0, swagger_1.ApiQuery)({ name: 'keyword', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'company', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, common_1.Get)('internships'),
    __param(0, (0, common_1.Query)('keyword')),
    __param(1, (0, common_1.Query)('company')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getInternships", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Ambil list perusahaan dari API Kemnaker',
    }),
    (0, swagger_1.ApiQuery)({ name: 'order_direction', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: String, example: '1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: String, example: '21' }),
    (0, swagger_1.ApiQuery)({ name: 'per_page', required: false, type: String, example: '21' }),
    (0, common_1.Get)('companies'),
    __param(0, (0, common_1.Query)('order_direction')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('per_page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getCompanies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Ambil list provinsi dari API Kemnaker' }),
    (0, swagger_1.ApiQuery)({
        name: 'order_by',
        required: false,
        type: String,
        example: 'nama_propinsi',
    }),
    (0, swagger_1.ApiQuery)({ name: 'order_direction', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: String, example: '1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: String, example: 'all' }),
    (0, swagger_1.ApiQuery)({ name: 'per_page', required: false, type: String, example: 'all' }),
    (0, common_1.Get)('provinces'),
    __param(0, (0, common_1.Query)('order_by')),
    __param(1, (0, common_1.Query)('order_direction')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('per_page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getProvinces", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Ambil list kota/kabupaten dari API Kemnaker' }),
    (0, swagger_1.ApiQuery)({
        name: 'order_by',
        required: false,
        type: String,
        example: 'nama_kabupaten',
    }),
    (0, swagger_1.ApiQuery)({ name: 'order_direction', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: String, example: '1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: String, example: 'all' }),
    (0, swagger_1.ApiQuery)({ name: 'per_page', required: false, type: String, example: 'all' }),
    (0, common_1.Get)('cities'),
    __param(0, (0, common_1.Query)('order_by')),
    __param(1, (0, common_1.Query)('order_direction')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('per_page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getCities", null);
exports.ScraperController = ScraperController = __decorate([
    (0, swagger_1.ApiTags)('Scrape'),
    (0, common_1.Controller)('api/scrape'),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService])
], ScraperController);
//# sourceMappingURL=scraper.controller.js.map