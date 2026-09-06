import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
})

export const create_vector_array = async (note) => {
    // generate vector array using gemini
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: note
    });
    console.log("Embedding response:", response);
    const vector = response.embeddings[0].values;
    return vector;
}


export const send_quary_to_gemini = async (prompt) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    return response.text;
}