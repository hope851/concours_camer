"use server"

import prisma from "@/lib/prisma"; // Ton instance Prisma
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. CRÉATION
export async function createNewsAction(formData: FormData) {
  const title = formData.get("title") as string;

  await prisma.news.create({
    data: {
      title,
      slug: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      isUrgent: formData.get("isUrgent") === "on",
      sourceName: formData.get("sourceName") as string,
      sourceUrl: formData.get("sourceUrl") as string,
      image: formData.get("image") as string, // URL de l'image
    }
  });

  revalidatePath("/profile/gestion");
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
