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
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tracking_service_1 = require("./tracking.service");
let TrackingController = class TrackingController {
    trackingService;
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    createTracking(body) {
        return this.trackingService.addTrackingByEmail(body.email, body.keyword, body.company);
    }
    listTracking(email) {
        return this.trackingService.listTrackingByEmail(email);
    }
    deleteTracking(email, trackingId) {
        return this.trackingService.removeTrackingByEmail(email, trackingId);
    }
    checkMatches(email) {
        return this.trackingService.checkMatchesByEmail(email);
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Tambah tracking filter berdasarkan email' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['email'],
            properties: {
                email: {
                    type: 'string',
                    example: 'user@example.com',
                    description: 'Email user untuk menyimpan filter tracking',
                },
                keyword: {
                    type: 'string',
                    example: 'backend',
                    description: 'Kata kunci posisi/company yang ingin di-track',
                },
                company: {
                    type: 'string',
                    example: 'Tokopedia',
                    description: 'Filter nama perusahaan yang ingin di-track',
                },
            },
        },
    }),
    (0, common_1.Post)('email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "createTracking", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Lihat daftar tracking milik email' }),
    (0, swagger_1.ApiParam)({ name: 'email', type: String, example: 'user@example.com' }),
    (0, common_1.Get)('email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "listTracking", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Hapus tracking tertentu berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'email', type: String, example: 'user@example.com' }),
    (0, swagger_1.ApiParam)({ name: 'trackingId', type: String, example: 'trk_ab12cd34' }),
    (0, common_1.Delete)('email/:email/:trackingId'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('trackingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "deleteTracking", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Cek lowongan yang match berdasarkan tracking email',
    }),
    (0, swagger_1.ApiParam)({ name: 'email', type: String, example: 'user@example.com' }),
    (0, common_1.Get)('email/:email/matches'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "checkMatches", null);
exports.TrackingController = TrackingController = __decorate([
    (0, swagger_1.ApiTags)('Tracking'),
    (0, common_1.Controller)('api/tracking'),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map