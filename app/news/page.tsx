import { getNewsAction } from "@/app/action/news";
import Navbar from "@/components/Navbar";
import NewsFeed from "@/components/NewsFeed";
import { Clock, Newspaper, TrendingUp, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const allNews = await getNewsAction();

  const serializedNews = allNews.map((news) => ({
    ...news,
    createdAt: news.createdAt.toISOString(),
  }));

  const urgentCount = allNews.filter((n) => n.isUrgent).length;
  const categories = [...new Set(allNews.map((n) => n.category))];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in duration-700">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full bg-indigo-400 animate-ping opacity-50" />
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
            </div>
            Actualités en temps réel
          </div>

          {/* Titre */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none animate-in slide-in-from-bottom-6 duration-700 delay-100">
            Le portail de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              l&apos;information
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed font-medium animate-in fade-in duration-700 delay-200">
            Suivez en temps réel les communiqués officiels, les dates de concours et
            les opportunités académiques au Cameroun.
          </p>

          {/* Stats row */}
          {allNews.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-in fade-in duration-700 delay-300">
              {/* Total publications */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Newspaper size={16} className="text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white">{allNews.length}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Publication{allNews.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Urgentes */}
              {urgentCount > 0 && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-rose-500/20 rounded-xl flex items-center justify-center">
                    <Zap size={16} className="text-rose-400 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-white">{urgentCount}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Urgent{urgentCount > 1 ? "es" : ""}
                    </p>
                  </div>
                </div>
              )}

              {/* Catégories */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp size={16} className="text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white">{categories.length}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Catégorie{categories.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Dernière mise à jour */}
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                <Clock size={12} />
                Mis à jour en continu
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <NewsFeed allNews={serializedNews} />
      </div>
    </div>
  );
}
