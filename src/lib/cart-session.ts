/**
 * Guest Cart Session Helper
 * Logged-in users get their Cart tied to userId. Guests get a random
 * session id stored in an httpOnly cookie, so their cart survives
 * across page loads without needing an account.
 */

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const CART_COOKIE = "cart_session_id";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function getOrCreateCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const sessionId = randomUUID();
  cookieStore.set(CART_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: THIRTY_DAYS,
    path: "/",
  });
  return sessionId;
}