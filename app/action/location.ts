"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function GetPays() {
  try {
    return await prisma.pays.findMany({
      orderBy: { nomPays: "asc" },
      include: {
        _count: { select: { tutelleInstitutionelle: true, ville: true } },
      },
    });
  } catch (error) {
    console.error("Erreur GetPays:", error);
    return [];
  }
}

export async function GetPaysById(id: string) {
  try {
    return await prisma.pays.findUnique({
      where: { id },
      include: {
        ville: true,
        tutelleInstitutionelle: true,
      },
    });
  } catch (error) {
    console.error("Erreur GetPaysById:", error);
    return null;
  }
}

export async function AddPays(formData: FormData) {
  try {
    const nomPays = (formData.get("nom_pays") as string)?.trim();
    const region = (formData.get("region") as string)?.trim();

    if (!nomPays) return { error: "Le nom du pays est obligatoire." };

    const pays = await prisma.pays.upsert({
      where: { nomPays },
      create: {
        id: randomUUID(),
        nomPays,
        region: region || "Non spécifiée",
      },
      update: {
        region: region || undefined,
      },
    });

    revalidatePath("/profile/admin");
    // revalidatePath("/formpays");
    return { success: true, pays };
  } catch (error: any) {
    console.error("Erreur AddPays:", error);
    return { error: "Impossible de créer ce pays." };
  }
}

export async function UpdatePays(formData: FormData) {
  try {
    const id = (formData.get("id") as string)?.trim();
    const nomPays = (formData.get("nom_pays") as string)?.trim();
    const region = (formData.get("region") as string)?.trim();

    if (!id || !nomPays) return { error: "Le pays et son nom sont requis." };

    const pays = await prisma.pays.update({
      where: { id },
      data: {
        nomPays,
        region: region || "Non spécifiée",
      },
    });

    revalidatePath("/profile/admin");
    // revalidatePath("/formpays");
    return { success: true, pays };
  } catch (error: any) {
    console.error("Erreur UpdatePays:", error);
    return { error: "Impossible de modifier ce pays." };
  }
}

export async function DeletePays(id: string) {
  try {
    await prisma.pays.delete({ where: { id } });
    revalidatePath("/profile/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Erreur DeletePays:", error);
    return { error: "Suppression impossible : ce pays est encore lié à des villes ou tutelles." };
  }
}

export async function GetVilles(paysId?: string) {
  try {
    return await prisma.ville.findMany({
      where: paysId ? { paysId } : undefined,
      orderBy: { nomVille: "asc" },
      include: {
        pays: true,
        _count: { select: { ees: true } },
      },
    });
  } catch (error) {
    console.error("Erreur GetVilles:", error);
    return [];
  }
}

export async function GetVilleById(id: string) {
  try {
    return await prisma.ville.findUnique({
      where: { id },
      include: { pays: true, ees: true },
    });
  } catch (error) {
    console.error("Erreur GetVilleById:", error);
    return null;
  }
}

export async function AddVille(formData: FormData) {
  try {
    const nomVille = (formData.get("nom_ville") as string)?.trim();
    const paysId = (formData.get("pays_id") as string)?.trim();

    if (!nomVille || !paysId) {
      return { error: "Nom de ville et pays obligatoires." };
    }

    const ville = await prisma.ville.upsert({
      where: {
        nomVille_paysId: {
          nomVille,
          paysId,
        },
      },
      create: {
        id: randomUUID(),
        nomVille,
        paysId,
      },
      update: {},
    });

    revalidatePath("/profile/admin");
    // revalidatePath("/formville");
    return { success: true, ville };
  } catch (error: any) {
    console.error("Erreur AddVille:", error);
    return { error: "Impossible de créer cette ville." };
  }
}

export async function UpdateVille(formData: FormData) {
  try {
    const id = (formData.get("id") as string)?.trim();
    const nomVille = (formData.get("nom_ville") as string)?.trim();
    const paysId = (formData.get("pays_id") as string)?.trim();

    if (!id || !nomVille || !paysId) {
      return { error: "Ville, pays et identifiant sont requis." };
    }

    const ville = await prisma.ville.update({
      where: { id },
      data: {
        nomVille,
        paysId,
      },
    });

    revalidatePath("/profile/admin");
    // revalidatePath("/formville");
    return { success: true, ville };
  } catch (error: any) {
    console.error("Erreur UpdateVille:", error);
    return { error: "Impossible de modifier cette ville." };
  }
}

export async function DeleteVille(id: string) {
  try {
    await prisma.ville.delete({ where: { id } });
    revalidatePath("/profile/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Erreur DeleteVille:", error);
    return { error: "Suppression impossible : cette ville est encore rattachée à des établissements." };
  }
}

export async function GetProgrammes(eesId?: string) {
  try {
    return await prisma.programme.findMany({
      where: eesId ? { eesId } : undefined,
      orderBy: { nomProgramme: "asc" },
      include: {
        ees: {
          select: {
            id: true,
            nomEes: true,
            tutelleInstitutionelle: { select: { id: true, nomTutelle: true } },
          },
        },
        _count: { select: { news: true, followProgramme: true } },
      },
    });
  } catch (error) {
    console.error("Erreur GetProgrammes:", error);
    return [];
  }
}

export async function GetProgrammeById(id: string) {
  try {
    return await prisma.programme.findUnique({
      where: { id },
      include: { ees: true, news: true, sessionAdmission: true },
    });
  } catch (error) {
    console.error("Erreur GetProgrammeById:", error);
    return null;
  }
}

export async function AddProgramme(formData: FormData) {
  try {
    const eesId = (formData.get("ees_id") as string)?.trim();
    const nomProgramme = (formData.get("nom_programme") as string)?.trim();
    const specialite = (formData.get("specialite") as string)?.trim() || null;
    const niveau = (formData.get("niveau") as string)?.trim() || "Licence";

    if (!eesId || !nomProgramme) {
      return { error: "L'établissement et le nom du programme sont obligatoires." };
    }

    const programme = await prisma.programme.create({
      data: {
        id: randomUUID(),
        nomProgramme,
        specialite,
        niveau,
        eesId,
      },
    });

    revalidatePath("/profile/admin");
    revalidatePath("/formprogramme");
    return { success: true, programme };
  } catch (error: any) {
    console.error("Erreur AddProgramme:", error);
    return { error: "Impossible de créer ce programme." };
  }
}

export async function UpdateProgramme(formData: FormData) {
  try {
    const id = (formData.get("id") as string)?.trim();
    const eesId = (formData.get("ees_id") as string)?.trim();
    const nomProgramme = (formData.get("nom_programme") as string)?.trim();
    const specialite = (formData.get("specialite") as string)?.trim() || null;
    const niveau = (formData.get("niveau") as string)?.trim() || "Licence";

    if (!id || !eesId || !nomProgramme) {
      return { error: "Identifiant, établissement et nom du programme sont requis." };
    }

    const programme = await prisma.programme.update({
      where: { id },
      data: {
        nomProgramme,
        specialite,
        niveau,
        eesId,
      },
    });

    revalidatePath("/profile/admin");
    revalidatePath("/formprogramme");
    return { success: true, programme };
  } catch (error: any) {
    console.error("Erreur UpdateProgramme:", error);
    return { error: "Impossible de modifier ce programme." };
  }
}

export async function DeleteProgramme(id: string) {
  try {
    await prisma.programme.delete({ where: { id } });
    revalidatePath("/profile/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Erreur DeleteProgramme:", error);
    return { error: "Suppression impossible : ce programme est encore lié à des concours ou abonnements." };
  }
}

