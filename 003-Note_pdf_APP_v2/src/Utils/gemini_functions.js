import { GoogleGenAI } from "@google/genai";
import { response } from "express";

const ai = GoogleGenAI({
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

        const values = response.embedding?.[0].values;
        return values
    } catch (error) {
        console.error("Error from Gemini: ", error);
    }
}

export const get_gemini_response = async (quary) => {
    try {
        const reponse = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: quary,
        });

        return response.text;
    } catch (error) {
        console.error("Error from Gemini: ", error);
    }
}