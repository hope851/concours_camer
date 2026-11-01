/*
  Warnings:

  - A unique constraint covering the columns `[contenthash]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contenthash` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN     "contenthash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "News_contenthash_key" ON "News"("contenthash");
