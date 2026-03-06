"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * AJOUTER UN CONCOURS
 */
export async function AddConcours(formData: FormData) {
  let isSuccess = false;
  let targetID = "";

  try {
    const nom_concours = formData.get("nom_concours") as string;
    const etat = formData.get("etat") === "on";
    const concours_bio = formData.get("concours_bio") as string;
    const adress_exam = formData.get("adress_exam") as string;
    const date_ouverture = new Date(formData.get("date_ouverture") as string);
    const limite_depot = new Date(formData.get("limite_depot") as string);
    const date_exam = new Date(formData.get("date_exam") as string);
    const diplome_requis = formData.get("diplome_requis") as string;
    const ees_id = formData.get("ees_id") as string;

    targetID = ees_id;

    if (isNaN(date_ouverture.getTime()) || isNaN(limite_depot.getTime()) || isNaN(date_exam.getTime())) {
      return { error: "Format de date invalide." };
    }

    if (!nom_concours || !diplome_requis || !ees_id) {
      return { error: "Veuillez remplir tous les champs obligatoires." };
    }

    if (limite_depot > date_exam) {
      return { error: "La date limite de dépôt doit être avant la date de l'examen veuillez verifier les informations entrer" };
    }
    if (date_ouverture > limite_depot) {
      return { error: "La date d'ouverture doit être avant la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (date_exam < limite_depot) {
      return { error: "La date de l'examen doit être après la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (date_exam < date_ouverture) {
      return { error: "La date de l'examen doit être après la date d'ouverture veuillez verifier les informations entrer" };
    }

    await prisma.concours.create({
      data: {
        nom_concours,
        etat,
        concours_bio,
        date_ouverture,
        date_exam,
        limite_depot,
        diplome_requis,
        adress_exam,
        ees: { connect: { id: ees_id } }
      }
    });

    revalidatePath(`/gestionnaireconcours/${ees_id}`);
    isSuccess = true;
  } catch (error: any) {
    console.error("Erreur AddConcours:", error);
    return { error: "Une erreur technique est survenue." };
  }

  if (isSuccess) {
    const ees = await prisma.eES.findUnique({
      where: { id: targetID },
      select: { nom_ees: true, tutelle_id: true }
    });
    redirect(`/gestionnaireconcours/${targetID}?nom_ees=${encodeURIComponent(ees?.nom_ees || "")}&tutelle_id=${ees?.tutelle_id}`);
  }
}

/**
 * MODIFIER UN CONCOURS
 */
export async function UpdateConcours(formData: FormData) {
  let isSuccess = false;
  let targetID = "";

  try {
    const id = formData.get("id") as string;
    const nom_concours = formData.get("nom_concours") as string;
    const etat = formData.get("etat") === "on" || formData.get("etat") === "true";
    const concours_bio = formData.get("concours_bio") as string;
    const adress_exam = formData.get("adress_exam") as string;
    const date_ouverture = new Date(formData.get("date_ouverture") as string);
    const limite_depot = new Date(formData.get("limite_depot") as string);
    const date_exam = new Date(formData.get("date_exam") as string);
    const diplome_requis = formData.get("diplome_requis") as string;
    const ees_id = formData.get("ees_id") as string;

    targetID = ees_id;


    if (limite_depot > date_exam) {
      return { error: "La date limite de dépôt doit être avant la date de l'examen veuillez verifier les informations entrer " };
    }
    if (date_ouverture > limite_depot) {
      return { error: "La date d'ouverture doit être avant la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (date_exam < limite_depot) {
      return { error: "La date de l'examen doit être après la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (date_exam < date_ouverture) {
      return { error: "La date de l'examen doit être après la date d'ouverture veuillez verifier les informations entrer" };
    }

    await prisma.concours.update({
      where: { id },
      data: {
        nom_concours,
        etat,
        concours_bio,
        date_ouverture,
        date_exam,
        limite_depot,
        diplome_requis,
        adress_exam,
      }
    });

    revalidatePath(`/gestionnaireconcours/${ees_id}`);
    isSuccess = true;
  } catch (error: any) {
    console.error("Erreur UpdateConcours:", error);
    return { error: "Erreur lors de la mise à jour." };
  }

  if (isSuccess) {
    const ees = await prisma.eES.findUnique({
      where: { id: targetID },
      select: { nom_ees: true, tutelle_id: true }
    });
    redirect(`/gestionnaireconcours/${targetID}?nom_ees=${encodeURIComponent(ees?.nom_ees || "")}&tutelle_id=${ees?.tutelle_id}`);
  }
}

/**
 * SUPPRIMER UN CONCOURS
 */
export async function DeleteConcours(id: string, ees_id: string) {
  let isSuccess = false;
  let eesInfo = null;

  try {
    eesInfo = await prisma.eES.findUnique({
      where: { id: ees_id },
      select: { nom_ees: true, tutelle_id: true }
    });

    await prisma.concours.delete({ where: { id } });
    revalidatePath(`/gestionnaireconcours/${ees_id}`);
    isSuccess = true;
  } catch (error: any) {
    // AJOUTEZ CECI : Laisse passer la redirection sans entrer dans le catch
    if (error.digest?.includes("NEXT_REDIRECT")) throw error;

    console.error("Erreur:", error);
    return { error: "Erreur lors de la suppression." };
  }

  if (isSuccess) {
    redirect(`/gestionnaireconcours/${ees_id}?nom_ees=${encodeURIComponent(eesInfo?.nom_ees || "")}&tutelle_id=${eesInfo?.tutelle_id}`);
  }
}

export async function GetConcoursById(id: string) {
  return await prisma.concours.findUnique({
    where: { id },
    include: {
      ees: {
        include: { tutelle: true }
      }
    }
  });
}
