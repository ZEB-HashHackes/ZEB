import mongoose, {Schema, Document} from "mongoose";

export enum ArtStatus {
  ACTIVE = "active",
  FLAGGED = "flagged",
  REJECTED = "rejected"
}

export enum FileType {
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  TEXT = "text"
}

export enum SimilarityMethod {
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

const artSchema: Schema<IArt> = new Schema<IArt>({
  title: {type: String, required: true, maxLength: 128},
  description: {type: String, maxLength: 512},
  filePath: {type: String, required: true},
  fileType: {type: String, enum: Object.values(FileType), required: true},
  mimeType: {type: String, required: true},
  contentHash: {type: String, required: true, unique: true},
  similarityHash: {type: String},
  similarityMethod: {type: String, enum: Object.values(SimilarityMethod), default: SimilarityMethod.NONE},
  status: {type: String, enum: Object.values(ArtStatus), default: ArtStatus.ACTIVE},
  creatorBy: {type: String, required: true},
  ownedBy: {type: String, required: true},
  category: {type: String, 
            enum: ["image", "drawing", "2d", "3d", "music", "text"],
            required: true},
  minPrice: {type: Number, required: true},
}, {timestamps: true});

export default mongoose.model<IArt>("Art", artSchema);
