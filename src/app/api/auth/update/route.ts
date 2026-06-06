import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { User } from "@/models/User";
import { isValidPassword, isValidUsername, sanitizePassword, sanitizeUsername } from "@/utils/validation";

export async function POST(request: NextRequest) {
  const user = getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const body = await request.json();
    const field = body.field as string;
    await connectToDatabase();

    if (field === "username") {
      const username = sanitizeUsername(body.username);
      if (!isValidUsername(username)) return NextResponse.json({ error: "Invalid username." }, { status: 400 });
      const existing = await User.exists({ username });
      if (existing) return NextResponse.json({ error: "Username already taken." }, { status: 409 });
      const updated = await User.findByIdAndUpdate(user.userId, { username, usernameChangedAt: new Date() }, { new: true });
      return NextResponse.json({ user: { username: updated?.username, usernameChangedAt: updated?.usernameChangedAt } });
    }

    if (field === "password") {
      const password = sanitizePassword(body.password);
      if (!isValidPassword(password)) return NextResponse.json({ error: "Invalid password." }, { status: 400 });
      const passwordHash = await bcrypt.hash(password, 12);
      const updated = await User.findByIdAndUpdate(user.userId, { passwordHash, passwordChangedAt: new Date() }, { new: true });
      return NextResponse.json({ user: { passwordChangedAt: updated?.passwordChangedAt } });
    }

    return NextResponse.json({ error: "Unknown field." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Unable to update." }, { status: 500 });
  }
}
