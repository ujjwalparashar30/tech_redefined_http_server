import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./userSchema";
import { postDocument } from "./postSchema";

export interface DesignerDocument extends UserDocument{
    items: postDocument[];
}

const DesignerSchema = new Schema<DesignerDocument>({
    username: {
        type: String,
        required: true,
        unique : true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        items :{
            type: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
            required: false
        }
})

export const Designer = mongoose.model("Designer",DesignerSchema)