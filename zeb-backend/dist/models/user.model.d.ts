import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    username: string;
    passwordHash: string;
    publickey: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map