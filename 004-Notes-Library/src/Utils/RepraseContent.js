import OpenAI from "openai";

// Initialize OpenAI client configured for Groq Cloud
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export const rephraseQuery = async (history, question) => {
    if (!history) return question;

    const formattedHistory = history.map(hist => `${hist.role == "assistant" ? "assistant": "user"}: ${hist.content}`).join('\n');

    const systemPrompt = `You are a query reformulator for a search system.
    Given a conversation history and a follow-up user question, rephrase the follow-up question into a single standalone search query.
    - Maintain the exact semantic meaning and topic from the history.
    - Eliminate vague pronouns (like "it", "they", "this", "that").
    - Output ONLY the rephrased standalone query string. Do NOT add preamble, quotes, explanations, or answers.`;

    const userPrompt = `Conversation History:
    ${formattedHistory}

    Follow-up Question: ${question}

    Standalone Query:`;

    try {
        const response = await client.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.1
        });

        return response.choices[0]?.message?.content?.trim();
    } catch (error) {
        console.log(error);
        return error;
    }
};
