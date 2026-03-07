import ConcoursCard from "@/components/ui/concoursCard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, LayoutGrid, ArrowLeft } from "lucide-react";

export default async function GestionConcoursPage({
  params,
  searchParams
}: {
  params: Promise<{ ees_id: string }>
  searchParams: Promise<{ nom_ees?: string, tutelle_id?: string }> // Ajout de tutelle_id si tu veux un retour précis
}) {
  const { nom_ees, tutelle_id } = await searchParams;
  const { ees_id: tid } = await params;

  const concours = await prisma.concours.findMany({
    where: { ees_id: tid },
    include: {
      ees: {
        select: {
          nom_ees: true,
          ville: true,
          ees_type: true
        }
      }
    },
    orderBy: { date_exam: 'asc' }
  });

  const AddButton = ({ outline = false }: { outline?: boolean }) => (
    <Link href={`/formconcours?ees_id=${tid}&nom_ees=${encodeURIComponent(nom_ees || "")}&tutelle_id=${tutelle_id || ""}`} className="inline-block">
      <button
        className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-sm ${outline
            ? "bg-card border-2 border-border text-muted-foreground hover:bg-background"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 active:scale-95"
          }`}
      >
        <Plus className="h-5 w-5" />
        Ajouter un concours
      </button>
    </Link>
  );

  if (!concours || concours.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] p-6 text-center" style={{ background: 'var(--color-background)' }}>
        <div className="p-10 rounded-[3rem] shadow-xl max-w-sm" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-card-foreground)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--color-secondary)' }}>
            <LayoutGrid className="h-10 w-10" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>Aucun concours</h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
            Il n'y a pas encore de concours enregistré pour <span className="font-bold" style={{ color: 'var(--color-foreground)' }}>{nom_ees}</span>.
          </p>
          <AddButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-background)' }}>
      {/* Header Stylisé */}
      <div className="border-b mb-12 shadow-sm" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              {/* LIEN DE RETOUR CORRIGÉ */}
              <Link
                href={tutelle_id ? `/gestionnaireees/${tutelle_id}` : "/gestionnairetutelle"}
                className="group inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" style={{ color: 'var(--color-primary)' }} />
                Retour aux établissements
              </Link>

              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-muted)' }}>{nom_ees}</p>
                <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                  Concours Session <span style={{ color: 'var(--color-primary)' }}>{new Date().getFullYear()}</span>
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ background: 'var(--color-secondary)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}>
                  {concours.length} Session{concours.length > 1 ? 's' : ''} répertoriée{concours.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <AddButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Grille Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {concours.map((item) => (
            <div key={item.id} className="h-full">
              {/* @ts-ignore */}
              <ConcoursCard data={item} />
            </div>
          ))}
        </div>

        {/* Footer avec rappel d'action */}
        <div className="mt-24 text-center pt-16 border-t border-border">
          <p className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-muted-foreground">Fin de la liste des sessions</p>
          <AddButton outline />
        </div>
      </div>
    </div>
  );
}
