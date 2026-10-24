import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Ping the database to keep the connection alive
    await db.$runCommandRaw({ ping: 1 });
    return NextResponse.json({ status: "ok", db: "connected" }, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ status: "error", db: "disconnected" }, { status: 500 });
  }
}
