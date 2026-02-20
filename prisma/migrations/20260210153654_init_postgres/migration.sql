-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GESTIONAIRE', 'USER');

-- CreateTable
CREATE TABLE "tutelle_institutionelle" (
    "id" TEXT NOT NULL,
    "nom_tutelle" TEXT NOT NULL,
    "nom_tutelle_tech" TEXT,
    "region" TEXT NOT NULL,
    "tutelle_bio" TEXT,

    CONSTRAINT "tutelle_institutionelle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ees" (
    "id" TEXT NOT NULL,
    "nom_ees" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "ees_bio" TEXT,
    "ville" TEXT NOT NULL,
    "site_ees" TEXT,
    "tutelle_id" TEXT NOT NULL,

    CONSTRAINT "ees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ear" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filiere" (
    "id" TEXT NOT NULL,
    "nom_filiere" TEXT NOT NULL,
    "mention" TEXT,
    "ees_id" TEXT NOT NULL,

    CONSTRAINT "filiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concours" (
    "id" TEXT NOT NULL,
    "nom_concours" TEXT NOT NULL,
    "etat" BOOLEAN NOT NULL DEFAULT false,
    "concours_bio" TEXT,
    "date_ouverture" TIMESTAMP(3) NOT NULL,
    "limite_depot" TIMESTAMP(3) NOT NULL,
    "date_exam" TIMESTAMP(3) NOT NULL,
    "diplome_requis" TEXT,
    "concours_id" TEXT NOT NULL,

    CONSTRAINT "concours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "ees" ADD CONSTRAINT "ees_tutelle_id_fkey" FOREIGN KEY ("tutelle_id") REFERENCES "tutelle_institutionelle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ear" ADD CONSTRAINT "ear_id_fkey" FOREIGN KEY ("id") REFERENCES "ees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiere" ADD CONSTRAINT "filiere_ees_id_fkey" FOREIGN KEY ("ees_id") REFERENCES "ees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concours" ADD CONSTRAINT "concours_concours_id_fkey" FOREIGN KEY ("concours_id") REFERENCES "ear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
