import express from "express";
import "dotenv/config.js";
import cors from "cors";

import { connect_DB } from "./Config/Connect_DB.js";

import NoteRouter from "./Routers/NoteRouter.js";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({
    
}));

app.use("/api/notes", NoteRouter);

await connect_DB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});