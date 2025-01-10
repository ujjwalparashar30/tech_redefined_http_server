import express from "express";
import { signupUser, loginUser,logoutUser, getProfile,updateProfile,checkAuth } from "../controllers/userController";
import { userMiddleware } from "../middleware/middleware";

const userRouter = express.Router();

// Register route
userRouter.post('/signup', signupUser);

// Login route
userRouter.post('/login', loginUser);

// logout route
userRouter.post("/logout", logoutUser)

//change the profile
userRouter.put("/update-profile/:id", userMiddleware, updateProfile);

// Profile route
userRouter.get('/dashboard/:id',userMiddleware, getProfile);

//check auth
userRouter.get("/check", userMiddleware, checkAuth);

// Export the router
export default userRouter;