import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { signJwt, setAuthCookie } from "@/lib/auth";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { User } from "@/models/User";
import { isValidPassword, isValidUsername, sanitizePassword, sanitizeUsername } from "@/utils/validation";

const limiter = createRateLimiter({ windowMs: 60_000, max: 5 });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!limiter.check(ip)) {
    return NextResponse.json({ error: "Too many registration attempts. Try again shortly." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const username = sanitizeUsername(body.username);
    const password = sanitizePassword(body.password);

    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: "Username must be 6-20 characters using letters, numbers, or underscore." },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await User.exists({ username });
    if (existing) {
      return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, passwordHash });
    const token = signJwt({ userId: user._id.toString(), username: user.username });
    const response = NextResponse.json({ user: { userId: user._id.toString(), username: user.username } });
    setAuthCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to register." }, { status: 500 });
  }
}
