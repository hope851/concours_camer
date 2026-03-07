import { getNewsBySlugAction } from "@/app/action/news";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Calendar, Tag, ExternalLink, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
// Importe ton composant personnalisé qui gère déjà le loader côté client
import CloudinaryImage from "@/components/CloudinaryImage"; 

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    // Correction de l'accès aux params (Next.js 15+ nécessite await)
    const { slug } = await params;
    const news = await getNewsBySlugAction(slug);

    if (!news) {
        notFound();
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                {/* Back Button */}
                <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-12 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Retour aux actualités</span>
                </Link>

                {/* Article Header */}
                <header className="mb-16">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                            {news.category}
                        </span>
                        {news.isUrgent && (
                            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-black text-rose-400 uppercase tracking-tighter animate-pulse">
                                <AlertCircle size={14} /> Urgent
                            </span>
                        )}
                        <span className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <Calendar size={14} className="text-indigo-500/50" />
                            {formatDate(news.createdAt)}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black text-white mb-10 leading-[1.1] tracking-tighter">
                        {news.title}
                    </h1>

                    {news.image && (
                        <div className="relative w-full h-100 mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                            {/* REMPLACÉ : On utilise CloudinaryImage sans passer de prop loader ici */}
                            <CloudinaryImage
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent" />
                        </div>
                    )}

                    <div className="p-8 bg-white/3 backdrop-blur-xl border-l-[6px] border-indigo-500 rounded-2xl rounded-l-none italic text-slate-300 text-xl leading-relaxed">
                        {news.excerpt}
                    </div>
                </header>

                {/* Article Content */}
                <article className="prose prose-invert prose-indigo max-w-none mb-24">
                    <div className="text-slate-300 text-lg md:text-xl leading-[1.8] space-y-8 whitespace-pre-wrap font-medium">
                        {news.content}
                    </div>
                </article>

                {/* Footer Section */}
                <footer className="pt-16 border-t border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-linear-to-br from-indigo-600/10 via-white/5 to-transparent rounded-[40px] border border-white/10 backdrop-blur-md">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <Tag size={18} />
                                </div>
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">Source officielle</h4>
                            </div>
                            <p className="text-slate-400 text-base leading-relaxed">
                                Cet article est basé sur les informations fournies par :
                                <span className="text-white font-bold ml-1.5 border-b-2 border-indigo-500/30">
                                    {news.sourceName || "Source Gouvernementale"}
                                </span>
                            </p>
                        </div>
                        {news.sourceUrl && (
                            <a
                                href={news.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all"
                            >
                                <ExternalLink size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                Visiter le site
                            </a>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}
