import express from "express";
import { register , login , logout, adminRegister, getProfile, deleteProfile } from "../controllers/userAuthenticate.js";
import userMiddleware from "../middleware/userMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import getProfileMiddleware from "../middleware/getProfileMiddleware.js";

const authRouter = express.Router()


authRouter.post('/register' , register)
authRouter.post('/admin/register' ,adminMiddleware , adminRegister)
authRouter.post('/login' , login)
authRouter.post('/logout' ,userMiddleware ,  logout)
authRouter.get('/getProfile' ,getProfileMiddleware , getProfile)
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);


export default authRouter;