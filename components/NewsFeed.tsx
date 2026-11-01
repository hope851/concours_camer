"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Zap,
  Search,
  X,
} from "lucide-react";
import CloudinaryImage from "@/components/CloudinaryImage";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string | null;
  isUrgent: boolean;
  createdAt: string | Date;
  ees?: { id: string; nomEes: string } | null;
  tutelle?: { id: string; nomTutelle: string } | null;
  programme?: { id: string; nomProgramme: string; niveau: string } | null;
};

const CATEGORIES = ["Tous", "Concours", "Admission", "Bourse", "Autre"] as const;

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Concours: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", dot: "bg-indigo-400" },
  Admission: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
  Bourse: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" },
  Autre: { bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-400", dot: "bg-slate-400" },
};

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatRelativeDate(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return formatDate(date);
}

function RelatedBadge({ news }: { news: NewsItem }) {
  if (news.ees) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-300 uppercase tracking-wider">
        <GraduationCap size={10} />
        {news.ees.nomEes}
      </span>
    );
  }
  if (news.tutelle) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-300 uppercase tracking-wider">
        <Building2 size={10} />
        {news.tutelle.nomTutelle}
      </span>
    );
  }
  if (news.programme) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-black text-violet-300 uppercase tracking-wider">
        <Sparkles size={10} />
        {news.programme.nomProgramme}
      </span>
    );
  }
  return null;
}

// Hook: Intersection Observer pour animations d'entrée
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// Card Hero (à la une)
function HeroCard({ news }: { news: NewsItem }) {
  const { ref, visible } = useReveal();
  const catColor = CATEGORY_COLORS[news.category] ?? CATEGORY_COLORS["Autre"];

  return (
    <Link
      href={`/news/${news.slug}`}
      ref={ref as React.Ref<HTMLAnchorElement>}
      style={{ transitionDuration: "700ms" }}
      className={`group relative flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1 min-h-[480px] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Image */}
      <div className="relative md:w-1/2 h-72 md:h-auto overflow-hidden flex-shrink-0">
        {news.image ? (
          <>
            <CloudinaryImage
              src={news.image}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80 md:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent md:hidden block" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-slate-950 flex items-center justify-center">
            <Sparkles size={64} className="text-indigo-500/30" />
          </div>
        )}
        {news.isUrgent && (
          <div className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-rose-500/90 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Urgent
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 md:w-1/2">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className={`px-3 py-1.5 ${catColor.bg} border ${catColor.border} rounded-full text-[10px] font-black ${catColor.text} uppercase tracking-[0.2em] flex items-center gap-1.5`}>
            <span className={`w-1.5 h-1.5 rounded-full ${catColor.dot}`} />
            {news.category}
          </span>
          <RelatedBadge news={news} />
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-white mb-5 group-hover:text-indigo-300 transition-colors leading-tight tracking-tight line-clamp-3">
          {news.title}
        </h2>

        <p className="text-slate-400 leading-relaxed font-medium text-base line-clamp-3 mb-8">
          {news.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Calendar size={14} className="text-indigo-500/50" />
            {formatRelativeDate(news.createdAt)}
          </div>
          <span className="inline-flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
            Lire l'article <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Card standard
function NewsCard({
  news,
  index,
  variant = "default",
}: {
  news: NewsItem;
  index: number;
  variant?: "default" | "compact" | "wide";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const catColor = CATEGORY_COLORS[news.category] ?? CATEGORY_COLORS["Autre"];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isWide = variant === "wide";
  const isCompact = variant === "compact";

  return (
    <Link
      ref={ref}
      href={`/news/${news.slug}`}
      style={{ transitionDelay: `${Math.min(index * 60, 300)}ms`, transitionDuration: "600ms" }}
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${isWide ? "md:col-span-2 md:flex-row" : ""}`}
    >
      {/* Image */}
      {news.image && (
        <div className={`relative overflow-hidden flex-shrink-0 ${
          isWide ? "md:w-2/5 h-48 md:h-auto" : isCompact ? "h-40" : "h-52"
        }`}>
          <CloudinaryImage
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          {news.isUrgent && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/90 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-wider animate-pulse">
              <AlertCircle size={10} />
              Urgent
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 flex flex-col h-full ${isWide ? "p-8 justify-center" : "p-6"}`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 ${catColor.bg} border ${catColor.border} rounded-full text-[9px] font-black ${catColor.text} uppercase tracking-[0.2em] flex items-center gap-1`}>
            <span className={`w-1 h-1 rounded-full ${catColor.dot}`} />
            {news.category}
          </span>
          <RelatedBadge news={news} />
        </div>

        <h3 className={`font-black text-white mb-2 group-hover:text-indigo-300 transition-colors leading-tight ${
          isWide ? "text-xl md:text-2xl line-clamp-2" : isCompact ? "text-base line-clamp-2" : "text-lg line-clamp-2"
        }`}>
          {news.title}
        </h3>

        <p className={`text-slate-400 leading-relaxed font-medium ${
          isWide ? "text-sm line-clamp-3 mb-6" : isCompact ? "text-xs line-clamp-2 mb-4" : "text-sm line-clamp-2 mb-5"
        }`}>
          {news.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <Clock size={12} className="text-indigo-500/50" />
            {formatRelativeDate(news.createdAt)}
          </div>
          <span className="inline-flex items-center gap-1 text-indigo-400 font-black text-[10px] uppercase tracking-widest group-hover:gap-2 transition-all">
            Lire <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Skeleton loader
function NewsSkeletonCard() {
  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 bg-white/5 rounded-full" />
        <div className="h-5 w-full bg-white/5 rounded-lg" />
        <div className="h-5 w-3/4 bg-white/5 rounded-lg" />
        <div className="h-3 w-full bg-white/5 rounded-lg mt-2" />
        <div className="h-3 w-2/3 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
}

// Ticker d'urgences
function UrgentTicker({ urgents }: { urgents: NewsItem[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (urgents.length < 2) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % urgents.length), 4000);
    return () => clearInterval(timer);
  }, [urgents.length]);

  if (!urgents.length) return null;
  const current = urgents[idx];

  return (
    <div className="flex items-center gap-0 overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 mb-8">
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-rose-500/20 border-r border-rose-500/20">
        <Zap size={14} className="text-rose-400 animate-pulse" />
        <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em] whitespace-nowrap">
          Urgent
        </span>
      </div>
      <Link
        href={`/news/${current.slug}`}
        className="flex-1 px-5 py-3 text-sm font-bold text-slate-300 hover:text-white transition-colors truncate"
        key={current.id}
      >
        <span className="animate-in fade-in duration-500 block truncate">{current.title}</span>
      </Link>
      <span className="flex-shrink-0 px-4 text-[9px] text-rose-400/60 font-black">
        {idx + 1}/{urgents.length}
      </span>
    </div>
  );
}

export default function NewsFeed({ allNews }: { allNews: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filteredNews = useMemo(() => {
    let result = allNews;
    if (activeCategory !== "Tous") {
      result = result.filter((n) => n.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.ees?.nomEes?.toLowerCase().includes(q) ||
          n.tutelle?.nomTutelle?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allNews, activeCategory, searchQuery]);

  const urgents = useMemo(() => allNews.filter((n) => n.isUrgent), [allNews]);
  const featured = filteredNews.find((n) => n.isUrgent) ?? filteredNews[0];
  const rest = filteredNews.filter((n) => n.id !== featured?.id);
  const visibleRest = rest.slice(0, visibleCount);

  // Changer catégorie avec animation
  const handleCategoryChange = useCallback((cat: (typeof CATEGORIES)[number]) => {
    setIsChangingCategory(true);
    setActiveCategory(cat);
    setVisibleCount(9);
    setTimeout(() => setIsChangingCategory(false), 300);
  }, []);

  // Reset count on filter change
  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory, searchQuery]);

  // Infinite scroll
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || visibleCount >= rest.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 6, rest.length));
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, rest.length]);

  // Catégories avec comptage
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Tous: allNews.length };
    allNews.forEach((n) => {
      counts[n.category] = (counts[n.category] || 0) + 1;
    });
    return counts;
  }, [allNews]);

  if (allNews.length === 0) {
    return (
      <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm">
        <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-400">
          <Clock size={40} />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Aucune actualité</h2>
        <p className="text-slate-500 max-w-xs mx-auto font-medium">
          Revenez bientôt pour ne rien manquer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Ticker urgences */}
      <UrgentTicker urgents={urgents} />

      {/* Barre de recherche + filtres sticky */}
      <div className="sticky top-20 z-30 -mx-4 px-4 py-4 bg-slate-950/90 backdrop-blur-2xl border-y border-white/5 shadow-lg shadow-slate-950/50">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Recherche */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher une actualité, un établissement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filtres catégories */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : "bg-white/5 text-slate-400 border border-white/10 hover:border-indigo-500/30 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {cat}
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Stats à droite */}
            <div className="ml-auto flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <TrendingUp size={12} className="text-indigo-400" />
              <span className="text-indigo-400">{filteredNews.length}</span>
              résultat{filteredNews.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Résultats avec transition */}
      <div
        className={`transition-all duration-300 ${
          isChangingCategory ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Article vedette */}
        {featured && !searchQuery && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2">
                <Sparkles size={12} />
                À la une
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            </div>
            <HeroCard news={featured} />
          </div>
        )}

        {/* Résultats de recherche (sans featured) */}
        {searchQuery && featured && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NewsCard key={featured.id} news={featured} index={0} />
              {visibleRest.map((news, idx) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  index={idx + 1}
                  variant={idx % 7 === 2 ? "wide" : "default"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grille des autres articles */}
        {!searchQuery && visibleRest.length > 0 && (
          <div>
            {rest.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                  Toutes les actualités
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visibleRest.map((news, idx) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  index={idx}
                  variant={idx % 7 === 2 ? "wide" : "default"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Vide */}
        {filteredNews.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
            <Search size={40} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-lg mb-2">Aucun résultat trouvé</p>
            <p className="text-slate-600 text-sm font-medium">
              {searchQuery
                ? `Aucune actualité ne correspond à "${searchQuery}"`
                : "Aucune actualité dans cette catégorie"}
            </p>
            <button
              onClick={() => { setSearchQuery(""); handleCategoryChange("Tous"); }}
              className="mt-6 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-2xl text-indigo-400 text-xs font-black uppercase tracking-widest transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Chargement (infinite scroll sentinel) */}
        {!searchQuery && visibleCount < rest.length && (
          <div ref={loadMoreRef} className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <NewsSkeletonCard key={i} />
                ))}
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest mt-4">
                <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                Chargement de la suite...
              </div>
            </div>
          </div>
        )}

        {/* Fin de liste */}
        {!searchQuery && visibleCount >= rest.length && rest.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-3 px-8 py-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <Sparkles size={20} className="text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                Vous avez tout lu — {filteredNews.length} article{filteredNews.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
