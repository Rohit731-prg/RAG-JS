import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note_title: { type: String, required: true },
    content: { type: String, required: true }
}, {
    timestamps: true
});

export const Note = mongoose.model("Note", NoteSchema);