import express from 'express'
import { loginUser, registerUser, adminLogin, getUserProfile } from '../controllers/userControler.js'
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get("/me", authUser, getUserProfile);

export default userRouter;