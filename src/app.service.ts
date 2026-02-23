import { Injectable } from '@nestjs/common';

export interface AppHealthResponse {
  status: 'ok';
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  uptimeHuman: string;
  nodeVersion: string;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  links: {
    home: string;
    swagger: string;
    openApiJson: string;
  };
}

@Injectable()
export class AppService {
  getHealth(): AppHealthResponse {
    const uptimeSeconds = Math.floor(process.uptime());
    const memoryUsage = process.memoryUsage();

    return {
      status: 'ok',
      service: 'magang-hub-scraper',
      version: process.env.npm_package_version || '0.0.1',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      uptimeHuman: this.formatUptime(uptimeSeconds),
      nodeVersion: process.version,
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      links: {
        home: '/',
        swagger: '/docs',
        openApiJson: '/docs/openapi.json',
      },
    };
  }

  private formatUptime(totalSeconds: number): string {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
