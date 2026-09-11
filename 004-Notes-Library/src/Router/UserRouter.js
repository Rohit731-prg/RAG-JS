import express from "express";
import { login, UserSignUp } from "../Controller/UserController.js";

const router = express.Router();

router.post("/signup", UserSignUp);
router.post("/login", login);

export default router;