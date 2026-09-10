import express from "express";
import { PDFParse } from "pdf-parse";
import { upload } from "../Middleware/multer.js";
import { chunkText } from "../Utils/Chunk_texts.js";
import { create_vector, get_gemini_response } from "../Utils/gemini_functions.js";
import { index } from "../Config/ConnestDB.js";
import { CohereClient } from "cohere-ai";

const router = express.Router();
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

router.post("/add-note", upload.single("pdf"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "PDF file is required" });
        }
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfRow = await parser.getText();
        await parser.destroy();

        if (!pdfRow?.text?.trim()) return res.status(400).json({ message: "PDF has no readable text" });
        const chunks = chunkText(pdfRow.text);

        const vector_to_upsert = []
        let i = 0;
        for (let chunk of chunks) {
            const vector = await create_vector(chunk);
            vector_to_upsert.push({
                id: `pdf-chunk-${Date.now()}-${i}`,
                values: vector,
                metadata: { text: chunk, userID: "example_user" }
            });
            i += 1
        }

        await index.upsert({ records: vector_to_upsert });
        return res.status(200).json({ text: pdfRow.text });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

router.post("/question", async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "quary is missing " });

    try {
        const vector_question = await create_vector(question);
        const search_result = await index.query({
            vector: vector_question,
            topK: 10,
            includeMetadata: true
        });

        const initial_docs = (search_result.matches ?? [])
            .map(match => match.metadata?.text)
            .filter(Boolean);
        const ranked = await cohere.rerank({
            model: 'rerank-english-v3.0',
            query: question,
            documents: initial_docs,
            topN: 3
        });

        const retrive_content = ranked.results.map(match => initial_docs[match.index]).join("\n---\n");
        const prompt = `Use ONLY this PDF context to answer the question: Context:${retrive_content}Question: ${question}`;
        const response = await get_gemini_response(prompt);

        return res.status(200).json({ response });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
})

export default router;