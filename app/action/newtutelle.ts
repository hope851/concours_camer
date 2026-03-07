"use server";
import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * AJOUTER UNE TUTELLE
 */
export async function AddTutelle(formData: FormData) {
  let isSuccess = false;

  try {
    const nom_tutelle = formData.get("nom_tutelle") as string;
    const nom_tutelle_tech = formData.get("nom_tutelle_tech") as string;
    const region = formData.get("region") as string;
    const tutelle_bio = formData.get("tutelle_bio") as string;

    if (!nom_tutelle || !region) {
      return { error: "Le nom et la région sont obligatoires." };
    }

    

    await prisma.tutelleInstitutionelle.create({
      data: {
        nom_tutelle,
        nom_tutelle_tech,
        region,
        tutelle_bio,
      },
    });

    revalidatePath("/gestionnairetutelle");
    isSuccess = true;
  } catch (error) {
    console.error("Erreur création tutelle:", error);
    return { error: "Une erreur technique est survenue lors de la création." };
  }

  // Toujours rediriger HORS du try/catch
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
    const id = formData.get("id") as string;
    const nom_tutelle = formData.get("nom_tutelle") as string;
    const nom_tutelle_tech = formData.get("nom_tutelle_tech") as string;
    const region = formData.get("region") as string;
    const tutelle_bio = formData.get("tutelle_bio") as string;

    if (!id || !nom_tutelle || !region) {
      return { error: "ID, Nom et Région sont requis pour la modification." };
    }

    await prisma.tutelleInstitutionelle.update({
      where: { id },
      data: {
        nom_tutelle,
        nom_tutelle_tech,
        region,
        tutelle_bio,
      },
    });

    revalidatePath("/gestionnairetutelle");
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
    // Vérifier si la tutelle existe avant de supprimer
    await prisma.tutelleInstitutionelle.delete({
      where: { id },
    });

    // Revalider le chemin pour mettre à jour la liste côté client
    revalidatePath("/gestionnairetutelle");

    return { success: true };
  } catch (error: any) {
    console.error("Erreur de suppression:", error);

    // Gestion d'erreur si des EES sont encore liées (si onDelete: Cascade n'est pas mis)
    if (error.code === 'P2003') {
      return { error: "Suppression impossible : des établissements sont encore liés à cette tutelle." };
    }

    return { error: "Une erreur est survenue lors de la suppression." };
  }
}

/**
 * RÉCUPÉRER TOUTES LES TUTELLES
 */
export async function GetTutelles() {
  try {
    return await prisma.tutelleInstitutionelle.findMany({
      orderBy: { nom_tutelle: 'asc' },
    });
  } catch (error) {
    console.error("Erreur GetTutelles:", error);
    return [];
  }
}
