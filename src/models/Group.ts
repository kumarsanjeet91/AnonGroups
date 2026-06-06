import mongoose, { Model, Schema } from "mongoose";

export type GroupDocument = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

const GroupSchema = new Schema<GroupDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 60
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180
    }
  },
  { timestamps: true }
);

export const Group: Model<GroupDocument> =
  mongoose.models.Group || mongoose.model<GroupDocument>("Group", GroupSchema);
