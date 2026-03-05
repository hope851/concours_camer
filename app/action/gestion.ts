"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { GetCurrentUser } from "./user";

// Vérifier si l'utilisateur est bien un gestionnaire et récupérer son EES
async function getManagedEes() {
    const user = await GetCurrentUser();
    if (!user || user.role !== 'GESTIONAIRE' || !user.eesId) {
        return null;
    }
    return user.eesId;
}

// --- GESTION DES CONCOURS ---

export async function GetMyConcours() {
    const eesId = await getManagedEes();
    if (!eesId) return [];

    return await prisma.concours.findMany({
        where: { ees_id: eesId },
        orderBy: { date_ouverture: 'desc' }
    });
}

export async function ToggleConcoursStatus(id: string, currentEtat: boolean) {
    const eesId = await getManagedEes();
    if (!eesId) return { error: "Non autorisé" };

    await prisma.concours.update({
        where: { id, ees_id: eesId },
        data: { etat: !currentEtat }
    });
    revalidatePath("/profile/gestion");
}

// --- GESTION DES FILIÈRES ---

export async function GetMyFilieres() {
    const eesId = await getManagedEes();
    if (!eesId) return [];

    return await prisma.filiere.findMany({
        where: { ees_id: eesId },
        orderBy: { nom_filiere: 'asc' }
    });
}

export async function DeleteFiliere(id: string) {
    const eesId = await getManagedEes();
    if (!eesId) return { error: "Non autorisé" };

    await prisma.filiere.delete({
        where: { id, ees_id: eesId }
    });
    revalidatePath("/profile/gestion");
}
