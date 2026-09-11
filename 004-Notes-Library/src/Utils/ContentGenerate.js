import OpenAI from "openai";


const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export const generate_content = async (bestContext, question) => {
    try {
        const completion = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant. Answer using ONLY the provided context.'
                },
                {
                    role: 'user',
                    content: `Context:\n${bestContext}\n\nQuestion: ${question}`
                }
            ],
            temperature: 0.2
        });
        return completion.choices[0]?.message?.content
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

