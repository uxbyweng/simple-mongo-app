import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Entry } from "@/models/Entry";

export async function GET() {
  await connectDB();
  const entries = await Entry.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();

  if (!body.name || !body.message) {
    return NextResponse.json(
      { error: "name und message sind erforderlich" },
      { status: 400 }
    );
  }

  const entry = await Entry.create({
    name: body.name,
    message: body.message,
  });

  return NextResponse.json(entry, { status: 201 });
}
