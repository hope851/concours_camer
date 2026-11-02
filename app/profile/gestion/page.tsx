'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GetCurrentUser, GetMyEES } from '@/app/action/user';
import { GetMyConcours, ToggleConcoursStatus, GetMyFilieres, DeleteFiliere } from '@/app/action/gestion';
import { GetTutelles } from '@/app/action/newtutelle';
import { deleteNewsAction, getNewsAction } from '@/app/action/news';
import Link from 'next/link';
import {
    School, Plus, Edit3, Trash2,
    Loader2, MapPin, Newspaper, Calendar,
    LayoutGrid, BookOpen, CheckCircle2,
    XCircle, ChevronRight, BarChart3,
    Settings, Globe, ArrowRight, ArrowLeft, Building2
} from 'lucide-react';
import Navbar from '@/components/Navbar';

function GestionnaireContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nom_tutelle = searchParams.get('nom_tutelle') || "Ma Tutelle";

    const [stats, setStats] = useState({ ees: 0, concours: 0, news: 0 });
    const [eesList, setEesList] = useState<any[]>([]);
    const [concoursList, setConcoursList] = useState<any[]>([]);
    const [newsList, setNewsList] = useState<any[]>([]);
    const [tutelles, setTutelles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ees' | 'news' | 'concours'>('ees');
    const [showTutelleModal, setShowTutelleModal] = useState(false);
    const [user, setUser] = useState<any>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const userData = await GetCurrentUser();
            if (!userData || (userData.role !== 'GESTIONAIRE' && userData.role !== 'ADMIN')) {
                router.replace('/profile');
                return;
            }
            setUser(userData);

            const [eesData, newsData, concoursData, allTutelles] = await Promise.all([
                GetMyEES(),
                getNewsAction(),
                GetMyConcours(),
                GetTutelles()
            ]);

            setEesList(eesData || []);
            setNewsList(newsData || []);
            setConcoursList(concoursData || []);
            setTutelles(allTutelles || []);
            setStats({
                ees: eesData?.length || 0,
                concours: concoursData?.length || 0,
                news: newsData?.length || 0
            });
        } catch (error) {
            console.error("Erreur chargement gestionnaire:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDeleteNews = async (id: string) => {
        if (confirm("Confirmer la suppression de cette actualité ?")) {
            await deleteNewsAction(id);
            loadData();
        }
    };

    const handleToggleConcours = async (id: string, etat: boolean) => {
        await ToggleConcoursStatus(id, etat);
        loadData();
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-purple-500" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Initialisation de l'espace de gestion...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
            <Navbar />

            <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Retour au profil</span>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-purple-400">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <BarChart3 size={20} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-[0.3em]">
                                {eesList[0]?.tutelleInstitutionelle?.nomTutelle || nom_tutelle}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">Espace Gestion</h1>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Établissements gérés', value: stats.ees, icon: School, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                        { label: 'Concours Actifs', value: stats.concours, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { label: 'Actualités', value: stats.news, icon: Newspaper, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-8 rounded-[32px] border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-4xl font-black text-white">{stat.value}</p>
                            </div>
                            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 mb-10 w-fit">
                    {(['ees', 'concours', 'news'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab === 'ees' ? 'Établissements' : tab === 'news' ? 'Actualités' : 'Concours'}
                        </button>
                    ))}
                </div>

                {/* CONTENT SECTIONS */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* SECTION EES */}
                    {activeTab === 'ees' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-6 rounded-[32px] border border-white/5 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                        <School className="text-indigo-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white">Vos Établissements Rattachés</h2>
                                        <p className="text-slate-500 text-xs font-medium">Gérez vos institutions et leurs filières d'admission</p>
                                    </div>
                                </div>
                                {user?.role === 'ADMIN' && (
                                    <button
                                        onClick={() => {
                                            if (eesList.length > 0) {
                                                window.location.href = `/formees?tutelle_id=${eesList[0].tutelleId}&nom=${encodeURIComponent(nom_tutelle)}`;
                                            } else {
                                                setShowTutelleModal(true);
                                            }
                                        }}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                                    >
                                        <Plus size={18} /> Ajouter un EES
                                    </button>
                                )}
                            </div>

                            {/* Modal de sélection de tutelle */}
                            {showTutelleModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                                    <div className="glass-card w-full max-w-lg rounded-[40px] border-white/10 shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500">
                                        <div className="p-10 border-b border-white/5 bg-white/2">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-2xl font-black text-white tracking-tighter">Choisir une Institution</h3>
                                                <button onClick={() => setShowTutelleModal(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                                                    <XCircle size={24} />
                                                </button>
                                            </div>
                                            <p className="text-slate-400 text-sm font-medium">Sélectionnez l'établissement sous lequel ce nouvel EES sera rattaché.</p>
                                        </div>
                                        <div className="p-6 max-h-100 overflow-y-auto space-y-2">
                                            {tutelles.map((t) => (
                                                <Link
                                                    key={t.id}
                                                    href={`/formees?tutelle_id=${t.id}&nom=${encodeURIComponent(t.nomTutelle)}`}
                                                    className="flex items-center justify-between p-5 rounded-3xl bg-white/3 hover:bg-indigo-600 border border-white/5 hover:border-indigo-500 transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/10">
                                                            <Building2 size={20} />
                                                        </div>
                                                        <span className="text-white font-bold tracking-tight text-sm">{t.nomTutelle}</span>
                                                    </div>
                                                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {eesList.length === 0 ? (
                                <div className="p-12 text-center border border-white/5 rounded-[32px] bg-slate-900/40">
                                    <School className="mx-auto text-slate-600 mb-4" size={48} />
                                    <h3 className="text-lg font-bold text-white mb-2">Aucun établissement rattaché</h3>
                                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                                        Votre compte gestionnaire n'a pas encore été rattaché à un établissement. Contactez un administrateur pour configurer votre rattachement.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {eesList.map((ees) => (
                                        <div key={ees.id} className="glass-card rounded-[32px] border-white/5 overflow-hidden border hover:border-indigo-500/30 transition-all p-8 flex flex-col justify-between group">
                                            <div>
                                                <div className="flex justify-between items-start mb-6">
                                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                                        {ees.eesType || 'Université'}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <Link href={`/formupdateees?id=${ees.id}&tutelle_id=${ees.tutelleId}`} className="p-3 bg-white/5 hover:bg-indigo-600 rounded-xl transition-all" title="Modifier l'EES">
                                                            <Edit3 size={18} />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-black text-white mb-2 leading-tight">{ees.nomEes}</h3>
                                                <div className="flex items-center gap-2 text-slate-500 mb-6 font-medium text-sm">
                                                    <MapPin size={14} className="text-indigo-500/50" />
                                                    {ees.ville?.nomVille || 'Ville non définie'}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Concours</p>
                                                        <p className="text-xl font-bold text-white">{ees._count?.sessionAdmission ?? 0}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Filières</p>
                                                        <p className="text-xl font-bold text-white">{ees._count?.programme ?? 0}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex gap-3">
                                                <Link
                                                    href={`/gestionnaireconcours/${ees.id}?nom_ees=${encodeURIComponent(ees.nomEes || '')}&tutelle_id=${ees.tutelleId}`}
                                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:border-indigo-500/20 border border-transparent"
                                                >
                                                    Gérer les Concours <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION CONCOURS */}
                    {activeTab === 'concours' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-white mb-2">Sessions d&apos;Admission</h2>
                                    <p className="text-slate-500 text-sm font-medium">Surveillance et contrôle des concours ouverts</p>
                                </div>
                                {eesList.length > 0 && (
                                    <Link
                                        href={`/formconcours?ees_id=${eesList[0].id}&nom_ees=${encodeURIComponent(eesList[0].nomEes)}`}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-purple-500/20"
                                    >
                                        <Plus size={18} /> Nouveau Concours
                                    </Link>
                                )}
                            </div>

                            <div className="bg-white/5 rounded-[32px] border border-white/5 overflow-hidden overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/2 border-b border-white/5 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                            <th className="px-8 py-6">Concours</th>
                                            <th className="px-8 py-6">Date Examen</th>
                                            <th className="px-8 py-6">État</th>
                                            <th className="px-8 py-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {concoursList.map((c) => (
                                            <tr key={c.id} className="group hover:bg-white/2 transition-all">
                                                <td className="px-8 py-6">
                                                    <p className="font-bold text-white mb-1">{c.nomConcours}</p>
                                                    <p className="text-xs text-slate-500">{c.diplomeRequis}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <Calendar size={14} className="text-purple-500" />
                                                        {c.dateExamEcrit
                                                            ? new Date(c.dateExamEcrit).toLocaleDateString('fr-FR')
                                                            : 'À confirmer'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase border animate-pulse ${c.etat ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                        {c.etat ? 'Ouvert' : 'Fermé'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/formupdateconcours?id=${c.id}&ees_id=${c.eesId}`} className="p-3 bg-white/5 hover:bg-purple-600 rounded-xl transition-all" title="Modifier">
                                                            <Edit3 size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleToggleConcours(c.id, c.etat)}
                                                            className={`p-3 rounded-xl border transition-all ${c.etat
                                                                ? 'hover:bg-rose-500/10 border-white/5 text-slate-500 hover:text-rose-400'
                                                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                                }`}
                                                            title={c.etat ? "Fermer le concours" : "Ouvrir le concours"}
                                                        >
                                                            {c.etat ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SECTION NEWS */}
                    {activeTab === 'news' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-6 rounded-[32px] border border-white/5 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                        <Newspaper className="text-pink-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white">Vos Actualités</h2>
                                        <p className="text-slate-500 text-xs font-medium">Communiqués et informations officielles</p>
                                    </div>
                                </div>
                                <Link href="/formnews" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-pink-500/20">
                                    <Plus size={18} /> Publier
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {newsList.map((news) => (
                                    <div key={news.id} className="bg-slate-900 border border-white/5 p-6 rounded-[32px] hover:border-pink-500/30 transition-all group relative overflow-hidden flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${news.isUrgent ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'}`}>
                                                    {news.category}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDeleteNews(news.id)} className="p-2.5 bg-white/5 hover:bg-rose-600 rounded-xl transition-all" title="Supprimer">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight">{news.title}</h3>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-500 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1.5 italic font-bold">
                                                <Calendar size={12} />
                                                {new Date(news.createdAt).toLocaleDateString()}
                                            </div>
                                            <Link href={`/news/${news.slug}`} className="text-pink-400 hover:text-white transition-colors">Détails</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default function GestionnaireDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-purple-500" size={48} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Chargement...</p>
                </div>
            </div>
        }>
            <GestionnaireContent />
        </Suspense>
    );
}
