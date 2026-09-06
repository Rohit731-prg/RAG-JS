import express from "express";
import { PDFParse } from "pdf-parse";
import { chunkText } from "../Utils/ChunkText.js";
import { convert_vector_array, gemini_response } from "../Utils/VectorArray.js";
import { index } from "../Config/ConnectDB.js";

const router = express.Router();

router.post("/add", express.raw({
    type: "application/pdf",
    limit: "10mb"
}), async (req, res) => {
    const parser = new PDFParse({ data: req.body });
    const PDF_data = await parser.getText();
    await parser.destroy();
    if (!PDF_data) return res.status(400).json({ message: "PDF not found..! " });
    const chunks = await chunkText(PDF_data.text);

    if (chunks.length === 0) {
        return res.status(400).json({ message: "PDF does not contain any text..!" });
    }

    try {
        const vector_to_upsert = []
        for (let [i, chunk] of chunks.entries()) {
            const vector = await convert_vector_array(chunk);
            vector_to_upsert.push({
                id: `pdf-chunk-${Date.now()}-${i}`,
                values: vector,
                metadata: { text: chunk }
            })
            i++;
        }

        await index.upsert({ records: vector_to_upsert });
        return res.status(201).json({ message: `Processed PDF into ${chunks.length} chunks!` });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
});

router.post("/question", async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "quary is missing " });

    try {
        const vector_question = await convert_vector_array(question);
        const search_result = await index.query({
            vector: vector_question,
            topK: 3,
            includeMetadata: true
        });

        const retrive_content = search_result.matches.map(match => match.metadata.text).join("\n---\n");

        const prompt = `Use ONLY this PDF context to answer the question: Context:${retrive_content}Question: ${question}`;

        const response = await gemini_response(prompt);

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

export default router