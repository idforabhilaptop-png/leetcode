import express from "express";
import adminMiddleware from "../middleware/adminMiddleware";
import { createProblem, deleteProblem, getAllProblem, getProblemById, solvedAllProblembyUser, updateProblem } from "../controllers/userProblem";
import userMiddleware from "../middleware/userMiddleware";

const problemRouter = express.Router();


problemRouter.post('/create',adminMiddleware, createProblem);
problemRouter.put('/update/:id', adminMiddleware , updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware , deleteProblem);

problemRouter.get('/problemById/:id',userMiddleware , getProblemById);
problemRouter.get('/getAllProblem', userMiddleware , getAllProblem);
problemRouter.get('/problemSolvedByUser', userMiddleware , solvedAllProblembyUser);

export {problemRouter}