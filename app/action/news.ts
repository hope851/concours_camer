"use server"

import prisma from "@/lib/prisma"; // Ton instance Prisma
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v2 as cloudinary } from "cloudinary";


// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. CRÉATION
export async function createNewsAction(formData: FormData) {
  const title = formData.get("title") as string;
  const imageFile = formData.get("image") as File;
  let imagePath = "";

   const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    throw new Error("Fichier manquant");
  }
  // 1. Convertir le fichier en Buffer pour Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResponse: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "mes_publications" }, // Optionnel: crée un dossier
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  await prisma.news.create({
    data: {
      title,
      slug: title.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlever les accents
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-'),
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      isUrgent: formData.get("isUrgent") === "on",
      sourceName: formData.get("sourceName") as string,
      sourceUrl: formData.get("sourceUrl") as string,
      image: uploadResponse.secure_url, // L'URL magique
  }, });

  revalidatePath("/profile/gestion");
  revalidatePath("/news");
  redirect("/profile/gestion"); // Retour au dashboard après création
}

// 2. MODIFICATION
export async function updateNewsAction(id: string, formData: FormData) {
  await prisma.news.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      isUrgent: formData.get("isUrgent") === "on",
    },
  });

  revalidatePath("/news");
  revalidatePath(`/news/${id}`);
}

// 3. SUPPRESSION
export async function deleteNewsAction(id: string) {
  await prisma.news.delete({
    where: { id },
  });

  revalidatePath("/news");
}

export async function getNewsAction() {
  return await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getNewsBySlugAction(slug: string) {
  return await prisma.news.findUnique({
    where: { slug }
  });
}
