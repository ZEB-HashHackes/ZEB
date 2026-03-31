export declare class ArtService {
    static storeFile(file: Express.Multer.File): Promise<{
        contentHash: string;
        similarityHash: string | null;
        similarityMethod: import("../models/Art.model.js").SimilarityMethod;
        fileType: import("../models/Art.model.js").FileType;
        mimeType: string;
        filePath: string;
    }>;
}
//# sourceMappingURL=art.service.d.ts.map