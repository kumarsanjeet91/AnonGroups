import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import { ChatExperience } from "@/components/ChatExperience";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Group } from "@/models/Group";
import { Message } from "@/models/Message";
import { seedDefaultGroups } from "@/server/seed";
import { GroupDto, MessageDto } from "@/types/chat";

export default async function ChatPage({ params }: { params: Promise<{ groupId: string }> }) {
  const user = await getCurrentUserFromCookies();
  if (!user) redirect("/login");

  const { groupId } = await params;
  if (!mongoose.Types.ObjectId.isValid(groupId)) notFound();

  await connectToDatabase();
  await seedDefaultGroups();

  const [group, groups, messages] = await Promise.all([
    Group.findById(groupId).lean(),
    Group.find({}).sort({ createdAt: 1 }).lean(),
    Message.find({ groupId }).sort({ createdAt: -1 }).limit(100).lean()
  ]);

  if (!group) notFound();
  messages.reverse();

  const serializedGroup: GroupDto = {
    _id: group._id.toString(),
    name: group.name,
    description: group.description,
    createdAt: group.createdAt.toISOString()
  };

  const serializedGroups: GroupDto[] = groups.map((item) => ({
    _id: item._id.toString(),
    name: item.name,
    description: item.description,
    createdAt: item.createdAt.toISOString()
  }));

  const serializedMessages: MessageDto[] = messages.map((message) => ({
    _id: message._id.toString(),
    groupId: message.groupId.toString(),
    userId: message.userId.toString(),
    username: message.username,
    text: message.text,
    createdAt: message.createdAt.toISOString()
  }));

  return (
    <ChatExperience
      group={serializedGroup}
      groups={serializedGroups}
      initialMessages={serializedMessages}
      currentUser={user}
    />
  );
}
