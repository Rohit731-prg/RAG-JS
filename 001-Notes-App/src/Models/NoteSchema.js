import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema({
    note: { type: String, required: true },
    embedding: { type: [Number], required: true },
}, {
    timestamps: true
});

export const Note = mongoose.model("Note", NoteSchema);