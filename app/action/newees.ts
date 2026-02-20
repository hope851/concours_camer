"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AddEes(formData: FormData) {

    let isSuccess = false;
    let targetId = ""; // On stocke l'ID pour la redirection dynamique
  try {
    // 1. RÉCUPÉRATION DES DONNÉES
    const nom_ees = formData.get("nom_ees") as string;
    const ees_bio = (formData.get("ees_bio") as string) || "";
    const ville = formData.get("ville") as string;
    const site_ees = (formData.get("site_ees") as string) || "";
    const domaine = formData.get("domaine") as string;
    const ees_type = formData.get("ees_type") as string;
    
    // IMPORTANT : On récupère "tutelleId" (sans underscore) pour matcher le client
    const tutelleId = formData.get("tutelleId") as string;

     targetId = tutelleId; // On s'en servira pour repartir au bon endroit

    const filieresRaw = formData.get("filieres") as string;
    const filieresArray = filieresRaw 
        ? filieresRaw.split(",").map(f => f.trim()).filter(Boolean) 
        : [];

    // 2. VALIDATION (L'id de tutelle est OBLIGATOIRE)
    if (!nom_ees || !ville || !domaine || !ees_type || !tutelleId) {
        return { error: "Champs obligatoires manquants (Nom, Ville, Domaine, Type ou Tutelle)." };
    }

    // 3. TRANSACTION PRISMA
    const newEes = await prisma.$transaction(async (tx) => {
      return await tx.eES.create({
        data: {
          nom_ees,
          ees_bio,
          ville,
          site_ees,
          domaine,
          ees_type: ees_type as any, // Assure-toi que "ees_type" matche l'Enum Prisma
          tutelle: {
            connect: { id: tutelleId } // Utilisation de l'id récupéré du routing
          },
          filieres: {
            create: filieresArray.map(nom => ({
              nom_filiere: nom
            }))
          }
        }
      });
    });

    revalidatePath(`/gestionnaire/${tutelleId}`);
    isSuccess = true;

  } catch (error: any) {
    console.error("DEBUG ERROR:", error);

    if (error.code === 'P2002') {
        return { error: "Une filière avec ce nom existe déjà. Les noms de filières doivent être uniques." };
    }
    
    return { error: `Erreur serveur: ${error.message}` };
  }

    if (isSuccess) {
    // Si ta page s'appelle "gestionees" mais est dans un dossier dynamique :
    redirect(`/getionnaireees/${targetId}`); 
  }
}
