import mongoose, { Document } from "mongoose";
export declare enum ArtStatus {
    ACTIVE = "active",
    PENDING = "pending",
    FLAGGED = "flagged",
    REJECTED = "rejected"
}
export declare enum FileType {
    IMAGE = "image",
    AUDIO = "audio",
    VIDEO = "video",
    TEXT = "text"
}
export declare enum SimilarityMethod {
    PHASH = "phash",
    FRAME_PHASH = "frame-phash",
    AUDIO_SIGNATURE = "audio-signature",
    TEXT_NORMALIZED_HASH = "text-normalized-hash",
    TEXT_SIMILARITY = "text-similarity",
    NONE = "none"
}
export interface IArt extends Document {
    title: string;
    description: string;
    filePath: string;
    fileType: FileType;
    saleType: string;
    mimeType: string;
    contentHash: string;
    similarityHash?: string | null;
    similarityMethod: SimilarityMethod;
    status: ArtStatus;
    isMinted: boolean;
    auctionStartTime: Date;
    auctionEndTime: Date;
    creatorBy: string;
    ownedBy: string;
    category: string;
    minPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IArt, {}, {}, {}, mongoose.Document<unknown, {}, IArt, {}, mongoose.DefaultSchemaOptions> & IArt & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IArt>;
export default _default;
//# sourceMappingURL=Art.model.d.ts.map