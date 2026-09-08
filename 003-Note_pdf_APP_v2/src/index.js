import express from "express";
import "dotenv/config.js"
import { connest_DB } from "./Config/ConnestDB.js";
import noteRouter from "./Router/NoteRouter.js";

const app = express();
const port = process.env.PORT || 5500

app.use(express.json());
app.use("/notes", noteRouter);


connest_DB();
app.listen(port, () => {
    console.log("Server is running on: ", port);
})