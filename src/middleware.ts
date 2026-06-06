import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/groups", "/chat"];

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifyToken(token: string) {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return false;

    const secret = process.env.JWT_SECRET || "development-only-change-me";
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      new TextEncoder().encode(`${header}.${payload}`)
    );
    if (!valid) return false;

    const decoded = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as { exp?: number };
    return typeof decoded.exp === "number" && decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("anon_token")?.value;
  if (!token || !(await verifyToken(token))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/groups/:path*", "/chat/:path*"]
};
