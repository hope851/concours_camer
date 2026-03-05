/*
  Warnings:

  - You are about to drop the `EES` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EES" DROP CONSTRAINT "EES_tutelle_id_fkey";

-- DropForeignKey
ALTER TABLE "concours" DROP CONSTRAINT "concours_ees_id_fkey";

-- DropForeignKey
ALTER TABLE "filiere" DROP CONSTRAINT "filiere_ees_id_fkey";

-- AlterTable
ALTER TABLE "concours" ADD COLUMN     "adress_exam" TEXT;

-- DropTable
DROP TABLE "EES";

-- CreateTable
CREATE TABLE "ees" (
    "id" TEXT NOT NULL,
    "nom_ees" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "ees_bio" TEXT,
    "ville" TEXT NOT NULL,
    "site_ees" TEXT,
    "ees_type" TEXT NOT NULL,
    "tutelle_id" TEXT NOT NULL,

    CONSTRAINT "ees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ees" ADD CONSTRAINT "ees_tutelle_id_fkey" FOREIGN KEY ("tutelle_id") REFERENCES "tutelle_institutionelle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiere" ADD CONSTRAINT "filiere_ees_id_fkey" FOREIGN KEY ("ees_id") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concours" ADD CONSTRAINT "concours_ees_id_fkey" FOREIGN KEY ("ees_id") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
