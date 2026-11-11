-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Size" ADD VALUE 'SHOE_4_37';
ALTER TYPE "Size" ADD VALUE 'SHOE_5_38';
ALTER TYPE "Size" ADD VALUE 'SHOE_6_39';
ALTER TYPE "Size" ADD VALUE 'SHOE_7_40';
ALTER TYPE "Size" ADD VALUE 'SHOE_8_41';
ALTER TYPE "Size" ADD VALUE 'SHOE_9_42';
ALTER TYPE "Size" ADD VALUE 'SHOE_10_43';
ALTER TYPE "Size" ADD VALUE 'SHOE_11_44';
