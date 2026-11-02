"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { GetCurrentUser } from "./user";

/**
 * AJOUTER UN CONCOURS
 */
export async function AddConcours(formData: FormData) {
  let isSuccess = false;
  let targetID = "";

  try {
    const user = await GetCurrentUser();
    const eesId = formData.get("ees_id") as string;
    if (!user || (user.role !== "ADMIN" && (user.role !== "GESTIONAIRE" || user.eesId !== eesId))) {
      return { error: "Action non autorisée sur cet établissement." };
    }

    const nomConcours = formData.get("nom_concours") as string;
    const etat = formData.get("etat") === "on";
    const concoursBio = formData.get("concours_bio") as string;
    const adressExam = formData.get("adress_exam") as string;
    const dateOuverture = new Date(formData.get("date_ouverture") as string);
    const limiteDepot = new Date(formData.get("limite_depot") as string);
    const dateExamEcrit = new Date(formData.get("date_exam_ecrit") as string);
    const dateExamOral = new Date(formData.get("date_exam_oral") as string);
    const diplomeRequis = formData.get("diplome_requis") as string;
    const programmeId = (formData.get("programme_id") as string) || undefined;

    targetID = eesId;

    if (isNaN(dateOuverture.getTime()) || isNaN(limiteDepot.getTime()) || isNaN(dateExamEcrit.getTime()) || isNaN(dateExamOral.getTime())) {
      return { error: "Format de date invalide." };
    }

    if (!nomConcours || !diplomeRequis || !eesId) {
      return { error: "Veuillez remplir tous les champs obligatoires." };
    }

    if (limiteDepot > dateExamEcrit) {
      return { error: "La date limite de dépôt doit être avant la date de l'examen ecrit veuillez verifier les informations entrer" };
    }
    if (limiteDepot > dateExamOral) {
      return { error: "La date limite de dépôt doit être avant la date de l'examen oral veuillez verifier les informations entrer" };
    }
    if (dateOuverture > limiteDepot) {
      return { error: "La date d'ouverture doit être avant la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (dateExamEcrit < limiteDepot) {
      return { error: "La date de l'examen ecrit doit être après la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (dateExamOral < limiteDepot) {
      return { error: "La date de l'examen oral doit être après la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (dateExamEcrit < dateOuverture) {
      return { error: "La date de l'examen ecrit doit être après la date d'ouverture veuillez verifier les informations entrer" };
    }
    if (dateExamOral < dateOuverture) {
      return { error: "La date de l'examen oral doit être après la date d'ouverture veuillez verifier les informations entrer" };
    }

    await prisma.sessionAdmission.create({
      data: {
        id: randomUUID(),
        nomConcours,
        etat,
        concoursBio,
        dateOuverture,
        limiteDepot,
        dateExamEcrit,
        dateExamOral,
        diplomeRequis,
        adressExam,
        ees: { connect: { id: eesId } },
        ...(programmeId ? { programme: { connect: { id: programmeId } } } : {}),
      }
    });

    revalidatePath(`/gestionnaireconcours/${eesId}`);
    isSuccess = true;
  } catch (error: any) {
    console.error("Erreur AddConcours:", error);
    return { error: "Une erreur technique est survenue." };
  }

  if (isSuccess) {
    const ees = await prisma.ees.findUnique({
      where: { id: targetID },
      select: { nomEes: true, tutelleId: true }
    });
    redirect(`/gestionnaireconcours/${targetID}?nom_ees=${encodeURIComponent(ees?.nomEes || "")}&tutelle_id=${ees?.tutelleId || ""}`);
  }
}

/**
 * MODIFIER UN CONCOURS
 */
export async function UpdateConcours(formData: FormData) {
  let isSuccess = false;
  let targetID = "";

  try {
    const user = await GetCurrentUser();
    const id = formData.get("id") as string;
    const eesId = formData.get("ees_id") as string;

    if (!user || (user.role !== "ADMIN" && (user.role !== "GESTIONAIRE" || user.eesId !== eesId))) {
      return { error: "Action non autorisée sur ce concours." };
    }

    const nomConcours = formData.get("nom_concours") as string;
    const etat = formData.get("etat") === "on" || formData.get("etat") === "true";
    const concoursBio = formData.get("concours_bio") as string;
    const adressExam = formData.get("adress_exam") as string;
    const dateOuverture = new Date(formData.get("date_ouverture") as string);
    const limiteDepot = new Date(formData.get("limite_depot") as string);
    const dateExamEcrit = new Date(formData.get("date_exam_ecrit") as string);
    const dateExamOral = new Date(formData.get("date_exam_oral") as string);
    const diplomeRequis = formData.get("diplome_requis") as string;
    const programmeId = (formData.get("programme_id") as string) || undefined;

    targetID = eesId;

    if (isNaN(dateOuverture.getTime()) || isNaN(limiteDepot.getTime()) || isNaN(dateExamEcrit.getTime()) || isNaN(dateExamOral.getTime())) {
      return { error: "Format de date invalide." };
    }

    if (!nomConcours || !diplomeRequis || !eesId) {
      return { error: "Veuillez remplir tous les champs obligatoires." };
    }

    if (limiteDepot > dateExamEcrit) {
      return { error: "La date limite de dépôt doit être avant la date de l'examen ecrit veuillez verifier les informations entrer " };
    }
    if (limiteDepot > dateExamOral) {
      return { error: "La date limite de dépôt doit être avant la date de l'examen oral veuillez verifier les informations entrer " };
    }
    if (dateOuverture > limiteDepot) {
      return { error: "La date d'ouverture doit être avant la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (dateExamEcrit < limiteDepot) {
      return { error: "La date de l'examen ecrit doit être après la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (dateExamOral < limiteDepot) {
      return { error: "La date de l'examen oral ecrit doit être après la date limite de dépôt veuillez verifier les informations entrer" };
    }
    if (dateExamEcrit < dateOuverture) {
      return { error: "La date de l'examen ecrit doit être après la date d'ouverture veuillez verifier les informations entrer" };
    }
    if (dateExamOral < dateOuverture) {
      return { error: "La date de l'examen oral doit être après la date d'ouverture veuillez verifier les informations entrer" };
    }

    await prisma.sessionAdmission.update({
      where: { id },
      data: {
        nomConcours,
        etat,
        concoursBio,
        dateOuverture,
        dateExamEcrit,
        dateExamOral,
        limiteDepot,
        diplomeRequis,
        adressExam,
        programme: programmeId
          ? { connect: { id: programmeId } }
          : { disconnect: true },
      }
    });

    revalidatePath(`/gestionnaireconcours/${eesId}`);
    isSuccess = true;
  } catch (error: any) {
    console.error("Erreur UpdateConcours:", error);
    return { error: "Erreur lors de la mise à jour." };
  }

  if (isSuccess) {
    const ees = await prisma.ees.findUnique({
      where: { id: targetID },
      select: { nomEes: true, tutelleId: true }
    });
    redirect(`/gestionnaireconcours/${targetID}?nom_ees=${encodeURIComponent(ees?.nomEes || "")}&tutelle_id=${ees?.tutelleId || ""}`);
  }
}

/**
 * SUPPRIMER UN CONCOURS
 */
export async function DeleteConcours(id: string, ees_id: string) {
  let isSuccess = false;
  let eesInfo = null;

  try {
    const user = await GetCurrentUser();
    if (!user || (user.role !== "ADMIN" && (user.role !== "GESTIONAIRE" || user.eesId !== ees_id))) {
      return { error: "Action non autorisée sur ce concours." };
    }

    eesInfo = await prisma.ees.findUnique({
      where: { id: ees_id },
      select: { nomEes: true, tutelleId: true }
    });

    await prisma.sessionAdmission.delete({ where: { id } });
    revalidatePath(`/gestionnaireconcours/${ees_id}`);
    isSuccess = true;
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) throw error;

    console.error("Erreur:", error);
    return { error: "Erreur lors de la suppression." };
  }

  if (isSuccess) {
    redirect(`/gestionnaireconcours/${ees_id}?nom_ees=${encodeURIComponent(eesInfo?.nomEes || "")}&tutelle_id=${eesInfo?.tutelleId || ""}`);
  }
}

export async function GetConcoursById(id: string) {
  return await prisma.sessionAdmission.findUnique({
    where: { id },
    include: {
      ees: {
        include: { tutelleInstitutionelle: true }
      },
      programme: true,
    }
  });
}

export async function GetProgrammesByEes(eesId: string) {
  return await prisma.programme.findMany({
    where: { eesId },
    orderBy: { nomProgramme: "asc" },
    select: { id: true, nomProgramme: true, niveau: true, specialite: true },
  });
}
