import mongoose, { Schema } from "mongoose";
import { IEmailVerificationDocument } from "../types/auth.types.js";

const emailVerificationSchema = new Schema<IEmailVerificationDocument>(
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
emailVerificationSchema.index({ token: 1 });
// Automatically clean up expired verifications from MongoDB using TTL index
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailVerification = mongoose.model<IEmailVerificationDocument>(
  "EmailVerification",
  emailVerificationSchema
);

export default EmailVerification;
export { EmailVerification };
