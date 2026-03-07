"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GetCurrentUser } from "./user";

/**
 * AJOUTER UNE EES
 */
export async function AddEes(formData: FormData) {
  let targetId = "";
  let nomTutelle = "";

  try {
    const user = await GetCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Seuls les administrateurs peuvent créer un établissement." };
    }

    const nom_ees = formData.get("nom_ees") as string;
    const ees_bio = (formData.get("ees_bio") as string) || "";
    const ville = formData.get("ville") as string;
    const site_ees = (formData.get("site_ees") as string) || "";
    const domaine = formData.get("domaine") as string;
    const ees_type = formData.get("ees_type") as string;
    const tutelle_id = formData.get("tutelle_id") as string; // Unified naming

    const filieresRaw = formData.get("filieres") as string;
    const filieresArray = filieresRaw
      ? filieresRaw.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

    if (!nom_ees || !ville || !domaine || !ees_type || !tutelle_id) {
      return { error: "Champs obligatoires manquants." };
    }

    targetId = tutelle_id;

    await prisma.$transaction(async (tx) => {
      await tx.eES.create({
        data: {
          nom_ees,
          ees_bio,
          ville,
          site_ees,
          domaine,
          ees_type: ees_type as any,
          tutelle: { connect: { id: tutelle_id } },
          filieres: {
            create: filieresArray.map((nom) => ({ nom_filiere: nom })),
          },
        },
      });
    });

    const tutelle = await prisma.tutelleInstitutionelle.findUnique({
      where: { id: targetId },
      select: { nom_tutelle: true },
    });
    nomTutelle = tutelle?.nom_tutelle || "Tutelle";

    revalidatePath(`/gestionnaireees/${targetId}`);
  } catch (error: any) {
    if (error.code === "P2002") return { error: "Une filière avec ce nom existe déjà." };
    console.error(error);
    return { error: `Erreur serveur: ${error.message}` };
  }

  // Redirection hors du try/catch
  redirect(`/gestionnaireees/${targetId}?nom_tutelle=${encodeURIComponent(nomTutelle)}`);
}

/**
 * MODIFIER UNE EES
 */
export async function UpdateEes(formData: FormData) {
  let targetId = "";
  let nomTutelle = "";

  try {
    const id = formData.get("id") as string;
    const nom_ees = formData.get("nom_ees") as string;
    const ees_bio = (formData.get("ees_bio") as string) || "";
    const ville = formData.get("ville") as string;
    const site_ees = (formData.get("site_ees") as string) || "";
    const domaine = formData.get("domaine") as string;
    const ees_type = formData.get("ees_type") as string;
    const tutelleId = formData.get("tutelle_id") as string;

    if (!id || !nom_ees || !tutelleId) return { error: "Données manquantes." };

    targetId = tutelleId;

    const filieresRaw = formData.get("filieres") as string;
    const filieresArray = filieresRaw
      ? filieresRaw.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

    await prisma.$transaction(async (tx) => {
      await tx.eES.update({
        where: { id },
        data: {
          nom_ees,
          ees_bio,
          ville,
          site_ees,
          domaine,
          ees_type: ees_type as any,
          filieres: {
            deleteMany: {},
            create: filieresArray.map((nom) => ({ nom_filiere: nom })),
          },
        },
      });
    });

    const tutelle = await prisma.tutelleInstitutionelle.findUnique({
      where: { id: targetId },
      select: { nom_tutelle: true },
    });
    nomTutelle = tutelle?.nom_tutelle || "Tutelle";

    revalidatePath(`/gestionnaireees/${targetId}`);
  } catch (error: any) {
    console.error(error);
    return { error: "Erreur lors de la mise à jour." };
  }

  redirect(`/gestionnaireees/${targetId}?nom_tutelle=${encodeURIComponent(nomTutelle)}`);
}

/**
 * SUPPRIMER UNE EES
 */
export async function DeleteEes(id: string, tutelle_id: string) {
  let nomTutelle = "";
  try {
    // 1. Récupérer le nom de la tutelle AVANT la suppression pour la redirection
    const tutelle = await prisma.tutelleInstitutionelle.findUnique({
      where: { id: tutelle_id },
      select: { nom_tutelle: true }
    });
    nomTutelle = tutelle?.nom_tutelle || "Tutelle";

    // 2. Suppression
    await prisma.eES.delete({
      where: { id },
    });

    revalidatePath(`/gestionnaireees/${tutelle_id}`);
  } catch (error: any) {
    console.error("Erreur de suppression:", error);
    return { error: "Impossible de supprimer cet établissement." };
  }

  // 3. Redirection
  redirect(`/gestionnaireees/${tutelle_id}?nom_tutelle=${encodeURIComponent(nomTutelle)}`);
}
