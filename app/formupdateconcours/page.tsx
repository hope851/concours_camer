import prisma from "@/lib/prisma";
import FormConcoursClient from "./FormConcoursClient";

export default async function Page({
    searchParams
}: {
    // 1. On définit searchParams comme une Promise (Standard Next.js 15)
    searchParams: Promise<{ id?: string; ees_id?: string; nom_ees?: string }>
}) {
    // 2. On await les paramètres
    const params = await searchParams;
    const id = params.id;
    const ees_id = params.ees_id;
    const nom_ees = params.nom_ees;

    let safeData: any = null;

    if (id) {
        try {
            const concours = await prisma.concours.findUnique({ 
                where: { id },
            });
            if (concours) {
                safeData = JSON.parse(JSON.stringify(concours));
            }
        } catch (e) {
            console.error("Erreur requête Concours", e);
        }
    }

    // 3. On s'assure que ees_id est toujours passé, même si l'EES est nouveau
    // pour que le formulaire sache à quelle EES rattacher le concours.
    const finalData = safeData ? { ...safeData, ees_id, nom_ees } : { ees_id, nom_ees };

    return <FormConcoursClient data={finalData} />;
}
