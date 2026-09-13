import { MemoryVectorStore } from "@langchain/core/vectorstores/memory";

export const vector_store = async (docs, embedding) => {
    const response = await MemoryVectorStore.fromDocuments(
        docs, embedding
    );

    return response
}