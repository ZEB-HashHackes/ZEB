import mongoose, { Schema, Document } from "mongoose";
export var ArtStatus;
(function (ArtStatus) {
    ArtStatus["ACTIVE"] = "active";
    ArtStatus["PENDING"] = "pending";
    ArtStatus["FLAGGED"] = "flagged";
    ArtStatus["REJECTED"] = "rejected";
})(ArtStatus || (ArtStatus = {}));
export var FileType;
(function (FileType) {
    FileType["IMAGE"] = "image";
    FileType["AUDIO"] = "audio";
    FileType["VIDEO"] = "video";
    FileType["TEXT"] = "text";
})(FileType || (FileType = {}));
export var SimilarityMethod;
(function (SimilarityMethod) {
    SimilarityMethod["PHASH"] = "phash";
    SimilarityMethod["FRAME_PHASH"] = "frame-phash";
    SimilarityMethod["AUDIO_SIGNATURE"] = "audio-signature";
    SimilarityMethod["TEXT_NORMALIZED_HASH"] = "text-normalized-hash";
    SimilarityMethod["TEXT_SIMILARITY"] = "text-similarity";
    SimilarityMethod["NONE"] = "none";
})(SimilarityMethod || (SimilarityMethod = {}));
const artSchema = new Schema({
    title: { type: String, required: true, maxLength: 128 },
    description: { type: String, maxLength: 512 },
    filePath: { type: String, required: true },
    saleType: { type: String, enum: ["sell", "auction"] },
    fileType: { type: String, enum: Object.values(FileType), default: FileType.IMAGE },
    mimeType: { type: String, default: 'application/octet-stream' },
    auctionStartTime: { type: Date, default: Date.now },
    auctionEndTime: { type: Date },
    contentHash: { type: String, required: true, unique: true },
    similarityHash: { type: String },
    similarityMethod: { type: String, enum: Object.values(SimilarityMethod), default: SimilarityMethod.NONE },
    status: { type: String, enum: Object.values(ArtStatus), default: ArtStatus.PENDING },
    isMinted: { type: Boolean, default: false },
    creatorBy: { type: String, required: true },
    ownedBy: { type: String, required: true },
    category: { type: String,
        enum: ["digital art", "book", "literary work", "music", "video", "image", "drawing", "2d", "3d", "text"],
        required: true },
    minPrice: { type: Number, required: true },
}, { timestamps: true });
export default mongoose.model("Art", artSchema);
//# sourceMappingURL=Art.model.js.map