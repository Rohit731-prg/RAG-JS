import { Pinecone } from "@pinecone-database/pinecone";

export const index = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export const getIndex = async () => {
    await index.index("pdf-note-v1");
    console.log("Pinecone is connected...!");
};