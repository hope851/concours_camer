import prisma from "@/lib/prisma";
import Link from "next/link";
import { MapPin, BookOpen, Building2, ExternalLink, Calendar, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  const ees = await prisma.eES.findUnique({
    where: { id },
    include: {
      tutelle: true,
      filieres: true, // Corrigé : On récupère juste la liste simple
      concours: {
        orderBy: { limite_depot: "desc" },
        take: 5,
      },
      _count: {
        select: { filieres: true, concours: true },
      },
    },
  });

  if (!ees) notFound();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="mb-16 animate-scale-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} /> {ees.ees_type}
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">{ees.nom_ees}</h1>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm group hover:border-pink-500/30 transition-all">
              <MapPin className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-300">{ees.ville}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm group hover:border-amber-500/30 transition-all">
              <Building2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-300">Tutelle : {ees.tutelle.nom_tutelle}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12 animate-scale-in delay-100">

            {/* À propos */}
            <section className="glass-card rounded-[40px] p-10 border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Building2 size={160} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                Présentation
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed relative">
                {ees.ees_bio || `L'établissement ${ees.nom_ees} intervient principalement dans le domaine d'excellence : ${ees.domaine}.`}
              </p>
            </section>

            {/* Filières */}
            <section className="glass-card rounded-[40px] p-10 border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                  Offres de Formation
                </h2>
                <div className="px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
                  {ees._count.filieres} Filières
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ees.filieres.map((filiere) => (
                  <div key={filiere.id} className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all group">
                    <h3 className="font-black text-white group-hover:text-indigo-300 transition-colors text-lg tracking-tight mb-1">{filiere.nom_filiere}</h3>
                    {filiere.mention ? (
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mention: <span className="text-slate-400">{filiere.mention}</span></p>
                    ) : (
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Programme Supérieur</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Concours */}
            <section className="glass-card rounded-[40px] p-10 border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                  Sessions de Concours
                </h2>
                <div className="px-4 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest">
                  {ees._count.concours} Opportunités
                </div>
              </div>

              <div className="space-y-6">
                {ees.concours.map((c) => (
                  <div key={c.id} className="p-8 bg-white/[0.03] rounded-[32px] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/[0.05] transition-all group">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors tracking-tight">{c.nom_concours}</h3>
                      <div className="flex flex-wrap gap-4 items-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Diplôme : <span className="text-slate-300">{c.diplome_requis}</span></p>
                        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                          <Calendar size={12} /> Limite : {formatDate(c.limite_depot)}
                        </div>
                      </div>
                    </div>
                    <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${c.etat ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {c.etat ? "Portail Ouvert" : "Session Close"}
                    </div>
                  </div>
                ))}
                {ees.concours.length === 0 && (
                  <p className="text-center py-10 text-slate-500 font-bold italic">Aucun concours programmé pour le moment.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 animate-scale-in delay-200">
            <div className="glass-card rounded-[40px] p-10 border-white/5 shadow-2xl bg-linear-to-br from-indigo-500/10 to-transparent flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/30">
                <ExternalLink size={32} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Vecteur Officiel</h3>
              <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">Consultez les informations authentifiées directement sur le portail de l'établissement.</p>

              {ees.site_ees ? (
                <a
                  href={ees.site_ees.startsWith('http') ? ees.site_ees : `https://${ees.site_ees}`}
                  target="_blank"
                  className="w-full py-5 bg-linear-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[20px] shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95"
                >
                  Visiter le site <ExternalLink size={16} />
                </a>
              ) : (
                <div className="w-full py-5 bg-white/5 text-slate-600 font-black uppercase tracking-[0.2em] text-[10px] rounded-[20px] border border-white/5 cursor-not-allowed">
                  Portail non configuré
                </div>
              )}
            </div>

            <div className="glass-card rounded-[40px] p-10 border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-pink-500/10 rounded-[20px] flex items-center justify-center mb-6 border border-pink-500/20">
                <MapPin size={24} className="text-pink-400" />
              </div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-2">Campus Local</h4>
              <p className="text-slate-400 font-bold">{ees.ville}, Cameroun</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
