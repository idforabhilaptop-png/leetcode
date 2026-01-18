
import express from "express";
import userMiddleware from "../middleware/userMiddleware";
import { runCode, submitCode } from "../controllers/userSubmission";
const submitRouter = express.Router();

submitRouter.post("/submit/:id", userMiddleware, submitCode);
submitRouter.post("/run/:id",userMiddleware,runCode);

export default submitRouter;
