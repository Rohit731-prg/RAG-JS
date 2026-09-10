import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const create_vector = async (text) => {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
            config: {
                outputDimensionality: 768
            }
        });

        const values = response.embeddings?.[0]?.values;
        if (!values?.length) {
            throw new Error("Gemini returned an empty embedding");
        }
        return values
    } catch (error) {
        console.error("Error from Gemini: ", error);
        throw error;
    }
}

export const get_gemini_response = async (quary) => {
    try {
        const reponse = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: quary,
        });

        return reponse.text;
    } catch (error) {
        console.error("Error from Gemini: ", error);
    }
}