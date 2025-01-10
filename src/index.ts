import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import userRouter from "./router/userRouter";
import postRouter from "./router/postRouter";
import messageRouter from "./router/messageRouter";
import { server, app } from "./lib/socket"; // Import the shared server and app
import trendsRouter from "./router/trendRouter";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL as string)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.use("/", userRouter);
app.use("/post", postRouter);
app.use("/messages", messageRouter);
app.use("/trends",trendsRouter)

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
