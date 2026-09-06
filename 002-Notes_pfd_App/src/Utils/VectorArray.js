import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const convert_vector_array = async (text) => {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
            outputDimensionality: 768
        }
    });

    const values = response.embeddings?.[0]?.values;
    if (!values) throw new Error("Gemini did not return an embedding");
    return values;
};

export const gemini_response = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.log(error);
    }
}