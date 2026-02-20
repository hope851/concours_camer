/*
  Warnings:

  - You are about to drop the `ear` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ees_type` to the `ees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "concours" DROP CONSTRAINT "concours_concours_id_fkey";

-- DropForeignKey
ALTER TABLE "ear" DROP CONSTRAINT "ear_id_fkey";

-- AlterTable
ALTER TABLE "ees" ADD COLUMN     "ees_type" TEXT NOT NULL;

-- DropTable
DROP TABLE "ear";
