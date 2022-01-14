import mongoose from 'mongoose';

export default async function DB() {
    const { DB } = process.env && process.env

    mongoose.connect(DB)
        .then(console.log(`DB`))
        .catch(err => console.log(err))
}