import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Entry } from "@/models/Entry";

const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function GET() {
  await connectDB();
  const entries = await Entry.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  await connectDB();
  const body = await request.json();

  if (!body.name || !body.message) {
    return NextResponse.json(
      { error: "name and message are required" },
      { status: 400 }
    );
  }

  const entry = await Entry.create({
    name: body.name,
    message: body.message,
    chalk: typeof body.chalk === "number" ? body.chalk : 0,
  });

  return NextResponse.json(entry, { status: 201 });
}
