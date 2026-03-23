import connectToDatabase from "@/lib/db";
import User, { IUser } from "@/lib/models/user.model";
import { Types } from "mongoose";

export class UserService {
  /**
   * Fetch user profile data.
   */
  static async getUserProfile(userId: string) {
    await connectToDatabase();
    const user = await User.findById(new Types.ObjectId(userId)).select("-password").lean();
    return user as IUser & { _id: Types.ObjectId };
  }

  /**
   * Update user profile information.
   */
  static async updateUser(userId: string, data: Partial<IUser>) {
    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { $set: data },
      { new: true }
    ).select("-password").lean();
    
    return updatedUser as IUser & { _id: Types.ObjectId };
  }
}
