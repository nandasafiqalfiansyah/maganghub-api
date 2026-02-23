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
export declare class AppService {
    getHealth(): AppHealthResponse;
    private formatUptime;
}
