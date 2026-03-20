import mongoose, { Document } from "mongoose";
export declare enum ArtStatus {
    ACTIVE = "active",
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
    mimeType: string;
    contentHash: string;
    similarityHash?: string;
    similarityMethod: SimilarityMethod;
    status: ArtStatus;
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
//# sourceMappingURL=art.model.d.ts.map