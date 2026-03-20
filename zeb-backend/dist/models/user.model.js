import mongoose, { Schema, Document } from "mongoose";
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, minLength: 3, maxLength: 256 },
    passwordHash: { type: String, required: true },
    publickey: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map