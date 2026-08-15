/**
 * Server-side session helper
 * Wraps auth.api.getSession() with the headers() call it needs, so
 * server components / actions don't have to repeat that boilerplate.
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}
