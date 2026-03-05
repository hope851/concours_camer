import TutelleCard from "@/components/ui/tutelleCard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default async function GestionPage() {
  // 1. Récupérer TOUS les instituts (on enlève le filtre where pour tout avoir)
  const institutions = await prisma.tutelleInstitutionelle.findMany({
    orderBy: { nom_tutelle: 'asc' },// Optionnel : trier par ordre alphabétique
    include: {
      _count: {
        select: { ees: true } // "ees" doit correspondre au nom de la relation dans votre schéma
      }
    }
  });

  const AddButton = ({ outline = false }: { outline?: boolean }) => (
    <Link href="/formtutelle" className="inline-block group">
      <button
        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all duration-500 shadow-sm uppercase tracking-widest text-xs ${outline
          ? "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
          : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-95"
          }`}
      >
        Ajouter une nouvelle institution
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </Link>
  );

  if (!institutions || institutions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 p-6 text-slate-400">
        <div className="text-center mb-10 p-16 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl animate-in fade-in zoom-in duration-1000">
          <h2 className="text-2xl font-black text-white mb-4">Base de données vide</h2>
          <p className="mb-10 font-medium">Aucun établissement trouvé dans la base de données.</p>
          <AddButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-16 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Building2 className="w-3 h-3" /> Administration
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Annuaire des <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">Institutions</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            {institutions.length} institution(s) répertoriée(s)
          </p>
        </header>

        {/* 2. Grille responsive : 1 colonne sur mobile, 2 sur tablette, 3 sur PC */}
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {institutions.map((inst, idx) => (
            <div key={inst.id} className="flex justify-center animate-in fade-in slide-in-from-bottom-12 fill-mode-both" style={{ animationDelay: `${idx * 100}ms` }}>
              {/* On passe chaque institut individuellement au composant */}
              <TutelleCard data={inst} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 flex justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
        <div className="scale-90 opacity-50 hover:opacity-100 hover:scale-100 transition-all duration-500">
          <AddButton outline />
        </div>
      </div>
    </div>
  );
}
