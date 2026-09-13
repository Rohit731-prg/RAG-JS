import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embedding = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001"
});