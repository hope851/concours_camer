import { getNewsAction } from "@/app/action/news";
import Navbar from "@/components/Navbar";
import { Calendar, ArrowRight, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
// On importe ton nouveau composant à la place de next/image
import CloudinaryImage from "@/components/CloudinaryImage"; 

export default async function NewsPage() {
    const allNews = await getNewsAction();

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-125 h-125 bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                        <Clock size={14} />
                        Actualités et Opportunités
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Le portail de <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">l'information</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed">
                        Suivez en temps réel les communiqués officiels, les dates de concours et les opportunités académiques au Cameroun.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-20">
                {allNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allNews.map((news, idx) => (
                            <Link
                                key={news.id}
                                href={`/news/${news.slug}`}
                                className="group relative flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Image Thumbnail utilisant CloudinaryImage */}
                                {news.image && (
                                    <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
                                        <CloudinaryImage
                                            src={news.image}
                                            alt={news.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent opacity-60" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative p-8 flex flex-col h-full z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                                            {news.category}
                                        </span>
                                        {news.isUrgent && (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-black text-rose-400 uppercase tracking-tighter animate-pulse">
                                                <AlertCircle size={12} /> Urgent
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-tight">
                                        {news.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                                        {news.excerpt}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                            <Calendar size={14} className="text-indigo-500/50" />
                                            {formatDate(news.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1 text-indigo-400 font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                                            Lire <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-white/2 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-400">
                            <Clock size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3">Aucune actualité</h2>
                        <p className="text-slate-500 max-w-xs mx-auto font-medium">Revenez bientôt pour ne rien manquer.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
