import prisma from "@/lib/prisma";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function ConcoursPage() {
  const concours = await prisma.sessionAdmission.findMany({
    where: { etat: true },
    include: {
      ees: {
        include: { tutelleInstitutionelle: true },
      },
    },
    orderBy: { limiteDepot: "asc" },
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "À confirmer";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const now = new Date();
  const activeCount = concours.filter(c => new Date(c.limiteDepot) > now).length;
  const closedCount = concours.filter(c => new Date(c.limiteDepot) <= now).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-4">Concours & Admissions</h1>
          <p className="text-slate-400 mb-6">Retrouvez tous les concours d'accès disponibles au Cameroun</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-slate-400 text-xs font-semibold">TOTAL</p>
              <p className="text-white font-black text-2xl">{concours.length}</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <p className="text-emerald-300 text-xs font-semibold">EN COURS</p>
              <p className="text-emerald-300 font-black text-2xl">{activeCount}</p>
            </div>
            <div className="p-4 bg-slate-500/10 rounded-lg border border-slate-500/30">
              <p className="text-slate-300 text-xs font-semibold">CLOS</p>
              <p className="text-slate-300 font-black text-2xl">{closedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {concours.length > 0 ? (
          <div className="space-y-6">
            {concours.map((c) => {
              const isClosing = new Date(c.limiteDepot) < now;
              const daysLeft = Math.ceil(
                (new Date(c.limiteDepot).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Link
                  key={c.id}
                  href={`/concours/${c.id}`}
                  className="group block p-8 bg-linear-to-r from-white/5 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
                          {c.ees.eesType}
                        </span>
                        {isClosing ? (
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold animate-pulse">
                            ⏰ Dépôts ferment bientôt
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                            ✓ Dépôts ouverts
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-indigo-300 transition">
                        {c.nomConcours}
                      </h3>

                      <p className="text-slate-300 mb-4">{c.ees.nomEes}</p>

                      {c.concoursBio && (
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{c.concoursBio}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-slate-500 text-xs font-semibold mb-1">NIVEAU</p>
                          <p className="text-white font-bold text-sm">{c.diplomeRequis}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-semibold mb-1">CLÔTURE</p>
                          <p className="text-white font-bold text-sm">{formatDate(c.limiteDepot)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-semibold mb-1">EXAMENS</p>
                          <p className="text-white font-bold text-sm">Écrit : {formatDate(c.dateExamEcrit)}</p>
                          <p className="text-white font-bold text-sm">Oral : {formatDate(c.dateExamOral)}</p>
                        </div>
                        {!isClosing && (
                          <div>
                            <p className="text-slate-500 text-xs font-semibold mb-1">JOURS RESTANTS</p>
                            <p className="text-indigo-300 font-black text-sm">{daysLeft} j</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-slate-400 text-xs font-semibold">LIEU EXAMEN</p>
                        {c.adressExam ? (
                          <p className="text-white font-semibold text-sm line-clamp-2 max-w-xs">{c.adressExam}</p>
                        ) : (
                          <p className="text-slate-500 text-sm">À confirmer</p>
                        )}
                      </div>
                      <div className="p-3 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-lg transition">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Aucun concours actuellement disponible</p>
            <Link
              href="/explore"
              className="inline-block mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Explorer les formations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
