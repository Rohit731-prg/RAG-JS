import express from "express";
import "dotenv/config.js";

import { llm } from "./llm.js";
import { chunks_re } from "./splitter.js";
import { embedding } from "./embidding.js";
import { vector_store } from "./vectorstore.js";

export const data =
    "These rules say that a certain symbol may be expanded in the tree by a sequence of other symbols. According to first order logic rule, ff there are two strings Noun Phrase (NP) and Verb Phrase (VP), then the string combined by NP followed by VP is a sentence. The rewrite rules for the sentence are as follows:";

const app = express();
const port = 5000;

app.use(express.json());

app.get("/api", async (req, res) => {
    try {
        const response = await llm.invoke(
            "Explain RAG in 1 line."
        );

        res.json({
            message: response.content
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
});

const docs_s = await chunks_re();

const store = await vector_store(
    docs_s,
    embedding
);

console.log(store);

app.listen(port, () => {
    console.log("Server is running on port no:", port);
});