import express from "express";
import { userMiddleware } from "../middleware/middleware";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController.js";
import { getTrends, topUser } from "../controllers/trendsController";

const trendsRouter = express.Router();

trendsRouter.get("/", userMiddleware, getTrends);
trendsRouter.get("/topUser",topUser)

export default trendsRouter;
