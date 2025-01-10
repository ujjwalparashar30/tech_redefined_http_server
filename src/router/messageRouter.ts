import express from "express";
import { userMiddleware } from "../middleware/middleware";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", userMiddleware, getUsersForSidebar);
messageRouter.get("/:id", userMiddleware, getMessages);

messageRouter.post("/send/:id", userMiddleware, sendMessage);

export default messageRouter;
