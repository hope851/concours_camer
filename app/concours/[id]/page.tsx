import { GetConcoursById } from "@/app/action/newconcours";
import Navbar from "@/components/Navbar";
import {
    Calendar, MapPin, BookOpen, GraduationCap,
    Clock, ArrowLeft, Building2, Globe, AlertCircle,
    CheckCircle2, Info
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ConcoursDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const concours = await GetConcoursById(id);

    if (!concours) {
        notFound();
    }

    const formatDate = (date: Date | null) => {
        if (!date) return "À confirmer";
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    const now = new Date();
    const isClosed = new Date(concours.limiteDepot) < now;
    const daysLeft = Math.ceil(
        (new Date(concours.limiteDepot).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
                {/* Back Button */}
                <Link
                    href="/concours"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-12 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Tous les concours</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <header>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-black text-indigo-400 uppercase tracking-widest">
                                    {concours.ees.eesType}
                                </span>
                                {isClosed ? (
                                    <span className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-black text-rose-400 uppercase tracking-tighter">
                                        <AlertCircle size={14} /> Inscriptions Closes
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase tracking-tighter">
                                        <CheckCircle2 size={14} /> Inscriptions Ouvertes
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                                {concours.nomConcours}
                            </h1>

                            <div className="flex items-center gap-4 p-6 bg-white/3 border border-white/10 rounded-2xl backdrop-blur-sm">
                                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Établissement rattaché</p>
                                    <Link href={`/explore/${concours.eesId}`} className="text-white font-bold hover:text-indigo-400 transition-colors">
                                        {concours.ees.nomEes}
                                    </Link>
                                </div>
                            </div>
                        </header>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <Info className="text-indigo-400" />
                                À propos du concours
                            </h2>
                            <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap bg-white/5 p-8 rounded-[32px] border border-white/5">
                                {concours.concoursBio || "Aucune description détaillée n'a encore été fournie pour ce concours."}
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-linear-to-br from-indigo-600/10 to-transparent rounded-[32px] border border-white/5 flex flex-col gap-4">
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400">
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Diplôme Requis</h3>
                                    <p className="text-slate-400">{concours.diplomeRequis}</p>
                                </div>
                            </div>
                            <div className="p-8 bg-linear-to-br from-purple-600/10 to-transparent rounded-[32px] border border-white/5 flex flex-col gap-4">
                                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Lieu de l'Examen</h3>
                                    <p className="text-slate-400">{concours.adressExam || "Centre unique ou plusieurs centres (à vérifier sur le site officiel)"}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar - Quick Info */}
                    <div className="space-y-8">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] sticky top-32">
                            <h3 className="text-xl font-bold text-white mb-8">Dates importantes</h3>

                            <div className="space-y-8 relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/10" />

                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1 w-8 h-8 bg-slate-900 border-2 border-indigo-500 rounded-full flex items-center justify-center z-10">
                                        <Calendar size={14} className="text-indigo-400" />
                                    </div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Ouverture</p>
                                    <p className="text-white font-black">{formatDate(concours.dateOuverture)}</p>
                                </div>

                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1 w-8 h-8 bg-slate-900 border-2 border-rose-500 rounded-full flex items-center justify-center z-10">
                                        <Clock size={14} className="text-rose-400" />
                                    </div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Clôture des dépôts</p>
                                    <p className="text-white font-black">{formatDate(concours.limiteDepot)}</p>
                                    {!isClosed && (
                                        <p className="text-rose-400 text-xs mt-1 font-bold">Il reste {daysLeft} jours</p>
                                    )}
                                </div>

                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1 w-8 h-8 bg-slate-900 border-2 border-emerald-500 rounded-full flex items-center justify-center z-10">
                                        <ArrowLeft size={14} className="text-emerald-400 rotate-180" />
                                    </div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Examen écrit</p>
                                    <p className="text-white font-black">{formatDate(concours.dateExamEcrit)}</p>
                                </div>

                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1 w-8 h-8 bg-slate-900 border-2 border-cyan-500 rounded-full flex items-center justify-center z-10">
                                        <ArrowLeft size={14} className="text-cyan-400 rotate-180" />
                                    </div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Examen oral</p>
                                    <p className="text-white font-black">{formatDate(concours.dateExamOral)}</p>
                                </div>
                            </div>

                            {!isClosed && (
                                <Link
                                    href={concours.ees.siteEes || "#"}
                                    target="_blank"
                                    className="w-full mt-10 inline-flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    <Globe size={18} />
                                    Postuler en ligne
                                </Link>
                            )}

                            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Assurez-vous de vérifier les documents authentiques sur le site de la tutelle (<span className="text-slate-300 font-semibold">{concours.ees.tutelleInstitutionelle?.nomTutelle || 'N/A'}</span>) avant toute inscription.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
