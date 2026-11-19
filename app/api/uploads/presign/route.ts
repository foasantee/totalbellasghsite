import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/auth";
import { presignProductImageUpload } from "@/lib/storage";

// Keeps product video clips short enough that page loads and mobile data
// usage stay reasonable — plenty for a quick product-in-use clip.
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!(await isValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const filename = body?.filename;
  const contentType = body?.contentType;
  const size = body?.size;

  if (typeof filename !== "string" || typeof contentType !== "string") {
    return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 });
  }

  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Only image or video uploads are allowed" }, { status: 400 });
  }

  if (isVideo && typeof size === "number" && size > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      { error: `Video is too large — please trim or compress it below ${MAX_VIDEO_BYTES / (1024 * 1024)}MB.` },
      { status: 400 }
    );
  }

  try {
    const result = await presignProductImageUpload(filename, contentType);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to presign upload:", err);
    return NextResponse.json({ error: "Could not create upload URL" }, { status: 500 });
  }
}
