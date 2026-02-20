"use server";
import prisma from "../../lib/prisma";
import {revalidatePath} from "next/cache";
import { redirect } from "next/navigation";

export async function AddTutelle(formData: FormData) {

    let isSuccess = false;
    try {
        const nom_tutelle = formData.get("nom_tutelle") as string;
        const nom_tutelle_tech = formData.get("nom_tutelle_tech") as string;
        const region = formData.get("region") as string;
        const tutelle_bio = formData.get("tutelle_bio") as string;

        if (!nom_tutelle || !region) {
            return { error: "Tous les champs sont requis" };
        }

        await prisma.tutelleInstitutionelle.create({
            data: {
                nom_tutelle,
                nom_tutelle_tech,
                region,
                tutelle_bio
            }
        });

        revalidatePath("/gestionnairetutelle");
        
        
        //  AJOUTE CECI : Retourne un succès pour que le client le sache
        isSuccess = true;

    } catch (error) {
        console.error("Erreur lors de la création de l'institut tutellaire:", error);
        //  Évite le "throw error" ici si tu veux gérer l'alerte proprement
        return { error: "Une erreur technique est survenue" };
    }

     if (isSuccess) {
         redirect("/gestionnairetutelle"); // Remplace par l'URL de ton choix
    
     }
   
    
}


