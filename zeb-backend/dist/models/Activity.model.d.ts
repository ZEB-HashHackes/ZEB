import mongoose, { Document } from "mongoose";
export declare enum ActivityType {
    MINTED = "minted",
    LISTING = "listing",
    SALE = "sale",
    BID = "bid",
    CANCELLED = "cancelled"
}
export interface IActivity extends Document {
    type: ActivityType;
    artId: mongoose.Types.ObjectId;
    from?: string;
    to?: string;
    amount?: number;
    transactionHash?: string;
    timestamp: Date;
}
declare const _default: mongoose.Model<IActivity, {}, {}, {}, mongoose.Document<unknown, {}, IActivity, {}, mongoose.DefaultSchemaOptions> & IActivity & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IActivity>;
export default _default;
//# sourceMappingURL=Activity.model.d.ts.map