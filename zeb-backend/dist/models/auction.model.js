import mongoose, { Schema, Document } from "mongoose";
const auctionSchema = new Schema({
    art_hash: { type: String, required: true, unique: true },
    seller: { type: String, required: true },
    bidders: { type: [String], default: [] },
    highest_bidder: { type: String, default: "" },
    highest_bid: { type: Number, default: 0 },
    start_time: { type: Date, default: Date.now },
    end_time: { type: Date, required: true }
});
export default mongoose.model("Auction", auctionSchema);
//# sourceMappingURL=Auction.model.js.map