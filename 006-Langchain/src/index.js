import express from "express";
import { startServer } from "./server.js";
import "dotenv/config.js"
import { connectDB_MongoDB } from "./Config/Connect_DB.js";
import { getIndex } from "./Config/Pinecone.js";

export const app = express();
const port = process.env.PORT || 8080

app.use(express.json());

await connectDB_MongoDB();
await getIndex();
startServer(port);