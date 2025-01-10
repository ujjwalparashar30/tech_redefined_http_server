import {User} from "../modals/userSchema"
import {userSchemaValidation} from "./../zod/zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();
import { Request, Response } from "express";
import { Post } from "../modals/postSchema";
import axios from "axios";
//get trends

export const getTrends = async(req:Request , res:Response)=>{
    try {
        const data = await Post.aggregate([
          {
            $group: {
              _id: '$category',
              totalLikes: { $sum: '$likeCount' },
            },
          },
          { $sort: { totalLikes: -1 } },
        ]);
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }

}

export const getPrediction = async(req:Request , res : Response)=>{
  try {
    const categories = {
      "categories": ["Dresses", "Outerwear","Footwear", "Tops", "Bottomwear","Accessories" ]
    }
    // Call the Python API
    const response = await axios.post('http://localhost:5000/predict', {
      categories,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
}

export const topUser = async (req: Request, res: Response): Promise<void> => {
  try {

    // Fetch all users from the database
    const users = await User.find().populate('posts');
    if(users.length===0){
      res.status(500).json({
        message:"NO USER FOUND"
      })
    }
    // Calculate totalLikes for each user
    const usersWithTotalLikes = users.map(user => ({
      ...user.toObject(), // Convert Mongoose document to plain object
      //@ts-ignore
      totalLikes: user.posts.reduce((sum, post) => sum + (post.likeCount), 0),
    }));

    // Sort users by totalLikes in descending order and take the top 5
    const topUsers = usersWithTotalLikes
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 5);

    // Respond with the top 5 users
    res.status(200).json({ success: true, data: topUsers });
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch top users.' });
  }
};

