import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY
});

export const rerank = async (docs, question) => {
    try {
        const response = await cohere.rerank({
            model: "rerank-english-v3.0",
            query: question,
            documents: docs,
            topN: 3
        });
        
        return response.results
    } catch (error) {
        console.log(error);
        return [];
    }
}