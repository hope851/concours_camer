'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GetMyEES } from '@/app/action/user';
import { DeleteEes } from '@/app/action/newees';
import { deleteNewsAction, getNewsAction } from '@/app/action/news'; // À créer
import Link from 'next/link';
import { 
    School, Plus, Edit3, Trash2, 
    Loader2, MapPin, Newspaper, Calendar, AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function GestionnaireEESDashboard() {
    const searchParams = useSearchParams();
    const nom_tutelle = searchParams.get('nom_tutelle') || "Ma Tutelle";
    
    const [eesList, setEesList] = useState<any[]>([]);
    const [newsList, setNewsList] = useState<any[]>([]); // État pour les news
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [eesData, newsData] = await Promise.all([
                GetMyEES(),
                getNewsAction() // Fonction pour récupérer les news
            ]);
            setEesList(eesData || []);
            setNewsList(newsData || []);
        } catch (error) {
            console.error("Erreur chargement données:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDeleteNews = async (id: string) => {
        if(confirm("Supprimer cette actualité ?")) {
            await deleteNewsAction(id);
            loadData();
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-purple-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            
            <main className="relative z-10 pt-28 pb-20 px-4 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-slate-800 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-purple-500 mb-2">
                            <School size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest">{nom_tutelle}</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Tableau de Bord</h1>
                        <p className="text-slate-400 mt-2">Gestion des établissements et actualités.</p>
                    </div>
                </div>

                {/* --- SECTION NEWS --- */}
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <Newspaper className="text-purple-500" />
                            <h2 className="text-2xl font-bold text-white">Actualités Récentes</h2>
                        </div>
                        <Link href="/formnews" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all font-bold text-sm">
                            <Plus size={18} /> Publier une News
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsList.map((news) => (
                            <div key={news.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-purple-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${news.isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                        {news.category}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/dashboard/news/edit/${news.id}`} className="p-2 bg-slate-800 hover:bg-purple-600 rounded-lg transition-colors">
                                            <Edit3 size={16} />
                                        </Link>
                                        <button onClick={() => handleDeleteNews(news.id)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{news.title}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Calendar size={14} />
                                    {new Date(news.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section EES existante ici... */}
            </main>
        </div>
    );
}
