import mongoose, {Schema, Document} from "mongoose";

export interface IArt extends Document {
  title: String,
  description: String,
  filePath: String,
  hash: String,
  creatorBy: String,
  ownedBy: String,
  category: String,
  minPrice: Number,
  createdAt: Date,
}

const artSchema: Schema<IArt> = new Schema<IArt>({
  title: {type: String, required: true, maxLength: 128},
  description: {type: String, maxLength: 512},
  filePath: {type: String, required: true},
  hash: {type: String, required: true, unique: true},
  creatorBy: {type: String, required: true},
  ownedBy: {type: String, required: true},
  category: {type:String, 
            enum: ["image", "drawing", "2d", "3d", "music"],
            required: true},
  minPrice: {type: Number, required: true},
  createdAt: {type: Date, default: Date.now}
});

export default mongoose.model<IArt>("Art", artSchema);

