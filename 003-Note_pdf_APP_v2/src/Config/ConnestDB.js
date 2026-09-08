import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

export const index = pc.index("pdf-rag-index");

export const connest_DB = async () => {
    try {
        const state = await index.describeIndexStats();
        console.log("Database is connected...\nTotal Index: ", state.totalRecordCount);
    } catch (error) {
        console.error("Error from connect DB: ", error);
    }
}