
import mongoose, { Schema, model } from 'mongoose'; 
let schema = new Schema({
    name: String,
    update: { type: Number },
    date: { type: Number, default: new Date().getTime() },
    sell: Number,
    buy: Number,
    updown: { type: String, default: 'Equal', enum: ["Equal", "up", "down"] },
})
mongoose.models = {}
let currency = model('currency', schema)
export default currency 