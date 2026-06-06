import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "development-only-change-me";
export const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AuthTokenPayload = {
  userId: string;
  username: string;
};

export function signJwt(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE_SECONDS });
}

export function verifyJwt(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  return { userId: decoded.userId, username: decoded.username };
}

export function getJwtSecret() {
  return JWT_SECRET;
}
