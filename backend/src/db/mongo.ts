import mongoose from 'mongoose'
export const conectarMongo = () => mongoose.connect(process.env.MONGO_URL!)