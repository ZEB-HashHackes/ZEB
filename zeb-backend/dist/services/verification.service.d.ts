import { FileType, SimilarityMethod } from "../models/Art.model.js";
export interface VerificationResult {
    fileType: FileType;
    contentHash: string;
    similarityHash: string | null;
    similarityMethod: SimilarityMethod;
}
export declare class VerificationService {
    static verify(buffer: Buffer, mimeType: string): Promise<VerificationResult>;
}
//# sourceMappingURL=verification.service.d.ts.map