import { PDFParse } from "pdf-parse";
import { Note } from "../Model/NoteModel.js";
import { textChunks } from "../Utils/Chunk.js";
import { create_embedding } from "../Utils/Embedding.js";
import { index } from "../Config/Connect_DB.js";

export const uploadPDF = async (req, res) => {
    const pdf = req.file;
    const { user_id, note_title } = req.body;

    if (!user_id || !note_title || !pdf) {
        return res.status(400).json({ message: "user_id, note_title, and PDF are required" });
    }

    try {
        const note = await Note.findOne({ user_id, note_title });
        if (note) return res.status(409).json({ message: "Note already exists" });

        const parser = new PDFParse({ data: pdf.buffer });
        const parsedPdf = await parser.getText();
        await parser.destroy();

        const chunks = textChunks(parsedPdf);
        const vector_list = []

        for (const chunk of chunks) {
            const chunk_vector = await create_embedding(chunk);
            vector_list.push({
                values: chunk_vector,
                metadata: {
                    text: chunk,
                    user_id: user_id,
                    note_title: note_title
                }
            });
        }
        await index.upsert({ records: vector_list });

        const newNote = new Note({
            user_id,
            note_title,
            content: parsedPdf.text
        });
        await newNote.save();
        return res.status(201).json({ message: "Note saved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const note_quary = async (req, res) => {
    const { question, note_title, user_id } = req.body;
    if (!question || !note_title || !user_id) return res.status(400).json({ message: "Info reqire" });

    try {
        const question_vector = textChunks(question);
        const search_querys = await index.query({
            vector: question_vector,
            topK: 20,
            includeMetadata: true,
            filter: {
                
            }
        });

        const initial_docs = (search_querys || []).map(match => match.metadata.text)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}