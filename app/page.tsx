import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Users, Zap, CheckCircle, Calendar, Award, Lightbulb, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import ConcoursCalendar from "@/components/ConcoursCalendar";
import AuthCallToAction from "@/components/AuthCallToAction";
import CloudinaryImage from "@/components/CloudinaryImage";


async function getStats() {
  try {
    const [eesCount, filiereCount, concoursCount, tutelleCount, allConcours, latestNews] = await Promise.all([
      prisma.eES.count(),
      prisma.filiere.count(),
      prisma.concours.count(),
      prisma.tutelleInstitutionelle.count(),
      prisma.concours.findMany({
        take: 10,
        where: { etat: true },
        include: {
          ees: {
            select: { id: true, nom_ees: true }
          }
        }
      }),
      prisma.news.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      }).catch((error) => {
        console.warn('News unavailable:', error);
        return [];
      })
    ]);

    const recentEES = await prisma.eES.findMany({
      take: 3,
      orderBy: { id: "desc" },
      include: { tutelle: true, _count: { select: { filieres: true, concours: true } } },
    });

    const topEES = await prisma.eES.findMany({
      take: 4,
      include: {
        _count: { select: { filieres: true, concours: true } }
      }
    });

    return { eesCount, filiereCount, concoursCount, tutelleCount, recentEES, allConcours, topEES, latestNews };
  } catch (error) {
    console.error("Erreur stat:", error);
    return { eesCount: 0, filiereCount: 0, concoursCount: 0, tutelleCount: 0, recentEES: [], allConcours: [], topEES: [], latestNews: [] };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Navbar />

      {/* HERO SECTION - REFINED PREMIUM LOOK */}
      <section className="relative overflow-hidden pt-32 pb-40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -top-96 -right-96 animate-pulse" />
          <div className="absolute w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -bottom-96 -left-96 animate-pulse" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-scale-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 backdrop-blur-sm">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">L&apos;Excellence Académique à Portée de Main</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Tracez <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">votre voie</span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            La plateforme d&apos;élite pour explorer l&apos;enseignement supérieur au Cameroun.
            Découvrez, comparez et préparez votre avenir avec une précision inégalée.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="#calendrier"
              className="px-10 py-5 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
            >
              Voir le Calendrier <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/concours"
              className="px-10 py-5 glass-card hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
            >
              Voir les Concours
            </Link>
          </div>

          {/* Quick stats in hero - REFINED */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-8 max-w-2xl mx-auto justify-center">
            <div className="w-28 sm:w-40 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-white/5 group hover:border-indigo-500/30 transition-colors">
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 mb-1">{stats.eesCount}+</p>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:break-normal break-words">Établissements</p>
            </div>
            <div className="w-28 sm:w-40 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-white/5 group hover:border-pink-500/30 transition-colors">
              <p className="text-2xl sm:text-3xl font-black text-pink-400 mb-1">{stats.concoursCount}+</p>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:break-normal break-words">Concours</p>
            </div>
            <div className="w-28 sm:w-40 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-white/5 group hover:border-cyan-500/30 transition-colors">
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 mb-1">{stats.tutelleCount}+</p>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:break-normal break-words">Tutelles</p>
            </div>
          </div>

          {/* LATEST NEWS - VIBRANT HERO INTEGRATION (DESKTOP) */}
          {stats.latestNews.length > 0 && (
            <div className="mt-20 max-w-5xl mx-auto text-left animate-on-scroll hidden sm:block">
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <Zap size={18} className="text-orange-400 fill-orange-400/20" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">À la Une</h2>
                </div>
                <Link href="/news" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-2 group">
                  Toutes les actus <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                {stats.latestNews.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="group relative h-72 rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-2 block"
                  >
                    {/* Background Image if exists */}
                    {news.image && (
                      <div className="absolute inset-0 z-0">
                        <CloudinaryImage
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-1" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-indigo-400/30 transition-colors duration-500 z-1" />

                    <div className="relative h-full p-6 flex flex-col justify-between z-10">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-indigo-400 uppercase tracking-widest shadow-sm">
                            {news.category}
                          </span>
                          {news.isUrgent && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping absolute opacity-75"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 relative"></span> Urgent
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight line-clamp-3 group-hover:text-indigo-300 transition-colors">
                          {news.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {new Intl.DateTimeFormat("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(news.createdAt))}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors border border-white/5 group-hover:border-indigo-500/30">
                          <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-400 transition-colors group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* LATEST NEWS - MOBILE SCROLLABLE VIEW */}
          {stats.latestNews.length > 0 && (
            <div className="mt-16 sm:hidden text-left pl-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                    <Zap size={14} className="text-orange-400 fill-orange-400/20" />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">À la Une</h2>
                </div>
                <Link href="/news" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition">
                  Tout voir
                </Link>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory -mx-0 scrollbar-hide">
                {stats.latestNews.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="snap-center shrink-0 w-[280px] h-60 rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 block relative"
                  >
                    {/* Background Image for Mobile */}
                    {news.image && (
                      <div className="absolute inset-0 z-0">
                        <CloudinaryImage
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover opacity-50 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      </div>
                    )}

                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-[40px] -mr-12 -mt-12 z-1" />

                    <div className="relative h-full p-5 flex flex-col justify-between z-10">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                            {news.category}
                          </span>
                          {news.isUrgent && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-[9px] font-black text-rose-400 uppercase tracking-widest animate-pulse">
                              <span className="w-1 h-1 rounded-full bg-rose-500 relative"></span> Urgent
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug line-clamp-3">
                          {news.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {new Intl.DateTimeFormat("fr-FR", { day: '2-digit', month: 'short' }).format(new Date(news.createdAt))}
                        </span>
                        <ArrowRight size={14} className="text-indigo-400" />
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="snap-center shrink-0 w-4" /> {/* End spacer padding */}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STATISTIQUES DÉTAILLÉES */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-white mb-2">Explorez par les chiffres</h2>
          <p className="text-slate-400">Découvrez l&apos;ampleur de notre plateforme d&apos;éducation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:bg-indigo-500/10">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600/40 transition">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-slate-400 text-sm font-semibold mb-2">ÉTABLISSEMENTS</p>
            <h3 className="text-4xl font-black text-white">{stats.eesCount}</h3>
            <p className="text-xs text-slate-500 mt-2">Universités & Écoles</p>
          </div>

          <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:bg-pink-500/10">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-600/40 transition">
              <Calendar className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-slate-400 text-sm font-semibold mb-2">CONCOURS</p>
            <h3 className="text-4xl font-black text-white">{stats.concoursCount}</h3>
            <p className="text-xs text-slate-500 mt-2">Opportunités</p>
          </div>

          <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:bg-cyan-500/10">
            <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-600/40 transition">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-slate-400 text-sm font-semibold mb-2">TUTELLES</p>
            <h3 className="text-4xl font-black text-white">{stats.tutelleCount}</h3>
            <p className="text-xs text-slate-500 mt-2">Institutions</p>
          </div>
        </div>
      </section>

      {/* CALENDRIER DE CONCOURS */}
      <section id="calendrier" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 scroll-mt-32">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-white mb-2">Calendrier des Concours</h2>
          <p className="text-slate-400">Planifiez votre parcours académique avec les dates des concours</p>
        </div>

        <ConcoursCalendar concours={stats.allConcours as unknown as Record<string, unknown>[]} />
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-white mb-2">Comment ça marche</h2>
          <p className="text-slate-400">Quatre étapes simples pour trouver votre formation idéale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: "Explorez",
              desc: "Parcourez les établissements et filières disponibles",
              color: "indigo"
            },
            {
              icon: Award,
              title: "Comparez",
              desc: "Consultez les détails et programmes d'études",
              color: "purple"
            },
            {
              icon: Calendar,
              title: "Planifiez",
              desc: "Notez les dates des concours d'accès",
              color: "pink"
            },
            {
              icon: CheckCircle,
              title: "Candidatez",
              desc: "Postulez aux concours qui vous intéressent",
              color: "cyan"
            },
          ].map((step, idx) => {
            const Icon = step.icon;
            const colorClass = {
              indigo: "from-indigo-600/20 to-indigo-600/10 border-indigo-500/30",
              purple: "from-purple-600/20 to-purple-600/10 border-purple-500/30",
              pink: "from-pink-600/20 to-pink-600/10 border-pink-500/30",
              cyan: "from-cyan-600/20 to-cyan-600/10 border-cyan-500/30",
            }[step.color];

            return (
              <div key={idx} className="group relative">
                <div className={`bg-linear-to-br ${colorClass} backdrop-blur-xl rounded-2xl border p-8 h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-${step.color}-600/20 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${step.color}-400`} />
                    </div>
                    <div className="text-3xl font-black text-white/20">{idx + 1}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-300 text-sm">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section >

      {/* ÉTABLISSEMENTS TOP */}
      {
        stats.topEES.length > 0 && (
          <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white mb-2">Établissements Populaires</h2>
              <p className="text-slate-400">Découvrez les institutions les plus actives en concours</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.topEES.map((ees) => (
                <Link
                  key={ees.id}
                  href={`/explore/${ees.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                  <div className="relative">
                    <div className="w-10 h-10 bg-indigo-600/30 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="w-5 h-5 text-indigo-300" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition">{ees.nom_ees}</h3>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-xs font-semibold">Concours ouverts</p>
                        <p className="text-white font-bold">{ees._count?.concours || 0}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-xs font-semibold">Concours</p>
                        <p className="text-white font-bold">{ees._count?.concours || 0}</p>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="absolute bottom-6 right-6 w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        )
      }

      {/* DERNIERS EES */}
      {
        stats.recentEES.length > 0 && (
          <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white mb-2">Nouvelles Institutions</h2>
              <p className="text-slate-400">Les derniers établissements ajoutés à notre plateforme</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.recentEES.map((ees) => (
                <Link
                  key={ees.id}
                  href={`/explore/${ees.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-8 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                  <div className="relative">
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-4">
                      {ees.ees_type}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition">{ees.nom_ees}</h3>

                    <p className="text-slate-400 text-sm mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-400" />
                      {ees.tutelle?.nom_tutelle || "N/A"}
                    </p>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-slate-500 text-xs font-semibold">Concours disponibles</p>
                        <p className="text-white font-bold text-lg">{ees._count?.concours || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold">Concours</p>
                        <p className="text-white font-bold text-lg">{ees._count?.concours || 0}</p>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="absolute bottom-8 right-8 w-5 h-5 text-indigo-400 group-hover:translate-x-2 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        )
      }



      {/* AVANTAGES */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black text-white mb-6">Pourquoi Concours-Camer ?</h2>
            <ul className="space-y-4">
              {[
                "Base de données complète de tous les établissements camerounais",
                "Calendrier centralisé des dates de concours",
                "Interface intuitive et facile à utiliser",
                "Mises à jour régulières des informations",
                "Comparaison facile entre les établissements",
                "Assistance et conseils pour vos choix"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-linear-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-indigo-500/30 p-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-600/30 rounded-lg flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Insights Précis</h3>
                  <p className="text-slate-400 text-sm">Données à jour sur tous les concours et établissements</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Réussir vos Concours</h3>
                  <p className="text-slate-400 text-sm">Planifiez et organisez votre parcours d&apos;admission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="bg-linear-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-indigo-500/30 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Prêt à commencer ?</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Explorez dès maintenant les établissements, filières et concours pour construire votre avenir académique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutelles"
              className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-105"
            >
              Parcourir les institutions <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all"
            >
              Voir le guide
            </Link>
          </div>
        </div>
      </section>

      {/* AUTH CALL TO ACTION */}
      <AuthCallToAction />

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Plateforme</h4>
              <ul className="space-y-2">
                <li><Link href="/news" className="text-slate-400 hover:text-white transition">Actualités</Link></li>
                <li><Link href="/explore" className="text-slate-400 hover:text-white transition">Institutions</Link></li>
                <li><Link href="/concours" className="text-slate-400 hover:text-white transition">Concours</Link></li>
                <li><Link href="/tutelles" className="text-slate-400 hover:text-white transition">Tutelles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><Link href="/guide" className="text-slate-400 hover:text-white transition">Guide</Link></li>
                <li><Link href="/faq" className="text-slate-400 hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition">À propos</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition">Confidentialité</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition">Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Suivez-nous</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-slate-400">© 2026 Concours-Camer. Tous les droits réservés.</p>
          </div>
        </div>
      </footer>
    </div >
  );
}
