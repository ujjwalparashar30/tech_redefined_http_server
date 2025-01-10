import {User} from "../modals/userSchema"
import {userSchemaValidation} from "./../zod/zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();
import { Request, Response } from "express";
// Register a new user
export const signupUser = async (req: Request, res: Response) => {
  try {const parsedData = userSchemaValidation.safeParse(req.body)

    if(parsedData.success){
        const {username, password,email} = parsedData.data
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password,salt)

       const user = await User.create({
        username:username,
        password:hashedPassword,
        email : email
    })
    const token = jwt.sign({
      id : user._id
  },process.env.JWT_Secret as string)
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
    res.status(201).json({
      message: "User created successfully",
    })
    }
    else {
        res.status(400).json({
            message : "bad request",
            error : parsedData.error
        })
    }}
    catch{
        res.status(403).json({
            message : "user already exist"
            })
    }
    
}

// Login user
export const loginUser = async(req:Request, res:Response) => {
  const {username,password} = req.body;
    const existingUser = await User.findOne({
        username:username
    })

    if(existingUser){
        const verification = await bcrypt.compare(password,existingUser.password as string)
        if(verification){
        const token = jwt.sign({
            id : existingUser._id
        },process.env.JWT_Secret as string)
        res.cookie("jwt", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // MS
          httpOnly: true, // prevent XSS attacks cross-site scripting attacks
          sameSite: "strict", // CSRF attacks cross-site request forgery attacks
          secure: process.env.NODE_ENV !== "development",
        });
        res.json(token)
    }
    else{
        res.status(401).json({
            message : "Invalid Password"
            })
    }
}
    else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
}

//logout user
export const logoutUser = async(req:Request, res:Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
      } catch (error) {
        console.log("Error in logout controller", (error as Error).message);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { profilePhoto } = req.body;
        
        // Validate required fields
        if (!id) {
             res.status(400).json({ message: "User ID is required" });
             return
        }

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
          id,
            {
             
                profilePhoto,
                
            },
            { new: true, runValidators: true } // Returns updated user and runs schema validation
        );

        if (!updatedUser) {
             res.status(404).json({ message: "User not found" });
             return
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error", error: (error as Error).message });
    }
};


export const checkAuth = async(req:Request, res:Response) => {
    try {
        //@ts-ignore
        const user = await User.findById(req.userId)  
      res.status(200).json(user);
    } catch (error) {
      console.log("Error in checkAuth controller", (error as Error).message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
// Get profile
export const getProfile = async(req:Request, res:Response) => {
  try{
    const { id } = req.params;
  const user = await User.findById(id).populate("posts")
  res.status(200).json(user);
  }
  catch (err){
    res.status(500).json("internal server error : " + err)
  }
  
}
