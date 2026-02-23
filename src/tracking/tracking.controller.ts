import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';

interface CreateTrackingBody {
  email: string;
  keyword?: string;
  company?: string;
}

@ApiTags('Tracking')
@Controller('api/tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @ApiOperation({ summary: 'Tambah tracking filter berdasarkan email' })
  @ApiBody({
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
  })
  @Post('email')
  createTracking(@Body() body: CreateTrackingBody) {
    return this.trackingService.addTrackingByEmail(
      body.email,
      body.keyword,
      body.company,
    );
  }

  @ApiOperation({ summary: 'Lihat daftar tracking milik email' })
  @ApiParam({ name: 'email', type: String, example: 'user@example.com' })
  @Get('email/:email')
  listTracking(@Param('email') email: string) {
    return this.trackingService.listTrackingByEmail(email);
  }

  @ApiOperation({ summary: 'Hapus tracking tertentu berdasarkan ID' })
  @ApiParam({ name: 'email', type: String, example: 'user@example.com' })
  @ApiParam({ name: 'trackingId', type: String, example: 'trk_ab12cd34' })
  @Delete('email/:email/:trackingId')
  deleteTracking(
    @Param('email') email: string,
    @Param('trackingId') trackingId: string,
  ) {
    return this.trackingService.removeTrackingByEmail(email, trackingId);
  }

  @ApiOperation({
    summary: 'Cek lowongan yang match berdasarkan tracking email',
  })
  @ApiParam({ name: 'email', type: String, example: 'user@example.com' })
  @Get('email/:email/matches')
  checkMatches(@Param('email') email: string) {
    return this.trackingService.checkMatchesByEmail(email);
  }
}
