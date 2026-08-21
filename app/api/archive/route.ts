import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Entry } from "@/models/Entry";

export async function GET() {
  await connectDB();
  const entries = await Entry.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(entries);
}
