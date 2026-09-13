import { Document } from "@langchain/core/documents";

export const create_document = (txt, i) => {
    return new Document({
        pageContent: txt,
        metadata: {
            id: i,
            user: "Rohit Singha"
        }
    })
}