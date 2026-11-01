"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const newsInclude = {
  ees: { select: { id: true, nomEes: true } },
  tutelle: { select: { id: true, nomTutelle: true } },
  programme: { select: { id: true, nomProgramme: true, niveau: true } },
} as const;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
}

function parseOptionalId(value: FormDataEntryValue | null) {
  const id = value as string;
  return id && id !== "none" ? id : undefined;
}

export async function createNewsAction(formData: FormData) {
  const title = formData.get("title") as string;
  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    throw new Error("Fichier manquant");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResponse: { secure_url: string } = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "mes_publications" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as { secure_url: string });
      }
    );
    uploadStream.end(buffer);
  });

  const slug = slugify(title);

  await prisma.news.create({
    data: {
      id: randomUUID(),
      title,
      slug,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      isUrgent: formData.get("isUrgent") === "on",
      sourceName: (formData.get("sourceName") as string) || null,
      sourceUrl: (formData.get("sourceUrl") as string) || null,
      image: uploadResponse.secure_url,
      eesId: parseOptionalId(formData.get("eesId")),
      tutelleId: parseOptionalId(formData.get("tutelleId")),
      programmeId: parseOptionalId(formData.get("programmeId")),
    },
  });

  revalidatePath("/profile/gestion");
  revalidatePath("/news");
  redirect("/profile/gestion");
}

export async function updateNewsAction(id: string, formData: FormData) {
  await prisma.news.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      isUrgent: formData.get("isUrgent") === "on",
      eesId: parseOptionalId(formData.get("eesId")) ?? null,
      tutelleId: parseOptionalId(formData.get("tutelleId")) ?? null,
      programmeId: parseOptionalId(formData.get("programmeId")) ?? null,
    },
  });

  revalidatePath("/news");
  revalidatePath(`/news/${id}`);
  redirect("/profile/gestion");
}

export async function deleteNewsAction(id: string) {
  await prisma.news.delete({ where: { id } });
  revalidatePath("/news");
}

export async function getNewsAction() {
  try {
    return await prisma.news.findMany({
      orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
      include: newsInclude,
    });
  } catch (error) {
    console.error("getNewsAction:", error);
    return [];
  }
}

export async function getNewsBySlugAction(slug: string) {
  return await prisma.news.findUnique({
    where: { slug },
    include: newsInclude,
  });
}

export async function getNewsFormOptions() {
  try {
    const [eesList, tutelles, programmes] = await Promise.all([
      prisma.ees.findMany({
        select: { id: true, nomEes: true },
        orderBy: { nomEes: "asc" },
      }),
      prisma.tutelleInstitutionelle.findMany({
        select: { id: true, nomTutelle: true },
        orderBy: { nomTutelle: "asc" },
      }),
      prisma.programme.findMany({
        select: { id: true, nomProgramme: true, niveau: true, ees: { select: { nomEes: true } } },
        orderBy: { nomProgramme: "asc" },
      }),
    ]);

    return { eesList, tutelles, programmes };
  } catch (error) {
    console.error("getNewsFormOptions:", error);
    return { eesList: [], tutelles: [], programmes: [] };
  }
}
