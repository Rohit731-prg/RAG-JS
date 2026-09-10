import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const create_embedding = async (text) => {
    try {
        const response = await ai.models.embedContent({
            model: 'text-embedding-001',
            contents: text,
            config: {
                outputDimensionality: 3072
            },
        });

        const values = response.embeddings[0].values;
        if (!values) {
            throw new Error("Gemini returned an empty embedding");
        };

        return values;
    } catch (error) {
        console.log(error);
    }
};