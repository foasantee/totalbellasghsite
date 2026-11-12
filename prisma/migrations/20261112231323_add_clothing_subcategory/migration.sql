-- CreateEnum
CREATE TYPE "ClothingSubcategory" AS ENUM ('BLOUSE', 'T_SHIRT', 'SHIRT', 'DRESS', 'TROUSERS', 'BLAZERS', 'SKIRTS', 'JUMPSUITS', 'JEANS', 'TWO_PIECE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "subcategory" "ClothingSubcategory";
