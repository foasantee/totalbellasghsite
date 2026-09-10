import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is not set.`);
  return value;
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  client = new S3Client({
    endpoint: getEnv("SPACES_ENDPOINT"),
    region: process.env.SPACES_REGION || "us-east-1",
    credentials: {
      accessKeyId: getEnv("SPACES_KEY"),
      secretAccessKey: getEnv("SPACES_SECRET"),
    },
  });
  return client;
}

export function buildPublicUrl(key: string): string {
  const cdnUrl = process.env.SPACES_CDN_URL;
  if (cdnUrl) return `${cdnUrl.replace(/\/$/, "")}/${key}`;

  const bucket = getEnv("SPACES_BUCKET");
  const region = process.env.SPACES_REGION || "us-east-1";
  return `https://${bucket}.${region}.digitaloceanspaces.com/${key}`;
}

function sanitizeFilename(filename: string): string {
  return filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

/**
 * Returns a short-lived presigned PUT URL the admin's browser can upload an
 * image directly to (bytes never pass through the Next.js server), plus the
 * resulting public URL to store once the upload succeeds.
 */
export async function presignProductImageUpload(
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const bucket = getEnv("SPACES_BUCKET");
  const key = `products/${randomUUID()}-${sanitizeFilename(filename)}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn: 300 });
  return { uploadUrl, publicUrl: buildPublicUrl(key) };
}
