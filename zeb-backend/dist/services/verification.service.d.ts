export interface VerificationResult {
    status: "accepted" | "flagged" | "rejected";
    message: string;
    data?: any;
}
export declare class VerificationService {
    private static readonly IMAGE_SIMILARITY_THRESHOLD;
    private static readonly TEXT_SIMILARITY_THRESHOLD;
    private static readonly VIDEO_SIMILARITY_THRESHOLD;
    /**
     * Main verification flow for uploaded content.
     */
    static verifyContent(file: Express.Multer.File, metadata: {
        title: string;
        description?: string;
        creatorBy: string;
        ownedBy: string;
        category: string;
        minPrice: number;
    }): Promise<VerificationResult>;
    private static getFileType;
}
//# sourceMappingURL=verification.service.d.ts.map