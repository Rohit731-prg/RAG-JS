import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamps: { type: Date, require: true }
});

const ConversionSchma = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", require: true },
    note_id: { type: Schema.Types.ObjectId, ref: "User", require: true },
    message: [MessageSchema]
}, {
    timestamps: true
});

export const Conversion = mongoose.model("Conversion", ConversionSchma);