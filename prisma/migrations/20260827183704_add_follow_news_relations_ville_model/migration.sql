/*
  Warnings:

  - You are about to drop the column `ees_bio` on the `ees` table. All the data in the column will be lost.
  - You are about to drop the column `ees_type` on the `ees` table. All the data in the column will be lost.
  - You are about to drop the column `nom_ees` on the `ees` table. All the data in the column will be lost.
  - You are about to drop the column `site_ees` on the `ees` table. All the data in the column will be lost.
  - You are about to drop the column `tutelle_id` on the `ees` table. All the data in the column will be lost.
  - You are about to drop the column `ville` on the `ees` table. All the data in the column will be lost.
  - You are about to drop the column `date_inscription` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ees_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `concours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filiere` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `news` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tutelle_institutionelle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eesType` to the `ees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomEes` to the `ees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutelleId` to the `ees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villeId` to the `ees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "concours" DROP CONSTRAINT "concours_ees_id_fkey";

-- DropForeignKey
ALTER TABLE "ees" DROP CONSTRAINT "ees_tutelle_id_fkey";

-- DropForeignKey
ALTER TABLE "filiere" DROP CONSTRAINT "filiere_ees_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_ees_id_fkey";

-- AlterTable
ALTER TABLE "ees" DROP COLUMN "ees_bio",
DROP COLUMN "ees_type",
DROP COLUMN "nom_ees",
DROP COLUMN "site_ees",
DROP COLUMN "tutelle_id",
DROP COLUMN "ville",
ADD COLUMN     "eesBio" TEXT,
ADD COLUMN     "eesType" TEXT NOT NULL,
ADD COLUMN     "nomEes" TEXT NOT NULL,
ADD COLUMN     "posGeoLatitude" DOUBLE PRECISION,
ADD COLUMN     "posGeoLongitude" DOUBLE PRECISION,
ADD COLUMN     "siteEes" TEXT,
ADD COLUMN     "tutelleId" TEXT NOT NULL,
ADD COLUMN     "villeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "date_inscription",
DROP COLUMN "ees_id",
DROP COLUMN "is_active",
ADD COLUMN     "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "concours";

-- DropTable
DROP TABLE "filiere";

-- DropTable
DROP TABLE "news";

-- DropTable
DROP TABLE "tutelle_institutionelle";

-- CreateTable
CREATE TABLE "FollowEes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "eesId" TEXT NOT NULL,

    CONSTRAINT "FollowEes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowTutelle" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "tutelleId" TEXT NOT NULL,

    CONSTRAINT "FollowTutelle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowProgramme" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,

    CONSTRAINT "FollowProgramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "eesId" TEXT,
    "tutelleId" TEXT,
    "programmeId" TEXT,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pays" (
    "id" TEXT NOT NULL,
    "nomPays" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "Pays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "nomProgramme" TEXT NOT NULL,
    "specialite" TEXT,
    "niveau" TEXT NOT NULL,
    "eesId" TEXT NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessionAdmission" (
    "id" TEXT NOT NULL,
    "nomConcours" TEXT NOT NULL,
    "etat" BOOLEAN NOT NULL DEFAULT false,
    "concoursBio" TEXT,
    "dateOuverture" TIMESTAMP(3) NOT NULL,
    "limiteDepot" TIMESTAMP(3) NOT NULL,
    "dateExam" TIMESTAMP(3) NOT NULL,
    "diplomeRequis" TEXT NOT NULL,
    "adressExam" TEXT,
    "eesId" TEXT NOT NULL,
    "programmeId" TEXT,

    CONSTRAINT "sessionAdmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutelleInstitutionelle" (
    "id" TEXT NOT NULL,
    "nomTutelle" TEXT NOT NULL,
    "nomTutelleTech" TEXT,
    "tutelleBio" TEXT,
    "siteTutelle" TEXT,
    "paysId" TEXT NOT NULL,

    CONSTRAINT "tutelleInstitutionelle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ville" (
    "id" TEXT NOT NULL,
    "nomVille" TEXT NOT NULL,
    "paysId" TEXT NOT NULL,

    CONSTRAINT "ville_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EESToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EESToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "FollowEes_userId_eesId_key" ON "FollowEes"("userId", "eesId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowTutelle_userId_tutelleId_key" ON "FollowTutelle"("userId", "tutelleId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowProgramme_userId_programmeId_key" ON "FollowProgramme"("userId", "programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pays_nomPays_key" ON "Pays"("nomPays");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_nomProgramme_specialite_niveau_eesId_key" ON "Programme"("nomProgramme", "specialite", "niveau", "eesId");

-- CreateIndex
CREATE UNIQUE INDEX "sessionAdmission_programmeId_key" ON "sessionAdmission"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "sessionAdmission_nomConcours_eesId_programmeId_key" ON "sessionAdmission"("nomConcours", "eesId", "programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "ville_nomVille_paysId_key" ON "ville"("nomVille", "paysId");

-- CreateIndex
CREATE INDEX "_EESToUsers_B_index" ON "_EESToUsers"("B");

-- AddForeignKey
ALTER TABLE "ees" ADD CONSTRAINT "ees_tutelleId_fkey" FOREIGN KEY ("tutelleId") REFERENCES "tutelleInstitutionelle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ees" ADD CONSTRAINT "ees_villeId_fkey" FOREIGN KEY ("villeId") REFERENCES "ville"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowEes" ADD CONSTRAINT "FollowEes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowEes" ADD CONSTRAINT "FollowEes_eesId_fkey" FOREIGN KEY ("eesId") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowTutelle" ADD CONSTRAINT "FollowTutelle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowTutelle" ADD CONSTRAINT "FollowTutelle_tutelleId_fkey" FOREIGN KEY ("tutelleId") REFERENCES "tutelleInstitutionelle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowProgramme" ADD CONSTRAINT "FollowProgramme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowProgramme" ADD CONSTRAINT "FollowProgramme_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_eesId_fkey" FOREIGN KEY ("eesId") REFERENCES "ees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_tutelleId_fkey" FOREIGN KEY ("tutelleId") REFERENCES "tutelleInstitutionelle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_eesId_fkey" FOREIGN KEY ("eesId") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessionAdmission" ADD CONSTRAINT "sessionAdmission_eesId_fkey" FOREIGN KEY ("eesId") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessionAdmission" ADD CONSTRAINT "sessionAdmission_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutelleInstitutionelle" ADD CONSTRAINT "tutelleInstitutionelle_paysId_fkey" FOREIGN KEY ("paysId") REFERENCES "Pays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ville" ADD CONSTRAINT "ville_paysId_fkey" FOREIGN KEY ("paysId") REFERENCES "Pays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EESToUsers" ADD CONSTRAINT "_EESToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EESToUsers" ADD CONSTRAINT "_EESToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
