import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { signJwt, setAuthCookie } from "@/lib/auth";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { User } from "@/models/User";
import { sanitizePassword, sanitizeUsername } from "@/utils/validation";

const limiter = createRateLimiter({ windowMs: 60_000, max: 10 });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!limiter.check(ip)) {
    return NextResponse.json({ error: "Too many login attempts. Try again shortly." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const username = sanitizeUsername(body.username);
    const password = sanitizePassword(body.password);

    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const token = signJwt({ userId: user._id.toString(), username: user.username });
    const response = NextResponse.json({ user: { userId: user._id.toString(), username: user.username } });
    setAuthCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to log in." }, { status: 500 });
  }
}
