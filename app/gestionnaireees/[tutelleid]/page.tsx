import EesCard from "@/components/ui/eesCard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, LayoutGrid, ArrowLeft, Building2 } from "lucide-react";
import { GetCurrentUser } from "@/app/action/user";

export default async function GestionEesPage({
  params,
  searchParams
}: {
  params: Promise<{ tutelleid: string }>
  searchParams: Promise<{ nom_tutelle?: string }>
}) {
  const { nom_tutelle } = await searchParams;
  const { tutelleid: tid } = await params;
  const user = await GetCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const etablissements = await prisma.ees.findMany({
    where: { tutelleId: tid },
    include: {
      tutelleInstitutionelle: true,
      ville: true,
      _count: {
        select: { programme: true, sessionAdmission: true },
      },
      programme: true,
    },
    orderBy: { nomEes: 'asc' }
  });

  const AddButton = ({ outline = false }: { outline?: boolean }) => (
    <Link href={`/formees?tutelle_id=${tid}&nom=${nom_tutelle}`} className="inline-block">
      <button
        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all duration-500 shadow-sm uppercase tracking-widest text-xs ${outline
          ? "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
          : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-95"
          }`}
      >
        <Plus className="h-5 w-5" />
        Nouvel établissement
      </button>
    </Link>
  );

  if (!etablissements || etablissements.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-slate-950">
        <div className="p-16 rounded-[3rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl animate-in fade-in zoom-in duration-1000">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Building2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tighter text-white">Aucun EES</h2>
          <p className="mb-12 leading-relaxed font-medium text-slate-400">
            Il n&apos;y a pas encore d&apos;établissement enregistré sous la tutelle : <br />
            <span className="font-bold text-indigo-400 underline underline-offset-8 mt-2 inline-block transition-all hover:text-indigo-300 cursor-default">{nom_tutelle}</span>
          </p>
          {isAdmin && <AddButton />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-950">
      {/* Header Premium (Sticky) */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-4">
              <Link href="/gestionnairetutelle" className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-400 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
                Retour aux tutelles
              </Link>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Gestion des Établissements</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                  {nom_tutelle}
                </h1>
              </div>
              <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest w-fit px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400">
                <LayoutGrid className="h-3.5 w-3.5 text-indigo-500" />
                {etablissements.length} Établissement(s) actif(s)
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              {isAdmin && <AddButton />}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* Grille avec espacement optimisé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {etablissements.map((ees, idx) => (
            <div key={ees.id} className="h-full animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${idx * 100}ms` }}>
              {/* On injecte tutelleId pour que EesCard puisse le passer aux concours */}
              <EesCard data={{ ...ees, tutelleId: tid }} />
            </div>
          ))}
        </div>

        {/* Footer final */}
        <div className="mt-32 text-center border-t border-white/5 pt-20">
          <p className="text-slate-600 font-black mb-10 uppercase text-[10px] tracking-[0.5em]">Fin de la liste des établissements</p>
          {isAdmin && (
            <div className="scale-90 opacity-50 hover:opacity-100 hover:scale-100 transition-all duration-500">
              <AddButton outline />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
