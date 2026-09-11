import { PDFParse } from "pdf-parse";
import { Note } from "../Model/NoteModel.js";
import { textChunks } from "../Utils/Chunk.js";
import { create_embedding } from "../Utils/Embedding.js";
import { index } from "../Config/Connect_DB.js";
import { rerank } from "../Utils/Cohere_rerank.js";
import { generate_content } from "../Utils/ContentGenerate.js";
import { Conversion } from "../Model/ConversionModel.js";
import { rephraseQuery } from "../Utils/RepraseContent.js";

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

        const chunks = textChunks(parsedPdf.text);
        const vector_list = []

        for (const chunk of chunks) {
            const chunk_vector = await create_embedding(chunk);
            vector_list.push({
                id: `docs-${note_title}-${Date.now()}`,
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

        const new_conversion = Conversion({
            user_id, note_id: newNote?._id
        });
        await new_conversion.save();

        return res.status(201).json({ message: "Note saved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const note_quary = async (req, res) => {
    const { question, note_title, user_id } = req.body;
    if (!question || !note_title || !user_id) return res.status(400).json({ message: "Info reqire" });

    try {
        const active_note = await Note.findOne({ user_id, note_title }).select("_id");
        if (!active_note) return res.status(404).json({ message: "Note not found" });

        const question_vector = await create_embedding(question);
        const search_querys = await index.query({
            vector: question_vector,
            topK: 20,
            includeMetadata: true,
            filter: {
                user_id: { $eq: user_id },
                note_title: { $eq: note_title }
            }
        });

        const initial_docs = (search_querys.matches || [])
            .map(match => match.metadata?.text)
            .filter(Boolean);
        const reranked_docs = await rerank(initial_docs, question);
        const retrive_content = reranked_docs.map(match => initial_docs[match.index]).join("\n---\n");
        
        const historyDoc = await Conversion.findOne({ user_id, note_id: active_note._id })
            .select({ message: { $slice: -5 } })
            .lean();
        const history = historyDoc?.message ?? [];
        
        const repharseQuestion = await rephraseQuery(history, question);

        const response = await generate_content(retrive_content, repharseQuestion);
        

        const active_conversion = await Conversion.findOne({
            user_id,
            note_id: active_note._id
        });
        if (!active_conversion) return res.status(404).json({ message: "Conversion not found" });

        active_conversion.message.push({ role: "user", content: question, timestamps: new Date() });
        active_conversion.message.push({ role: "assistant", content: response, timestamps: new Date() });
        await active_conversion.save();

        return res.status(200).json({ response });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}