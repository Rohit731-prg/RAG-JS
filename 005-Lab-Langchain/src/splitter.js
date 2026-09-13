import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { data } from "./index.js";
import { create_document } from "./document.js";

const split = new  RecursiveCharacterTextSplitter({
    chunkSize: 30,
    chunkOverlap: 5
});

const split_fun = async (txt) => {
    return await split.splitText(txt);
}

// const Chunks = await split_fun(data)
// let i = 0;
// for (const chunk of Chunks) {
//     const docs = create_document(chunk, i);
//     result.push(docs);
//     i++;
// }

// for (const chunk of result) {
//     console.log(chunk)
// }


export const chunks_re = async () => {
    const document = create_document(data, 0);
    const documents = await split.splitDocuments([document]);
    return documents
}
