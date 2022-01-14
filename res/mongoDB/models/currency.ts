
import { Schema, model } from 'mongoose';
interface User {
    name: string;
    update: Number,
    date: Date,
    sell: Number,
    buy: Number,
    updown: String
}
let schema = new Schema<User>({
    name: String,
    update: { type: Number },
    date: { type: Date, default: new Date() },
    sell: Number,
    buy: Number,
    updown: { type: String, default: 'Equal', enum: ["Equal", "up", "down"] },
})
let currency = model<User>('currency', schema)
export default currency 