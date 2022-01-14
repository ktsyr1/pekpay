import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    _id: Number,
    name: String,
    location: {
        latitude: Number,
        longitude: Number,
    },
    
    email: String,
    roles: { type: String, required: false, default: 'member', enum: ["member", "editor", "support", 'Analyst', "administrator"] },
    password: String,
    
    Date: { type: Number, default: new Date() }
});

mongoose.models = {};
export default mongoose.model('user', schema);