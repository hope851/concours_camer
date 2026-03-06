'use client';

import { useEffect, useState } from 'react';
import { GetAllUsers, UpdateUserStatus, UpdateUserRole, GetCurrentUser } from '@/app/action/user';
import { User, Mail, Power, Search, Loader2, ShieldCheck, ArrowLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AdminUsersManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        async function init() {
            const user = await GetCurrentUser();
            setCurrentUser(user);
            if (user?.role === 'ADMIN') {
                const data = await GetAllUsers();
                setUsers(data);
            }
            setLoading(false);
        }
        init();
    }, []);

    const filteredUsers = users.filter(u => 
        u.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Retour au profil</span>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Console Admin</h1>
                        <p className="text-slate-400 mt-2 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-indigo-400" />
                            Gestion globale des comptes utilisateurs
                        </p>
                    </div>

                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un membre..." 
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-12 pr-6 focus:ring-2 ring-indigo-500/50 outline-none transition-all backdrop-blur-xl hover:bg-white/10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/2 border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                    <th className="px-8 py-6">Profil</th>
                                    <th className="px-8 py-6">Accès</th>
                                    <th className="px-8 py-6">Statut</th>
                                    <th className="px-8 py-6 text-right">Contrôles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="group hover:bg-white/1 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                    <User size={22} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-lg leading-tight">{u.nom}</p>
                                                    <p className="text-sm text-slate-500 flex items-center gap-1.5"><Mail size={12} /> {u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select 
                                                value={u.role}
                                                disabled={u.id === currentUser?.id}
                                                onChange={async (e) => { 
                                                    // Le 'as any' corrige l'erreur TS vue sur ton image
                                                    await UpdateUserRole(u.id, e.target.value as any); 
                                                    const d = await GetAllUsers(); 
                                                    setUsers(d); 
                                                }}
                                                className={`bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 ring-indigo-500/50 outline-none cursor-pointer transition-all ${
                                                    u.role === 'ADMIN' ? 'text-pink-400' : u.role === 'GESTIONAIRE' ? 'text-purple-400' : 'text-cyan-400'
                                                }`}
                                            >
                                                <option value="USER">👤 UTILISATEUR</option>
                                                <option value="GESTIONAIRE">🛠️ GESTIONNAIRE</option>
                                                <option value="ADMIN">👑 ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                                                u.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                                                {u.isActive ? 'Actif' : 'Bloqué'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                disabled={u.id === currentUser?.id}
                                                onClick={async () => { 
                                                    await UpdateUserStatus(u.id, !u.isActive); 
                                                    const d = await GetAllUsers(); 
                                                    setUsers(d); 
                                                }}
                                                className={`p-3 rounded-xl border transition-all ${
                                                    u.isActive 
                                                    ? 'hover:bg-rose-500/10 border-white/5 text-slate-500 hover:text-rose-400' 
                                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                }`}
                                            >
                                                <Power size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Link href={"/gestionnairetutelle"} className="w-full flex items-center justify-between p-5 rounded-4xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-3 m-1">
                                        <LayoutDashboard size={20}  />
                                        <span className="text-white font-bold tracking-tight">Espace Gestion utilisateur</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                                </Link>
        </div>
    );
}
