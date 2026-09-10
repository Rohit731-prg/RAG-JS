import express from "express";
import "dotenv/config.js"
import { start_server } from "./server.js";
import { connect_DB_MongoDB } from "./Config/Connect_DB.js";

export const app = express();

app.use(express.json());

start_server();
await connect_DB_MongoDB();