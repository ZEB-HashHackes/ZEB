import mongoose, { Document } from "mongoose";
export interface IAuction extends Document {
    art_hash: string;
    seller: string;
    bidders: string[];
    highest_bidder: string;
    highest_bid: number;
    start_time: Date;
    end_time: Date;
}
declare const _default: mongoose.Model<IAuction, {}, {}, {}, mongoose.Document<unknown, {}, IAuction, {}, mongoose.DefaultSchemaOptions> & IAuction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAuction>;
export default _default;
//# sourceMappingURL=auction.model.d.ts.map