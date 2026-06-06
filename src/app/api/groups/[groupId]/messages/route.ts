import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { Group } from "@/models/Group";
import { Message } from "@/models/Message";

export async function GET(_: Request, context: { params: Promise<{ groupId: string }> }) {
  const user = await getCurrentUserFromCookies();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { groupId } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return NextResponse.json({ error: "Invalid group." }, { status: 400 });
  }

  await connectToDatabase();
  const group = await Group.findById(groupId).lean();
  if (!group) return NextResponse.json({ error: "Group not found." }, { status: 404 });

  const messages = await Message.find({ groupId }).sort({ createdAt: -1 }).limit(100).lean();
  messages.reverse();

  return NextResponse.json({
    group: {
      _id: group._id.toString(),
      name: group.name,
      description: group.description,
      createdAt: group.createdAt.toISOString()
    },
    messages: messages.map((message) => ({
      _id: message._id.toString(),
      groupId: message.groupId.toString(),
      userId: message.userId.toString(),
      username: message.username,
      text: message.text,
      createdAt: message.createdAt.toISOString()
    }))
  });
}
