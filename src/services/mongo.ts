require('dotenv').config();
import mongoose from 'mongoose';

const URI: string = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test';


export function mongoConnect() {
  mongoose.connect(URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err: any) => console.error(err));
}
export async function mongoDisconnect() {
  await mongoose.disconnect();
}
