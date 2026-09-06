import { Note } from "../Models/NoteSchema.js";
import { cosineSimilarity } from "../Utils/cosineSimilarity.js";
import { create_vector_array, send_quary_to_gemini } from "../Utils/Vector_array.js";
import express from "express";

const router = express.Router();

router.post("/add", async (req, res) => {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    try {
        // generate vector array using gemini
        const vectorArray = await create_vector_array(note);

        const new_note = new Note({
            note,
            embedding: vectorArray
        });
        await new_note.save();
        return res.status(201).json({ message: "Note added successfully", note: new_note });
    } catch (error) {
        console.error("Error adding new note:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const notes = await Note.find().select("-embedding").lean();
        return res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/quary", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Query is required" });
    try {
        // convert query to vector array using gemini
        const user_vector_array = await create_vector_array(query);

        const all_notes = await Note.find().lean();

        // Calculate similarity scores
        const scoreNotes = all_notes.map(note => ({
            note: note.note,
            score: cosineSimilarity(user_vector_array, note.embedding)
        }));

        // Sort by highest score & take top 2
        scoreNotes.sort((a, b) => b.score - a.score);
        const topNotes = scoreNotes.slice(0, 2).map(n => n.note).join("\n");
        console.log("Top notes:", topNotes);

        // Send context + question to Gemini
        const prompt = `Answer using ONLY this context:\n${topNotes}\n\nQuestion: ${query}`;

        const result = await send_quary_to_gemini(prompt);
        return res.status(200).json({ answer: result });
    } catch (error) {
        console.error("Error querying notes:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;