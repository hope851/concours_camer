import prisma from "@/lib/prisma";
import FormEesClient from "./FormEesClient";

export default async function Page({
    searchParams
}: {
    // 1. On définit searchParams comme une Promise (Standard Next.js 15)
    searchParams: Promise<{ id?: string; tutelle_id?: string }>
}) {
    // 2. On await les paramètres
    const params = await searchParams;
    const id = params.id;
    const tutelle_id = params.tutelle_id;

    let safeData: any = null;

    if (id) {
        try {
            const etablissement = await prisma.eES.findUnique({ 
                where: { id },
                include: { filieres: true } // On n'oublie pas les filières !
            });
            if (etablissement) {
                safeData = JSON.parse(JSON.stringify(etablissement));
            }
        } catch (e) {
            console.error("Erreur requête EES", e);
        }
    }

    // 3. On s'assure que tutelle_id est toujours passé, même si l'EES est nouveau
    // pour que le formulaire sache à quelle tutelle rattacher l'établissement.
    const finalData = safeData ? { ...safeData, tutelle_id } : { tutelle_id };

    return <FormEesClient data={finalData} />;
}
