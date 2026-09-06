import mongoose from "mongoose";

export const connect_DB = async () => {
    try {
        const host = await mongoose.connect(process.env.DB_URL)
        console.log("Connected to MongoDB host: ", host.connection.host);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
}