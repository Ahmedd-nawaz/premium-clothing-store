import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, redirectTo } = body;

    await auth.api.requestPasswordReset({
      body: { email, redirectTo },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: { message: "Internal server error" } }, { status: 500 });
  }
}