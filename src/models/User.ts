import mongoose, { Model, Schema } from "mongoose";

export type UserDocument = {
  _id: mongoose.Types.ObjectId;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  usernameChangedAt?: Date;
  passwordChangedAt?: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 20,
      match: /^[A-Za-z0-9_]{6,20}$/
    },
    passwordHash: {
      type: String,
      required: true
    },
    usernameChangedAt: {
      type: Date
    },
    passwordChangedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
