/**
 * One-off, manual dev-time tool — NOT part of the deployed app.
 *
 * Uploads the original local product photos (kept in "Website Images/") to
 * DigitalOcean Spaces and prints a filename -> public URL map. Requires
 * SPACES_* env vars to be set (see .env.example).
 *
 * Usage: npm run db:migrate-images
 *
 * After running, paste the printed URLs into prisma/seed-data/*.ts in place
 * of the local /products/... paths, then re-run `npm run db:seed` (or
 * update existing products' images via the admin panel instead — that's
 * often simpler for a small catalog).
 */
import { readdirSync } from "fs";
import { join } from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";

const SKIP_FILES = new Set([
  "d1739f4b-7214-4013-84ee-3328de1c8c85 (1).jpeg", // confirmed duplicate
  "044923f0-dec7-42fb-a3b7-055db0fa453b.jpeg", // unused Zara-branded perfume photo
  "c9d1de84-c9a7-4535-8236-405f6afa84c6.jpeg", // unused Zara-branded perfume photo
  "248694e7-7781-46ef-a55f-6269dc6a4e70.jpeg", // unused Zara-branded perfume photo
]);

const SOURCE_DIRS = [
  "Website Images/Pictures for website",
  "Website Images/Bags",
];

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is not set.`);
  return value;
}

async function main() {
  const bucket = getEnv("SPACES_BUCKET");
  const region = process.env.SPACES_REGION || "us-east-1";
  const client = new S3Client({
    endpoint: getEnv("SPACES_ENDPOINT"),
    region,
    credentials: {
      accessKeyId: getEnv("SPACES_KEY"),
      secretAccessKey: getEnv("SPACES_SECRET"),
    },
  });

  const urlMap: Record<string, string> = {};

  for (const dir of SOURCE_DIRS) {
    const fullDir = join(process.cwd(), dir);
    const files = readdirSync(fullDir).filter((f) => !SKIP_FILES.has(f));

    for (const file of files) {
      const key = `products/seed/${file}`;
      const body = await readFile(join(fullDir, file));
      const contentType = file.endsWith(".png") ? "image/png" : "image/jpeg";

      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          ACL: "public-read",
        })
      );

      const publicUrl = process.env.SPACES_CDN_URL
        ? `${process.env.SPACES_CDN_URL.replace(/\/$/, "")}/${key}`
        : `https://${bucket}.${region}.digitaloceanspaces.com/${key}`;

      urlMap[file] = publicUrl;
      console.log(`Uploaded ${file} -> ${publicUrl}`);
    }
  }

  console.log("\nFull filename -> URL map:\n");
  console.log(JSON.stringify(urlMap, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
