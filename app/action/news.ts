"use server"

import prisma from "@/lib/prisma"; // Ton instance Prisma
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { join } from "path";

// 1. CRÉATION
export async function createNewsAction(formData: FormData) {
  const title = formData.get("title") as string;
  const imageFile = formData.get("image") as File;
  let imagePath = "";

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${uniqueSuffix}-${imageFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    const path = join(uploadDir, fileName);

    await writeFile(path, buffer);
    imagePath = `/uploads/${fileName}`;
  }

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
      image: imagePath || null, // Chemin local de l'image
    }
  });

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
