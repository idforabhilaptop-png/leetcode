
import express from "express";
import userMiddleware from "../middleware/userMiddleware";
import { runCode, submitCode } from "../controllers/userSubmission";
import submitCodeRateLimiter from "../middleware/ratelimiter";
const submitRouter = express.Router();

submitRouter.post("/submit/:id", userMiddleware,submitCodeRateLimiter , submitCode);
submitRouter.post("/run/:id",userMiddleware,submitCodeRateLimiter, runCode);

export default submitRouter;
