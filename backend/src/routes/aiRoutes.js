import express from 'express';
import { chatWithAI } from '../controllers/aiController';
import userMiddleware from '../middleware/userMiddleware';

const router = express.Router();

router.post('/chat', userMiddleware , chatWithAI);

export default router;
