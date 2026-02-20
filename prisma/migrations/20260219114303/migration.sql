/*
  Warnings:

  - You are about to drop the column `concours_id` on the `concours` table. All the data in the column will be lost.
  - Added the required column `ees_id` to the `concours` table without a default value. This is not possible if the table is not empty.
  - Made the column `diplome_requis` on table `concours` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "concours" DROP COLUMN "concours_id",
ADD COLUMN     "ees_id" TEXT NOT NULL,
ALTER COLUMN "diplome_requis" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "concours" ADD CONSTRAINT "concours_ees_id_fkey" FOREIGN KEY ("ees_id") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
