import { User } from "../models/user.model.js";
import { IUserDocument, IUser } from "../types/user.types.js";
import { Types } from "mongoose";

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email });
  }

  async findById(id: string | Types.ObjectId): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async findByUsername(username: string): Promise<IUserDocument | null> {
    // Case-insensitive search for username
    return User.findOne({ username: username.toLowerCase() });
  }

  async create(userData: Partial<IUser>): Promise<IUserDocument> {
    return User.create(userData);
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }
}
