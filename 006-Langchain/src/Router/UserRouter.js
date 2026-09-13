import express from "express";
import { UserSignUp } from "../Controller/UserController.js";

const router = express.Router();

router.post("/signup", UserSignUp);

export default router;