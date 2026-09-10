import { PrismaClient, type Category } from "@prisma/client";
import { clothingSeed } from "./seed-data/clothing";
import { shoesSeed } from "./seed-data/shoes";
import { bagsSeed } from "./seed-data/bags";
import { fragranceSeed } from "./seed-data/fragrance";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SeedItem = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  badge: string | null;
  images: string[];
};

async function seedCategory(category: Category, items: SeedItem[]) {
  for (const item of items) {
    const slug = slugify(item.name);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: item.name,
        slug,
        description: item.description,
        price: item.price,
        category,
        quantity: item.quantity,
        badge: item.badge,
        images: { create: item.images.map((url, position) => ({ url, position })) },
      },
    });
  }
}

async function main() {
  await seedCategory("CLOTHING", clothingSeed);
  await seedCategory("SHOES", shoesSeed);
  await seedCategory("BAGS", bagsSeed);
  await seedCategory("FRAGRANCE", fragranceSeed);

  const count = await prisma.product.count();
  console.log(`Seed complete. ${count} products in database.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
