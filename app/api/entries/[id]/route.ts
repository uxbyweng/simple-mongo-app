import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Entry } from "@/models/Entry";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  await Entry.findByIdAndUpdate(id, { deletedAt: new Date() });
  return NextResponse.json({ success: true });
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  await Entry.findByIdAndUpdate(id, { deletedAt: null });
  return NextResponse.json({ success: true });
}
