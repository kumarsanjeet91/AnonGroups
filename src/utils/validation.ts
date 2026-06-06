export const USERNAME_PATTERN = /^[A-Za-z0-9_]{6,20}$/;

export function sanitizeUsername(username: unknown) {
  return String(username || "").trim();
}

export function sanitizePassword(password: unknown) {
  return String(password || "");
}

export function sanitizeMessage(text: unknown) {
  return String(text || "")
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 500);
}

export function isValidUsername(username: string) {
  return USERNAME_PATTERN.test(username);
}

export function isValidPassword(password: string) {
  return password.length >= 6;
}

export function isValidMessage(text: string) {
  return text.length > 0 && text.length <= 500;
}
