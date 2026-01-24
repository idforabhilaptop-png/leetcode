import express from "express";
import { deleteVideo, generateUploadSignature, saveVideoMetadata } from "../controllers/videoSection";
import adminMiddleware from "../middleware/adminMiddleware";


const videoRouter =  express.Router();

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);

export default videoRouter