/*
  Warnings:

  - You are about to drop the column `price` on the `Hotel` table. All the data in the column will be lost.
  - Added the required column `description` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "airConditioning" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "balcony" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cityView" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "minibar" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "oceanView" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomService" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "safe" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tv" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "wifi" BOOLEAN NOT NULL DEFAULT true;
