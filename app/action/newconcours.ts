"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function AddConcours(formData: FormData) {
  try {
    const nom_concours = formData.get("nom_concours") as string;
    // Conversion correcte du checkbox (HTML envoie "on" ou null)
    const etat = formData.get("etat") === "on"; 
    const concours_bio = formData.get("concours_bio") as string;
    
    // Dates : Prisma attend des objets Date valides
    const date_ouverture = new Date(formData.get("date_ouverture") as string);
    const limite_depot = new Date(formData.get("limite_depot") as string);
    const date_exam = new Date(formData.get("date_exam") as string);
    
    const diplome_requis = formData.get("diplome_requis") as string;
    const ees_id = formData.get("ees_id") as string; 

    // Vérification de la validité des dates
    if (isNaN(date_ouverture.getTime()) || isNaN(limite_depot.getTime()) || isNaN(date_exam.getTime())) {
        return { error: "Format de date invalide." };
    }

    if (!nom_concours || !diplome_requis || !ees_id) {
      return { error: "Veuillez remplir tous les champs obligatoires." };
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
        // Utilisation de 'connect' pour lier à l'EES existant
        ees: {
          connect: { id: ees_id }
        }
      }
    });

    revalidatePath("/formconcours");
    return { success: true };

  } catch (error: any) {
    console.error("Erreur détaillée :", error);
    
    // Erreur P2025 : L'ID de l'EES n'existe pas dans la base
    if (error.code === 'P2025') {
        return { error: "L'ID de l'établissement (EES) est introuvable." };
    }
    
    return { error: "Une erreur technique est survenue lors de l'enregistrement." };
  }
}
