'use client';

import { useEffect, useState } from 'react';
import { GetAllUsers, UpdateUserStatus, UpdateUserRole, GetCurrentUser, GetSystemStats, GetAllEes, AssignEesToUser } from '@/app/action/user';
import {
    User, Mail, Power, Search, Loader2,
    ShieldCheck, ArrowLeft, ChevronRight,
    LayoutDashboard, Users, Newspaper,
    Calendar, School, BarChart3, TrendingUp,
    ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AdminConsole() {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [eesList, setEesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);

    const init = async () => {
        try {
            const [userData, allUsers, systemStats, allEes] = await Promise.all([
                GetCurrentUser(),
                GetAllUsers(),
                GetSystemStats(),
                GetAllEes()
            ]);

            setCurrentUser(userData);
            if (userData?.role === 'ADMIN') {
                setUsers(allUsers || []);
                setStats(systemStats);
                setEesList(allEes || []);
            }
        } catch (error) {
            console.error("Erreur d'initialisation Admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { init(); }, []);

    const filteredUsers = users.filter(u =>
        u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-indigo-500" size={48} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Chargement des données système...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Retour au profil</span>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <ShieldCheck size={20} />
                            <span className="text-sm font-black uppercase tracking-widest">Contrôle Système</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">Console Admin</h1>
                    </div>

                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un membre par nom ou email..."
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-12 pr-6 focus:ring-2 ring-indigo-500/50 outline-none transition-all backdrop-blur-xl hover:bg-white/10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* System Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-scale-in">
                        {[
                            { label: 'Utilisateurs', value: stats.userCount, icon: Users, color: 'text-indigo-400' },
                            { label: 'Concours', value: stats.concoursCount, icon: Calendar, color: 'text-purple-400' },
                            { label: 'News', value: stats.newsCount, icon: Newspaper, color: 'text-pink-400' },
                            { label: 'Établissements', value: stats.eesCount, icon: School, color: 'text-cyan-400' },
                        ].map((s, idx) => (
                            <div key={idx} className="glass-card p-6 rounded-[32px] border-white/5 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-xl bg-white/5 ${s.color}`}>
                                        <s.icon size={20} />
                                    </div>
                                    <TrendingUp size={16} className="text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">{s.value}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-scale-in delay-100">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
                        <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Users size={18} className="text-indigo-400" />
                            Répertoire des Comptes
                        </h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {filteredUsers.length} Membre{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/1 border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                    <th className="px-10 py-6">Utilisateur</th>
                                    <th className="px-10 py-6">Rôle d&apos;accès</th>
                                    <th className="px-10 py-6">Établissement rattaché</th>
                                    <th className="px-10 py-6">Intégrité</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="group hover:bg-white/2 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                                    <User size={22} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-lg leading-tight group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{u.nom}</p>
                                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><Mail size={12} className="opacity-50" /> {u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <select
                                                value={u.role}
                                                disabled={u.id === currentUser?.id}
                                                onChange={async (e) => {
                                                    await UpdateUserRole(u.id, e.target.value as any);
                                                    init();
                                                }}
                                                className={`bg-slate-900 border border-white/10 rounded-2xl px-5 py-2.5 text-[10px] font-black tracking-widest focus:ring-2 ring-indigo-500/50 outline-none cursor-pointer transition-all uppercase ${u.role === 'ADMIN' ? 'text-pink-400' : u.role === 'GESTIONAIRE' ? 'text-purple-400' : 'text-cyan-400'
                                                    }`}
                                            >
                                                <option value="USER">Utilisateur</option>
                                                <option value="GESTIONAIRE">Gestionnaire</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-10 py-6">
                                            {u.role === 'GESTIONAIRE' ? (
                                                <select
                                                    value={u.eesId || ""}
                                                    onChange={async (e) => {
                                                        const val = e.target.value === "" ? null : e.target.value;
                                                        await AssignEesToUser(u.id, val);
                                                        init();
                                                    }}
                                                    className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-[10px] font-bold text-slate-400 focus:ring-2 ring-indigo-500/50 outline-none transition-all w-full max-w-[200px]"
                                                >
                                                    <option value="">Non assigné</option>
                                                    {eesList.map(ees => (
                                                        <option key={ees.id} value={ees.id}>{ees.nom_ees}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-[10px] text-slate-600 font-bold uppercase italic">— Aucun —</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase border ${u.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                                                {u.isActive ? 'Actif' : 'Révoqué'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                disabled={u.id === currentUser?.id}
                                                onClick={async () => {
                                                    await UpdateUserStatus(u.id, !u.isActive);
                                                    init();
                                                }}
                                                className={`p-3.5 rounded-2xl border transition-all ${u.isActive
                                                    ? 'hover:bg-rose-500/10 border-white/5 text-slate-500 hover:text-rose-400'
                                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                    }`}
                                                title={u.isActive ? "Désactiver le compte" : "Réactiver le compte"}
                                            >
                                                <Power size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Aucun membre trouvé</h3>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm">Ajustez votre recherche pour trouver l&apos;utilisateur souhaité.</p>
                            </div>
                        )}
                    </div>

                    <div className="px-10 py-8 bg-white/2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Contrôle de conformité RGPD & Sécurité locale</p>
                        <Link href="/gestionnairetutelle" className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-300 transition-colors group">
                            Gérer les institutions <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
