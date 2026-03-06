'use client';

import { GetCurrentUser, LogoutUser } from '@/app/action/user';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, Mail, LogOut, ArrowLeft, Shield,
    LayoutDashboard, Settings, Loader2,
    ChevronRight, ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';

// Interface alignée avec ton action Server
interface UserType {
    id: string;
    email: string;
    nom: string;
    role: 'ADMIN' | 'GESTIONAIRE' | 'USER';
    isActive: boolean;
    date_inscription: Date;
}

const ROLE_CONFIG = {
    ADMIN: {
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        label: 'Administrateur',
        gradient: 'from-pink-600/20 via-pink-600/5 to-transparent',
        glow: 'shadow-pink-500/20',
        actionLink: '/profile/admin',
        actionLabel: 'Console Admin'
    },
    GESTIONAIRE: {
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        label: 'Gestionnaire',
        gradient: 'from-purple-600/20 via-purple-600/5 to-transparent',
        glow: 'shadow-purple-500/20',
        actionLink: '/profile/gestion',
        actionLabel: 'Espace Gestion'
    },
    USER: {
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        label: 'Utilisateur',
        gradient: 'from-cyan-600/20 via-cyan-600/5 to-transparent',
        glow: 'shadow-cyan-500/20',
        actionLink: '/profile/utilisateur',
        actionLabel: 'Préférences'
    },
};

export default function ProfilePage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            try {
                const currentUser = await GetCurrentUser();
                if (!currentUser) {
                    router.replace('/login');
                    return;
                }
                // Cast sécurisé après vérification
                setUser(currentUser as unknown as UserType);
            } catch (error) {
                console.error("Erreur de session", error);
            } finally {
                setLoading(false);
            }
        }
        checkUser();
    }, [router]);

    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            await LogoutUser();
            router.refresh(); // Rafraîchit les Server Components
            router.replace('/');
        } catch (error) {
            setIsLoggingOut(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const roleConfig = ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG];

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
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Retour à la navigation</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFTSIDE: Profile Summary */}
                    <div className="lg:col-span-4 space-y-6 animate-scale-in">
                        <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5 relative">
                            <div className={`absolute top-0 left-0 right-0 h-40 bg-linear-to-b ${roleConfig.gradient} opacity-50`} />

                            <div className="relative pt-16 pb-10 px-10 flex flex-col items-center">
                                <div className={`relative w-40 h-40 rounded-[2.5rem] overflow-hidden mb-8 shadow-3xl ${roleConfig.glow}`}>
                                    <div className={`absolute inset-0 ${roleConfig.bg} border ${roleConfig.border} flex items-center justify-center`}>
                                        <User size={80} className={roleConfig.color} />
                                    </div>
                                </div>

                                <div className="text-center space-y-3">
                                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none">{user.nom}</h1>
                                    <p className="text-slate-400 font-bold flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                                        <Mail size={16} className="text-indigo-400" /> {user.email}
                                    </p>
                                </div>

                                <div className="mt-10 pt-10 border-t border-white/5 w-full space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Statut du compte</span>
                                        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Opérationnel</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Privilèges</span>
                                        <span className={`text-xs font-black uppercase tracking-widest ${roleConfig.color}`}>{roleConfig.label}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Rapides */}
                        <div className="glass-card rounded-[32px] p-8 border-white/5">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 ml-2">Pilotage</h3>
                            <div className="space-y-3">
                                <Link href={roleConfig.actionLink} className="w-full flex items-center justify-between p-5 rounded-4xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <LayoutDashboard size={20} className={roleConfig.color} />
                                        <span className="text-white font-bold tracking-tight">{roleConfig.actionLabel}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full flex items-center gap-4 p-5 rounded-4xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all font-black uppercase tracking-widest text-[10px] disabled:opacity-50"
                                >
                                    {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                                    <span>Déconnexion sécurisée</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHTSIDE: Détails & Stats */}
                    <div className="lg:col-span-8 space-y-6 animate-scale-in delay-100">
                        <div className="glass-card rounded-[40px] border-white/5 p-10 h-full">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="p-4 bg-indigo-500/10 rounded-[24px] border border-indigo-500/20">
                                    <Shield className="text-indigo-400" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Espace Confidentiel</h2>
                                    <p className="text-slate-400 text-sm font-medium">Contrôle de sécurité et paramètres du compte universitaire.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-[32px] bg-white/2 border border-white/5 space-y-2 hover:border-white/10 transition-all group">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identifiant Système</p>
                                    <p className="text-indigo-300 font-mono text-xs truncate opacity-60 group-hover:opacity-100 transition-opacity">{user.id}</p>
                                </div>
                                <div className="p-8 rounded-[32px] bg-white/2 border border-white/5 space-y-2 hover:border-white/10 transition-all group">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Membre depuis le</p>
                                    <p className="text-slate-300 font-bold">
                                        {new Date(user.date_inscription).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                                    </p>
                                </div>
                            </div>

                            {/* Placeholder pour futures activités */}
                            <div className="mt-10 p-16 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center text-center group hover:border-indigo-500/20 transition-all">
                                <div className="w-20 h-20 bg-white/3 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all">
                                    <Settings className="text-slate-600 group-hover:text-indigo-400 group-hover:rotate-90 transition-all duration-500" size={32} />
                                </div>
                                <h3 className="text-slate-300 font-black uppercase tracking-widest text-xs mb-3">Journal d'activité</h3>
                                <p className="text-slate-500 text-sm font-medium max-w-xs">Vos interactions récentes et tentatives de connexion seront cryptées et affichées ici.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
