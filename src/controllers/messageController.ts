import { Request, Response } from "express";
import { User } from "../modals/userSchema";
import Message from "../modals/messageSchema";
import { getReceiverSocketId, io } from "../lib/socket";

// Get users for the sidebar
export const getUsersForSidebar = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const loggedInUserId = req.userId;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages between two users
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: userToChatId } = req.params;
    //@ts-ignore
    const myId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    //@ts-ignore
    const senderId = req.userId;

    // Create the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image, // Directly storing image data in the same schema
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};
