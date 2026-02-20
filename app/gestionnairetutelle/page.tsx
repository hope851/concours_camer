import TutelleCard from "@/components/ui/tutelleCard";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function GestionPage() {
  // 1. Récupérer TOUS les instituts (on enlève le filtre where pour tout avoir)
  const institutions = await prisma.tutelleInstitutionelle.findMany({
    orderBy: { nom_tutelle: 'asc' } // Optionnel : trier par ordre alphabétique
  });

  if (!institutions || institutions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-500">
        Aucun établissement trouvé dans la base de données.

        <div>
        <Link href="/formtutelle">
          <button className="  m-10 w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl transition-all duration-200 flex justify-center items-center gap-2 group">
          Ajouter une Nouvelle institution   
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        </Link>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Annuaire des Institution Tutellaire 
          </h1>
          <p className="text-slate-500 font-medium">
            {institutions.length} institution(s) répertorié(s)
          </p>
        </header>

        {/* 2. Grille responsive : 1 colonne sur mobile, 2 sur tablette, 3 sur PC */}
        <div className="grid  lg:grid-cols-3 gap-8 items-start">
          {institutions.map((inst) => (
            <div key={inst.id} className="flex justify-center">
              {/* On passe chaque institut individuellement au composant */}
              <TutelleCard data={inst} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Link href="/formtutelle">
          <button className="  m-10 w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl transition-all duration-200 flex justify-center items-center gap-2 group">
          Ajouter une Nouvelle institution   
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        </Link>
      </div>
    </div>
  );
}
