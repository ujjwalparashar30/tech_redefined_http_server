import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface for the message document
export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the schema
const messageSchema: Schema<IMessage> = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create the model
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
