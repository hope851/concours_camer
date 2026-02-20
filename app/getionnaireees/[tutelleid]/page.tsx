import EesCard from "@/components/ui/eesCard";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function GestionEesPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ tutelleid: string }> 
  searchParams: Promise<{ nom_tutelle?: string}>
}) {
  // 1. Résolution des promesses (obligatoire dans Next.js 15)
  const { nom_tutelle } = await searchParams;
  const { tutelleid: tid } = await params;

  const affichageTutelle = nom_tutelle || "";

  // 2. Récupération des données avec Prisma
  const etablissements = await prisma.eES.findMany({
    where: { tutelle_id: tid },
    include: { tutelle: true },
    orderBy: { nom_ees: 'asc' }
  });

  // Composant réutilisable pour le bouton d'ajout
  const AddButton = () => (
    <Link href={`/formees?tutelleId=${tid}`} className="block mt-8">
      <button className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl transition-all duration-200 flex justify-center items-center gap-2 group">
        Ajouter un nouvel établissement
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </Link>
  );

  // 3. Gestion de l'état vide
  if (!etablissements || etablissements.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 p-6">
        <p className="text-slate-500 text-lg mb-4">Aucun établissement trouvé pour cette tutelle.</p>
        <div className="w-full max-w-md">
          <AddButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
             Liste des établissements d'enseignement supérieur : {affichageTutelle}
          </h1>
          <p className="text-slate-500 font-medium">
            {etablissements.length} établissement(s) répertorié(s)
          </p>
        </header>

        {/* 4. Grille responsive corrigée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {etablissements.map((ees) => (
            <div key={ees.id} className="flex justify-center">
              <EesCard data={ees} />
            </div>
          ))}
        </div>

        {/* 5. Bouton d'ajout en bas de liste */}
        <div className="max-w-md mx-auto mt-12">
          <AddButton />
        </div>
      </div>
    </div>
  );
}
