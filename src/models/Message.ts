import mongoose, { Model, Schema } from "mongoose";

export type MessageDocument = {
  _id: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

const MessageSchema = new Schema<MessageDocument>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true,
      maxlength: 20
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

MessageSchema.index({ groupId: 1, createdAt: -1 });

export const Message: Model<MessageDocument> =
  mongoose.models.Message || mongoose.model<MessageDocument>("Message", MessageSchema);
