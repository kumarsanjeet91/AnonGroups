import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { Group } from "@/models/Group";
import { seedDefaultGroups } from "@/server/seed";

export async function GET() {
  const user = await getCurrentUserFromCookies();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  await connectToDatabase();
  await seedDefaultGroups();
  const groups = await Group.find({}).sort({ createdAt: 1 }).lean();

  return NextResponse.json({
    groups: groups.map((group) => ({
      _id: group._id.toString(),
      name: group.name,
      description: group.description,
      createdAt: group.createdAt.toISOString()
    }))
  });
}
