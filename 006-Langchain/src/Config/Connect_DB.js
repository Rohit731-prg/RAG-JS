import mongoose from "mongoose";

export const connectDB_MongoDB = async () => {
    try {
        const host = await mongoose.connect(process.env.MONGO_DB);
        console.log("Connect DB: ", host.connection.host);
    } catch (error) {
        console.log(error);
    }
}