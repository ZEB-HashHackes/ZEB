import mongoose, { Schema, Document } from "mongoose";
export var ActivityType;
(function (ActivityType) {
    ActivityType["MINTED"] = "minted";
    ActivityType["LISTING"] = "listing";
    ActivityType["SALE"] = "sale";
    ActivityType["BID"] = "bid";
    ActivityType["CANCELLED"] = "cancelled";
})(ActivityType || (ActivityType = {}));
const ActivitySchema = new Schema({
    type: { type: String, enum: Object.values(ActivityType), required: true },
    artId: { type: Schema.Types.ObjectId, ref: "Art", required: true },
    from: { type: String },
    to: { type: String },
    amount: { type: Number },
    transactionHash: { type: String },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model("Activity", ActivitySchema);
//# sourceMappingURL=Activity.model.js.map