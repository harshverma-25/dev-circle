import mongoose, { Schema, Document } from "mongoose";

export interface IBannedUser extends Document {
  userId: mongoose.Types.ObjectId;
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const bannedUserSchema = new Schema<IBannedUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    reason: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const BannedUser = mongoose.model<IBannedUser>("BannedUser", bannedUserSchema);
export default BannedUser;
