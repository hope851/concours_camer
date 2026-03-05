import prisma from "@/lib/prisma";
import FormTutelleClient from "./FormTutelleClient";

export default async function Page({
    searchParams
}: {
    // 1. On définit searchParams comme une Promise (Standard Next.js 15)
    searchParams: Promise<{ id?: string }>
}) {
    // 2. On await les paramètres
    const params = await searchParams;
    const id = params.id;
    

    let safeData: any = null;

    if (id) {
        try {
            const tutelle = await prisma.tutelleInstitutionelle.findUnique({ 
                where: { id }
            });
            if (tutelle) {
                safeData = JSON.parse(JSON.stringify(tutelle));
            }
        } catch (e) {
            console.error("Erreur requête tutelle", e);
        }
    }

    // 3. On s'assure que tutelle_id est toujours passé, même si l'EES est nouveau
    // pour que le formulaire sache à quelle tutelle rattacher l'établissement.
    const finalData = safeData ? { ...safeData, id } : { id };

    return <FormTutelleClient data={finalData} />;
}
