import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/auth";
import { presignProductImageUpload } from "@/lib/storage";

export async function POST(request: NextRequest) {
  if (!(await isValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const filename = body?.filename;
  const contentType = body?.contentType;

  if (typeof filename !== "string" || typeof contentType !== "string") {
    return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 });
  }

  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
  }

  try {
    const result = await presignProductImageUpload(filename, contentType);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to presign upload:", err);
    return NextResponse.json({ error: "Could not create upload URL" }, { status: 500 });
  }
}
