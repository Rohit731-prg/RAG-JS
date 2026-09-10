import mongoose from "mongoose";
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

export const index = pc.index("pdf-note-v1");

export const connect_DB_MongoDB = async () => {
    try {
        const host = await mongoose.connect(process.env.MONGO_DB);
        console.log("MONGO_DB is connected: ", host.connection.host);
    } catch (error) {
        console.log("Error from mongoDB connecttion: ", error);
    }
}

export const connect_pinecone = async () => {
    try {
        const host = await index.describeIndexStats();
        console.log("Pinecone is connected...", host.namespaces);
    } catch (error) {
        console.log("Error from pinecone connecttion: ", error);
    }
}