import mongoose, { Schema } from "mongoose";
import { IRefreshTokenDocument } from "../types/auth.types.js";

const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });
// Automatically clean up expired tokens from MongoDB using TTL index
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model<IRefreshTokenDocument>("RefreshToken", refreshTokenSchema);

export default RefreshToken;
export { RefreshToken };
