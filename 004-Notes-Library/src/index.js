import express from "express";
import "dotenv/config.js"

import { start_server } from "./server.js";
import { connect_DB_MongoDB, connect_pinecone } from "./Config/Connect_DB.js";

import UserRouter from "./Router/UserRouter.js";
import NoteRouter from "./Router/NoteRouter.js";

export const app = express();

app.use(express.json());

app.use("/user", UserRouter);
app.use("/note", NoteRouter);

start_server();
await connect_DB_MongoDB();
await connect_pinecone();