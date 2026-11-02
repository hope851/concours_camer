import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MapPin,
  Users,
  Zap,
  Calendar,
  Clock,
  AlertCircle,
  GraduationCap,
  Building2,
  ExternalLink,
  ChevronRight,
  Flame,
  ShieldCheck,
  FileCheck2,
  School,
  Sparkles,
  Radio,
  Newspaper
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ConcoursCalendar from "@/components/ConcoursCalendar";
import AuthCallToAction from "@/components/AuthCallToAction";
import CloudinaryImage from "@/components/CloudinaryImage";
import LandingSearch from "@/components/LandingSearch";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [eesCount, filiereCount, concoursCount, tutelleCount, allConcours, latestNews, topEES] = await Promise.all([
      prisma.ees.count(),
      prisma.programme.count(),
      prisma.sessionAdmission.count(),
      prisma.tutelleInstitutionelle.count(),
      prisma.sessionAdmission.findMany({
        where: { etat: true },
        include: {
          ees: {
            select: {
              id: true,
              nomEes: true,
              eesType: true,
              ville: { select: { nomVille: true } },
              tutelleInstitutionelle: { select: { nomTutelle: true } }
            }
          }
        },
        orderBy: { limiteDepot: "asc" }
      }),
      prisma.news.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          ees: { select: { id: true, nomEes: true } },
          tutelle: { select: { id: true, nomTutelle: true } }
        }
      }).catch((err) => {
        console.warn("News query error:", err);
        return [];
      }),
      prisma.ees.findMany({
        take: 6,
        include: {
          tutelleInstitutionelle: true,
          ville: true,
          _count: { select: { programme: true, sessionAdmission: true } }
        }
      })
    ]);

    return {
      eesCount,
      filiereCount,
      concoursCount,
      tutelleCount,
      allConcours,
      latestNews,
      topEES
    };
  } catch (error) {
    console.error("Erreur stats homepage:", error);
    return {
      eesCount: 0,
      filiereCount: 0,
      concoursCount: 0,
      tutelleCount: 0,
      allConcours: [],
      latestNews: [],
      topEES: []
    };
  }
}

function formatDateFr(date: Date | string | null | undefined) {
  if (!date) return "Date à confirmer";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function formatFullDateFr(date: Date | string | null | undefined) {
  if (!date) return "Date à confirmer";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

function getDaysRemaining(targetDate: Date | string) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diffDays;
}

const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  Concours: { bg: "bg-indigo-500/15", border: "border-indigo-500/30", text: "text-indigo-300" },
  Admission: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-300" },
  Bourse: { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-300" },
  Autre: { bg: "bg-slate-500/15", border: "border-slate-500/30", text: "text-slate-300" }
};

export default async function Home() {
  const stats = await getStats();
  const featuredArticle = stats.latestNews[0];
  const sideArticles = stats.latestNews.slice(1, 4);
  const urgentArticle = stats.latestNews.find((n) => n.isUrgent) || featuredArticle;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-indigo-500/30">
      <Navbar />

      {/* 🔴 BANDEAU DÉPÊCHE FLASH EN CONTINU (LIVE TICKER) */}
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider text-rose-300 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                Flash Concours
              </span>

              <p className="min-w-0 flex-1 text-slate-300 truncate font-medium">
                {urgentArticle ? (
                  <Link
                    href={`/news/${urgentArticle.slug}`}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-2"
                  >
                    <span className="font-bold text-white">News :</span>
                    <span className="min-w-0 truncate">{urgentArticle.title}</span>
                  </Link>
                ) : (
                  <span>Portail officiel d&apos;orientation & des concours d&apos;entrée au Cameroun</span>
                )}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-400 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio size={12} className="animate-pulse" />
                Sessions 2026/2027
              </span>
              <span className="text-slate-600">•</span>
              <Link href="/concours" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                Toutes les sessions d'admissions <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 📰 GRAND PORTAIL ÉDITORIAL : LA UNE & LES GRANDES ACTUALITÉS (HERO REMPLACÉ) */}
      <section className="relative pt-8 pb-16 border-b border-white/5 bg-linear-to-b from-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête éditorial */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-3">
                <Newspaper size={14} />
                Édition Spéciale Admissions Cameroun
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Grandes Actualités & Concours d&apos;État
              </h1>
              <p className="text-slate-400 text-sm md:text-base mt-1 font-medium">
                Communiqués ministériels, avis d&apos;ouverture des sessions et calendrier des épreuves.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/news"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white transition-all flex items-center gap-2"
              >
                Fil d&apos;actualité ({stats.latestNews.length})
                <ChevronRight size={14} />
              </Link>
              <Link
                href="#calendrier"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Calendar size={14} />
                Calendrier
              </Link>
            </div>
          </div>

          {/* Grille Magazine : La Grande Une (2/3) + Dépêches En Direct (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 🌟 LA GRANDE UNE (Article Majeur) */}
            {featuredArticle ? (
              <div className="lg:col-span-8 flex">
                <div className="group relative w-full rounded-3xl overflow-hidden bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between shadow-2xl">
                  {/* Photo de fond si disponible ou motif prestigieux */}
                  {featuredArticle.image ? (
                    <div className="absolute inset-0 z-0">
                      <CloudinaryImage
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover opacity-35 group-hover:opacity-45 group-hover:scale-105 transition-all duration-700"
                        priority
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0 bg-linear-to-br from-indigo-950/60 via-slate-900 to-slate-950 opacity-90">
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage:
                            "radial-gradient(#ffffff 1px, transparent 1px)",
                          backgroundSize: "24px 24px"
                        }}
                      />
                    </div>
                  )}

                  {/* Effets lumineux subtils */}
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Contenu de la Grande Une */}
                  <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Ligne des badges */}
                      <div className="flex flex-wrap items-center gap-2.5 mb-6">
                        <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-widest shadow-sm">
                          {featuredArticle.category}
                        </span>

                        {featuredArticle.isUrgent && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-widest animate-pulse">
                            <AlertCircle size={12} />
                            Urgent
                          </span>
                        )}

                        <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5 ml-auto">
                          <Clock size={12} className="text-slate-500" />
                          {formatFullDateFr(featuredArticle.createdAt)}
                        </span>
                      </div>

                      {/* Grand Titre */}
                      <Link href={`/news/${featuredArticle.slug}`}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight hover:text-indigo-300 transition-colors mb-5">
                          {featuredArticle.title}
                        </h2>
                      </Link>

                      {/* Extrait / Résumé */}
                      <p className="text-slate-300 text-base md:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed font-normal max-w-3xl mb-6">
                        {featuredArticle.excerpt}
                      </p>

                      {/* Metadonnées institutionnelles */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
                        {featuredArticle.sourceName && (
                          <span className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/50 px-3 py-1.5 rounded-lg border border-indigo-800/40">
                            <ShieldCheck size={14} />
                            Source : {featuredArticle.sourceName}
                          </span>
                        )}
                        {featuredArticle.ees && (
                          <span className="flex items-center gap-1.5 text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <GraduationCap size={14} className="text-indigo-400" />
                            {featuredArticle.ees.nomEes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions de lecture */}
                    <div className="pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <Link
                        href={`/news/${featuredArticle.slug}`}
                        className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 hover:gap-3.5"
                      >
                        Plus de détail
                        <ArrowRight size={16} />
                      </Link>

                      {/* <div className="flex items-center gap-2">
                        <Link
                          href="/concours"
                          className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                        >
                          Voir les concours ouverts
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-8 flex">
                <div className="w-full rounded-3xl overflow-hidden bg-slate-900/90 border border-white/10 p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-2.5 mb-5">
                      <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-widest">
                        Portail Officiel d&apos;Orientation
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">Sessions Académiques 2026/2027</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                      Portail des Concours & Formations Universitaires au Cameroun
                    </h2>

                    <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                      Découvrez les établissements d&apos;enseignement supérieur sous tutelle, anticipez les dates clés des sessions d&apos;admission et préparez vos dossiers sans risque de rejet. Les communiqués ministériels et arrêtés récents paraîtront ici en temps réel.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/explore"
                        className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                      >
                        Explorer les institutions
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        href="/guide"
                        className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                      >
                        Consulter le guide officiel
                      </Link>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 mt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Données alignées avec les universités d&apos;État et le MINESUP
                    </span>
                    <Link href="/formnews" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                      + Publier un communiqué →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 📋 COLONNE LATÉRALE : DÉPÊCHES & EN DIRECT */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 mb-1">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {sideArticles.length > 0 ? "Dernières Dépêches" : "Orientation & Alertes"}
                </span>
                {/* <Link
                  href="/profile"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  Tout afficher <ArrowRight size={12} />
                </Link> */}
              </div>

              {sideArticles.length > 0 ? (
                sideArticles.map((item) => {
                  const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Autre;
                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${catStyle.bg} ${catStyle.border} ${catStyle.text}`}
                          >
                            {item.category}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {formatDateFr(item.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-slate-400 group-hover:text-indigo-300">
                        <span>Consulter la dépêche</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/concours"
                    className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-indigo-500/40 transition-all flex items-start gap-3.5 block"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        Surveillance des Concours
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Consultez la liste des sessions d&apos;admission dès publication des arrêtés d&apos;ouverture.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="#calendrier"
                    className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-indigo-500/40 transition-all flex items-start gap-3.5 block"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        Calendrier Interactif
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Visualisez les dates limites de dépôt et les jours de composition mois par mois.
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Raccourci vers le guide pratique */}
              <Link
                href="/guide"
                className="p-5 rounded-2xl bg-linear-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 hover:border-indigo-400/50 transition-all flex items-center justify-between group mt-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                    <FileCheck2 size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs">Guide officiel du candidat</p>
                    <p className="text-slate-400 text-[11px]">Timbres, légalisation & pièces exigées</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 CONSOLE DE RECHERCHE RAPIDE & CHIFFRES DU PORTAIL */}
      <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/95 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Barre de recherche interactive */}
            <div className="lg:col-span-7">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-1.5">
                <Sparkles size={14} />
                Accès Rapide & Orientation Directe
              </p>
              <h2 className="text-xl md:text-2xl font-black text-white mb-4">
                Recherchez votre établissement, concours ou filière
              </h2>
              <LandingSearch />

              {/* Suggestions / Filtres rapides */}
              <div className="flex flex-wrap gap-2 mt-4 text-xs">
                <span className="text-slate-500 self-center font-bold text-[11px]">Accès direct :</span>
                <Link
                  href="/concours"
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  ⚡ Concours ouverts
                </Link>
                <Link
                  href="/explore"
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  🏛️ Grandes Écoles
                </Link>
                <Link
                  href="/tutelles"
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  🎓 Universités d&apos;État
                </Link>
                <Link
                  href="/news"
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  🌍 Bourses 2026
                </Link>
              </div>
            </div>

            {/* Ruban Métrique Réel (Données concrètes) */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl md:text-3xl font-black text-white">{stats.eesCount}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">Établissements</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Grandes écoles & facs</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <p className="text-2xl md:text-3xl font-black text-indigo-400">{stats.concoursCount}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-300 mt-1">Concours Actifs</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Sessions en cours</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl md:text-3xl font-black text-white">{stats.tutelleCount}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">Tutelles</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Universités d&apos;État</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 SECTION CONCOURS EN COURS & ÉCHÉANCES IMMINENTES */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">
              <Flame size={14} />
              Candidatures Ouvertes
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Concours Actifs & Prochaines Échéances
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Ne manquez aucune date limite de dépôt de dossiers et d&apos;épreuves écrites.
            </p>
          </div>

          <Link
            href="/concours"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Explorer tous les concours ({stats.allConcours.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats.allConcours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.allConcours.slice(0, 6).map((concours) => {
              const daysLeft = getDaysRemaining(concours.limiteDepot);
              const isUrgentLimit = daysLeft <= 15 && daysLeft >= 0;
              const isClosed = daysLeft < 0;

              return (
                <div
                  key={concours.id}
                  className="group rounded-3xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div>
                    {/* Top status */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                        {concours.ees?.eesType || "PUBLIC"}
                      </span>

                      {isClosed ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                          Dépôts Clos
                        </span>
                      ) : isUrgentLimit ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse">
                          Clôture J-{daysLeft}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                          ● En cours
                        </span>
                      )}
                    </div>

                    {/* Titre du concours */}
                    <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors mb-2 leading-snug">
                      {concours.nomConcours}
                    </h3>

                    {/* École & Ville */}
                    <p className="text-xs font-bold text-indigo-400 mb-4 flex items-center gap-1.5">
                      <GraduationCap size={14} />
                      {concours.ees?.nomEes}
                    </p>

                    {/* Détails clés */}
                    <div className="space-y-2.5 py-3 border-y border-white/5 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-semibold">Diplôme requis :</span>
                        <span className="font-bold text-white text-right truncate max-w-[180px]">
                          {concours.diplomeRequis}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-semibold">Clôture des dépôts :</span>
                        <span className="font-black text-rose-300 flex items-center gap-1">
                          <Clock size={12} />
                          {formatDateFr(concours.limiteDepot)}
                        </span>
                      </div>

                      {concours.dateExamEcrit && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[11px] font-semibold">Épreuves écrites :</span>
                          <span className="font-bold text-white flex items-center gap-1">
                            <Calendar size={12} className="text-indigo-400" />
                            {formatDateFr(concours.dateExamEcrit)}
                          </span>
                        </div>
                      )}
                    </div>

                    {concours.adressExam && (
                      <p className="text-[11px] text-slate-400 mt-3 flex items-start gap-1.5">
                        <MapPin size={12} className="text-rose-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{concours.adressExam}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <Link
                      href={`/concours/${concours.id}`}
                      className="flex-1 text-center py-2.5 px-4 rounded-xl bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 hover:border-transparent text-xs font-black uppercase tracking-wider text-slate-300 transition-all"
                    >
                      Détails du concours
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-900 border border-white/10 text-center">
            <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-white font-bold text-lg">Aucun concours ouvert répertorié actuellement</h3>
            <p className="text-slate-400 text-sm mt-1">Consultez régulièrement notre page pour les nouvelles parutions d&apos;arrêtés.</p>
          </div>
        )}
      </section>

      {/* 🏛️ GRANDES ÉCOLES & PÔLES UNIVERSITAIRES CAMEROUNAIS */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">
              <School size={14} />
              Enseignement Supérieur
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Grandes Écoles & Facultés de Référence
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Universités d&apos;État, instituts technologiques et centres d&apos;excellence académique.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Voir tous les établissements ({stats.eesCount})
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.topEES.map((ees) => (
            <Link
              key={ees.id}
              href={`/explore/${ees.id}`}
              className="group rounded-3xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                    {ees.eesType || "PUBLIC"}
                  </span>
                  <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                    <MapPin size={12} className="text-rose-400" />
                    {ees.ville?.nomVille || "Cameroun"}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors mb-2 leading-snug">
                  {ees.nomEes}
                </h3>

                <p className="text-xs text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Building2 size={13} className="text-amber-400" />
                  Tutelle : {ees.tutelleInstitutionelle?.nomTutelle || "Université d'État"}
                </p>

                {ees.eesBio && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {ees.eesBio}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Concours</p>
                    <p className="text-white font-black text-base">{ees._count?.sessionAdmission || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Filières</p>
                    <p className="text-white font-black text-base">{ees._count?.programme || 0}</p>
                  </div>
                </div>

                <span className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 📅 CALENDRIER & CHRONOGRAMME INTERACTIF */}
      <section id="calendrier" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-24">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">
            <Calendar size={14} />
            Chronogramme 2026/2027
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Calendrier Officiel des Épreuves & Dépôts
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Naviguez mois par mois pour visualiser les dates de composition et les fermetures des registres.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <ConcoursCalendar concours={stats.allConcours} />
        </div>
      </section>

      {/* 📋 DOSSIER DU CANDIDAT & CONSEILS PRATIQUES (GUIDE CAMEROUNAIS CONCRET) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">
            <FileCheck2 size={14} />
            Guide Pratique Officiel
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Comment Réussir sa Candidature au différente session d'admission 
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Les pièces obligatoires et les règles indispensables pour éviter tout rejet de dossier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4 font-black text-lg">
              01
            </div>
            <h3 className="text-base font-black text-white mb-2">Pièces Administratives</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fiche d&apos;inscription timbrée à 1 500 FCFA, acte de naissance légalisé datant de moins de 3 mois et photos d&apos;identité 4x4.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-4 font-black text-lg">
              02
            </div>
            <h3 className="text-base font-black text-white mb-2">Certificat Médical Public</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Le certificat médical doit obligatoirement être délivré par un médecin exerçant dans une formation sanitaire publique.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-4 font-black text-lg">
              03
            </div>
            <h3 className="text-base font-black text-white mb-2">Centres Régionaux</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Renseignez avec soin votre centre d&apos;examen (Yaoundé, Douala, Bafoussam, Garoua, Buea, etc.) pour composer près de chez vous.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-4 font-black text-lg">
              04
            </div>
            <h3 className="text-base font-black text-white mb-2">Délais & Quittances</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conservez précieusement le reçu bancaire ou de paiement en ligne attestant le règlement des droits de concours.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-200 hover:text-white transition-all"
          >
            Consulter le guide complet d&apos;orientation
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 🔐 AUTH CALL TO ACTION */}
      <AuthCallToAction />

      {/* 🏛️ FOOTER OFFICIEL */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-4">Actualités & Concours</h4>
              <ul className="space-y-2">
                <li><Link href="/news" className="hover:text-white transition">Toutes les actualités</Link></li>
                <li><Link href="/concours" className="hover:text-white transition">Concours ouverts</Link></li>
                <li><Link href="#calendrier" className="hover:text-white transition">Calendrier officiel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-4">Institutions</h4>
              <ul className="space-y-2">
                <li><Link href="/explore" className="hover:text-white transition">Grandes Écoles</Link></li>
                <li><Link href="/tutelles" className="hover:text-white transition">Universités d&apos;État</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-4">Orientation</h4>
              <ul className="space-y-2">
                <li><Link href="/guide" className="hover:text-white transition">Guide du Candidat</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">Foire aux questions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-4">À Propos</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition">La plateforme</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Nous contacter</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-4">Mentions Légales</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Conditions d&apos;utilisation</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 Concours-Camer. Plateforme d&apos;information sur l&apos;enseignement supérieur au Cameroun.</p>
            <p className="text-slate-500">Mises à jour conformes aux arrêtés du Ministère de l&apos;Enseignement Supérieur (MINESUP).</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
