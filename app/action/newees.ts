"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GetCurrentUser } from "./user";
import { randomUUID } from "crypto";

interface ProgrammeInput {
  id?: string;
  nomProgramme: string;
  specialite?: string;
  niveau: string;
}

async function resolveVilleId(villeIdInput?: string, nomVilleInput?: string, paysIdInput?: string) {
  if (villeIdInput) {
    const existing = await prisma.ville.findUnique({ where: { id: villeIdInput } });
    if (existing) return existing.id;
  }

  const cityName = (nomVilleInput || "Yaoundé").trim();

  let targetPaysId = paysIdInput;
  if (!targetPaysId) {
    const cameroun = await prisma.pays.upsert({
      where: { nomPays: "Cameroun" },
      create: { id: randomUUID(), nomPays: "Cameroun", region: "Afrique Centrale" },
      update: {},
    });
    targetPaysId = cameroun.id;
  }

  const ville = await prisma.ville.upsert({
    where: { nomVille_paysId: { nomVille: cityName, paysId: targetPaysId } },
    create: { id: randomUUID(), nomVille: cityName, paysId: targetPaysId },
    update: {},
  });

  return ville.id;
}

/**
 * AJOUTER UNE EES
 */
export async function AddEes(formData: FormData) {
  let targetId = "";
  let nomTutelle = "";

  try {
    const user = await GetCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "GESTIONAIRE")) {
      return { error: "Seuls les administrateurs et gestionnaires peuvent créer un établissement." };
    }

    const nomEes = formData.get("nom_ees") as string;
    const eesBio = (formData.get("ees_bio") as string) || "";
    const siteEes = (formData.get("site_ees") as string) || "";
    const domaine = formData.get("domaine") as string;
    const eesType = formData.get("ees_type") as string;
    const tutelleId = formData.get("tutelle_id") as string;
    const villeIdInput = formData.get("ville_id") as string;
    const villeNameInput = formData.get("ville") as string;
    const paysIdInput = formData.get("pays_id") as string;

    const latitudeRaw = formData.get("posGeoLatitude") as string;
    const longitudeRaw = formData.get("posGeoLongitude") as string;
    const posGeoLatitude = latitudeRaw ? parseFloat(latitudeRaw) : null;
    const posGeoLongitude = longitudeRaw ? parseFloat(longitudeRaw) : null;

    // Structured programmes
    const programmesJson = formData.get("programmes_json") as string;
    const filieresRaw = formData.get("filieres") as string;

    let programmesArray: ProgrammeInput[] = [];
    if (programmesJson) {
      try {
        programmesArray = JSON.parse(programmesJson);
      } catch (e) {
        console.warn("Invalid programmes_json", e);
      }
    } else if (filieresRaw) {
      programmesArray = filieresRaw
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .map((nom) => ({ nomProgramme: nom, niveau: "Licence" }));
    }

    if (!nomEes || (!villeIdInput && !villeNameInput) || !domaine || !eesType || !tutelleId) {
      return { error: "Champs obligatoires manquants (Nom, Ville, Domaine, Type ou Tutelle)." };
    }

    const villeId = await resolveVilleId(villeIdInput, villeNameInput, paysIdInput);
    targetId = tutelleId;

    await prisma.$transaction(async (tx) => {
      await tx.ees.create({
        data: {
          id: randomUUID(),
          nomEes: nomEes.trim(),
          eesBio: eesBio.trim() || null,
          siteEes: siteEes.trim() || null,
          domaine: domaine.trim(),
          eesType: eesType.trim(),
          posGeoLatitude,
          posGeoLongitude,
          ville: { connect: { id: villeId } },
          tutelleInstitutionelle: { connect: { id: tutelleId } },
          programme: {
            create: programmesArray.map((p) => ({
              id: randomUUID(),
              nomProgramme: p.nomProgramme.trim(),
              specialite: p.specialite?.trim() || null,
              niveau: p.niveau?.trim() || "Licence",
            })),
          },
        },
      });
    });

    const tutelle = await prisma.tutelleInstitutionelle.findUnique({
      where: { id: targetId },
      select: { nomTutelle: true },
    });
    nomTutelle = tutelle?.nomTutelle || "Tutelle";

    revalidatePath(`/gestionnaireees/${targetId}`);
    revalidatePath("/explore");
  } catch (error: any) {
    if (error.code === "P2002") return { error: "Un programme avec ce nom et niveau existe déjà dans cet établissement." };
    console.error("AddEes error:", error);
    return { error: `Erreur serveur: ${error.message}` };
  }

  redirect(`/gestionnaireees/${targetId}?nom_tutelle=${encodeURIComponent(nomTutelle)}`);
}

/**
 * MODIFIER UNE EES
 */
export async function UpdateEes(formData: FormData) {
  let targetId = "";
  let nomTutelle = "";

  try {
    const user = await GetCurrentUser();
    const id = formData.get("id") as string;
    if (!user || (user.role !== "ADMIN" && (user.role !== "GESTIONAIRE" || user.eesId !== id))) {
      return { error: "Action non autorisée sur cet établissement." };
    }
    const nomEes = formData.get("nom_ees") as string;
    const eesBio = (formData.get("ees_bio") as string) || "";
    const siteEes = (formData.get("site_ees") as string) || "";
    const domaine = formData.get("domaine") as string;
    const eesType = formData.get("ees_type") as string;
    const tutelleId = formData.get("tutelle_id") as string;
    const villeIdInput = formData.get("ville_id") as string;
    const villeNameInput = formData.get("ville") as string;
    const paysIdInput = formData.get("pays_id") as string;

    const latitudeRaw = formData.get("posGeoLatitude") as string;
    const longitudeRaw = formData.get("posGeoLongitude") as string;
    const posGeoLatitude = latitudeRaw ? parseFloat(latitudeRaw) : null;
    const posGeoLongitude = longitudeRaw ? parseFloat(longitudeRaw) : null;

    if (!id || !nomEes || !tutelleId) return { error: "Données manquantes." };

    targetId = tutelleId;
    const resolvedVilleId = await resolveVilleId(villeIdInput, villeNameInput, paysIdInput);

    const programmesJson = formData.get("programmes_json") as string;
    const filieresRaw = formData.get("filieres") as string;

    let programmesArray: ProgrammeInput[] = [];
    if (programmesJson) {
      try {
        programmesArray = JSON.parse(programmesJson);
      } catch (e) {
        console.warn("Invalid programmes_json", e);
      }
    } else if (filieresRaw) {
      programmesArray = filieresRaw
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .map((nom) => ({ nomProgramme: nom, niveau: "Licence" }));
    }

    await prisma.$transaction(async (tx) => {
      await tx.ees.update({
        where: { id },
        data: {
          nomEes: nomEes.trim(),
          eesBio: eesBio.trim() || null,
          siteEes: siteEes.trim() || null,
          domaine: domaine.trim(),
          eesType: eesType.trim(),
          posGeoLatitude,
          posGeoLongitude,
          ville: { connect: { id: resolvedVilleId } },
          tutelleInstitutionelle: { connect: { id: tutelleId } },
          programme: {
            deleteMany: {},
            create: programmesArray.map((p) => ({
              id: randomUUID(),
              nomProgramme: p.nomProgramme.trim(),
              specialite: p.specialite?.trim() || null,
              niveau: p.niveau?.trim() || "Licence",
            })),
          },
        },
      });
    });

    const tutelle = await prisma.tutelleInstitutionelle.findUnique({
      where: { id: targetId },
      select: { nomTutelle: true },
    });
    nomTutelle = tutelle?.nomTutelle || "Tutelle";

    revalidatePath(`/gestionnaireees/${targetId}`);
    revalidatePath(`/explore/${id}`);
    revalidatePath("/explore");
  } catch (error: any) {
    console.error("UpdateEes error:", error);
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
    const user = await GetCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Seul un administrateur peut supprimer un établissement." };
    }

    const tutelle = await prisma.tutelleInstitutionelle.findUnique({
      where: { id: tutelle_id },
      select: { nomTutelle: true }
    });
    nomTutelle = tutelle?.nomTutelle || "Tutelle";

    await prisma.ees.delete({
      where: { id },
    });

    revalidatePath(`/gestionnaireees/${tutelle_id}`);
    revalidatePath("/explore");
  } catch (error: any) {
    console.error("Erreur de suppression:", error);
    return { error: "Impossible de supprimer cet établissement." };
  }

  redirect(`/gestionnaireees/${tutelle_id}?nom_tutelle=${encodeURIComponent(nomTutelle)}`);
}
