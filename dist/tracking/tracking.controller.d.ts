import { TrackingService } from './tracking.service';
interface CreateTrackingBody {
    email: string;
    keyword?: string;
    company?: string;
}
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    createTracking(body: CreateTrackingBody): {
        email: string;
        tracking: import("./tracking.service").EmailTrackingItem;
        total: number;
    };
    listTracking(email: string): {
        email: string;
        total: number;
        trackings: import("./tracking.service").EmailTrackingItem[];
    };
    deleteTracking(email: string, trackingId: string): {
        email: string;
        removedId: string;
        remaining: number;
    };
    checkMatches(email: string): Promise<import("./tracking.service").TrackingMatchResult>;
}
export {};
