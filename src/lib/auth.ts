import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AuthTokenPayload, signJwt, TOKEN_MAX_AGE_SECONDS, verifyJwt } from "./jwt";

const COOKIE_NAME = "anon_token";

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getCurrentUserFromCookies(): Promise<AuthTokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return token ? verifyJwt(token) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserFromRequest(request: NextRequest): AuthTokenPayload | null {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    return token ? verifyJwt(token) : null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
export { signJwt, verifyJwt };
