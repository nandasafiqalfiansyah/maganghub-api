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
exports.CreateTrackingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateTrackingDto {
    email;
    keyword;
    company;
}
exports.CreateTrackingDto = CreateTrackingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email user untuk menyimpan filter tracking',
    }),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'backend',
        description: 'Kata kunci posisi/company yang ingin di-track',
    }),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Tokopedia',
        description: 'Filter nama perusahaan yang ingin di-track',
    }),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "company", void 0);
//# sourceMappingURL=create-tracking.dto.js.map