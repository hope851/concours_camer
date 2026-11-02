"use server";
import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { GetCurrentUser } from "./user";

/**
 * AJOUTER UNE TUTELLE
 */
export async function AddTutelle(formData: FormData) {
  let isSuccess = false;

  try {
    const user = await GetCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Action réservée aux administrateurs." };
    }
    const nomTutelle = formData.get("nom_tutelle") as string;
    const nomTutelleTech = formData.get("nom_tutelle_tech") as string;
    const siteTutelle = formData.get("site_tutelle") as string;
    const tutelleBio = formData.get("tutelle_bio") as string;
    const paysIdInput = formData.get("pays_id") as string;
    const regionInput = formData.get("region") as string;
    const nomPaysInput = formData.get("nom_pays") as string;

    if (!nomTutelle) {
      return { error: "Le nom de la tutelle est obligatoire." };
    }

    let paysId = paysIdInput;

    if (!paysId) {
      const targetCountryName = (nomPaysInput || regionInput || "Cameroun").trim();
      const targetRegion = (regionInput || "Afrique Centrale").trim();

      const pays = await prisma.pays.upsert({
        where: { nomPays: targetCountryName },
        create: { id: randomUUID(), nomPays: targetCountryName, region: targetRegion },
        update: {},
      });
      paysId = pays.id;
    }

    await prisma.tutelleInstitutionelle.create({
      data: {
        id: randomUUID(),
        nomTutelle: nomTutelle.trim(),
        nomTutelleTech: nomTutelleTech?.trim() || null,
        siteTutelle: siteTutelle?.trim() || null,
        tutelleBio: tutelleBio?.trim() || null,
        pays: { connect: { id: paysId } },
      },
    });

    revalidatePath("/gestionnairetutelle");
    revalidatePath("/tutelles");
    isSuccess = true;
  } catch (error) {
    console.error("Erreur création tutelle:", error);
    return { error: "Une erreur technique est survenue lors de la création." };
  }

  if (isSuccess) {
    redirect("/gestionnairetutelle");
  }
}

/**
 * MODIFIER UNE TUTELLE
 */
export async function UpdateTutelle(formData: FormData) {
  let isSuccess = false;

  try {
    const user = await GetCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Action réservée aux administrateurs." };
    }

    const id = formData.get("id") as string;
    const nomTutelle = formData.get("nom_tutelle") as string;
    const nomTutelleTech = formData.get("nom_tutelle_tech") as string;
    const siteTutelle = formData.get("site_tutelle") as string;
    const tutelleBio = formData.get("tutelle_bio") as string;
    const paysIdInput = formData.get("pays_id") as string;
    const regionInput = formData.get("region") as string;
    const nomPaysInput = formData.get("nom_pays") as string;

    if (!id || !nomTutelle) {
      return { error: "ID et Nom sont requis pour la modification." };
    }

    let paysId = paysIdInput;

    if (!paysId && (nomPaysInput || regionInput)) {
      const targetCountryName = (nomPaysInput || regionInput || "Cameroun").trim();
      const targetRegion = (regionInput || "Afrique Centrale").trim();

      const pays = await prisma.pays.upsert({
        where: { nomPays: targetCountryName },
        create: { id: randomUUID(), nomPays: targetCountryName, region: targetRegion },
        update: {},
      });
      paysId = pays.id;
    }

    await prisma.tutelleInstitutionelle.update({
      where: { id },
      data: {
        nomTutelle: nomTutelle.trim(),
        nomTutelleTech: nomTutelleTech?.trim() || null,
        siteTutelle: siteTutelle?.trim() || null,
        tutelleBio: tutelleBio?.trim() || null,
        ...(paysId ? { pays: { connect: { id: paysId } } } : {}),
      },
    });

    revalidatePath("/gestionnairetutelle");
    revalidatePath("/tutelles");
    revalidatePath(`/tutelles/${id}`);
    isSuccess = true;
  } catch (error) {
    console.error("Erreur mise à jour tutelle:", error);
    return { error: "Impossible de modifier cette tutelle." };
  }

  if (isSuccess) {
    redirect("/gestionnairetutelle");
  }
}

/**
 * SUPPRIMER UNE TUTELLE
 */
export async function DeleteTutelle(id: string) {
  try {
    const user = await GetCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Action réservée aux administrateurs." };
    }

    await prisma.tutelleInstitutionelle.delete({
      where: { id },
    });

    revalidatePath("/gestionnairetutelle");
    revalidatePath("/tutelles");

    return { success: true };
  } catch (error: any) {
    console.error("Erreur de suppression:", error);

    if (error.code === 'P2003') {
      return { error: "Suppression impossible : des établissements sont encore liés à cette tutelle." };
    }

    return { error: "Une erreur est survenue lors de la suppression." };
  }
}

/**
 * RÉCUPÉRER TOUTES LES TUTELLES (AVEC PAYS)
 */
export async function GetTutelles() {
  try {
    return await prisma.tutelleInstitutionelle.findMany({
      orderBy: { nomTutelle: 'asc' },
      include: {
        pays: true,
        _count: { select: { ees: true } },
      },
    });
  } catch (error) {
    console.error("Erreur GetTutelles:", error);
    return [];
  }
}

export async function GetTutelleById(id: string) {
  try {
    return await prisma.tutelleInstitutionelle.findUnique({
      where: { id },
      include: {
        pays: true,
        ees: { include: { ville: true, _count: { select: { programme: true, sessionAdmission: true } } } },
      },
    });
  } catch (error) {
    console.error("Erreur GetTutelleById:", error);
    return null;
  }
}
