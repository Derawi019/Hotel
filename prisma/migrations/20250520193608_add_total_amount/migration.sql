/*
  Warnings:

  - Added the required column `totalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Remove the default value after adding the column
ALTER TABLE "Booking" ALTER COLUMN "totalAmount" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_hotelId_idx" ON "Booking"("hotelId");
