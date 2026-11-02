'use client';

import { GetCurrentUser, LogoutUser } from '@/app/action/user';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, Mail, LogOut, ArrowLeft, Shield,
    LayoutDashboard, Settings, Loader2,
    ChevronRight, Bell, Building2, GraduationCap,
    BookOpen, Sparkles, PlusCircle, CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface UserType {
    id: string;
    email: string;
    nom: string;
    role: 'ADMIN' | 'GESTIONAIRE' | 'USER';
    isActive: boolean;
    dateInscription: Date | string;
}

const ROLE_CONFIG = {
    ADMIN: {
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        badgeBorder: 'border-pink-500/40',
        label: 'Super Administrateur',
        gradient: 'from-pink-600/25 via-pink-600/5 to-transparent',
        glow: 'shadow-pink-500/20',
        actionLink: '/profile/admin',
        actionLabel: 'Console Administration',
        description: 'Supervision globale de la plateforme, gestion des comptes, permissions et référentiels.'
    },
    GESTIONAIRE: {
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        badgeBorder: 'border-purple-500/40',
        label: 'Gestionnaire d\'Établissement',
        gradient: 'from-purple-600/25 via-purple-600/5 to-transparent',
        glow: 'shadow-purple-500/20',
        actionLink: '/profile/gestion',
        actionLabel: 'Espace Gestion EES',
        description: 'Administration de votre établissement, publication des concours, filières et actualités.'
    },
    USER: {
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        badgeBorder: 'border-cyan-500/40',
        label: 'Étudiant / Candidat',
        gradient: 'from-cyan-600/25 via-cyan-600/5 to-transparent',
        glow: 'shadow-cyan-500/20',
        actionLink: '/profile/utilisateur',
        actionLabel: 'Mes Abonnements & Alertes',
        description: 'Suivi personnalisé de vos établissements favoris, concours souscrits et alertes.'
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
            router.refresh();
            router.replace('/login');
        } catch (error) {
            setIsLoggingOut(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="relative flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const roleConfig = ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.USER;
    const formattedDate = user.dateInscription
        ? new Date(user.dateInscription).toLocaleDateString('fr-FR', { dateStyle: 'long' })
        : 'Date non disponible';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />

            {/* Background Ambient Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[140px]" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[45%] h-[45%] bg-purple-600/10 rounded-full blur-[140px]" />
            </div>

            <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-sm group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Retour à l'accueil</span>
                    </Link>

                    <span className="text-xs uppercase tracking-widest text-slate-500 font-mono">
                        Session sécurisée HMAC-SHA256
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFTSIDE: Profile Summary Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card rounded-[36px] overflow-hidden border border-white/5 relative shadow-2xl backdrop-blur-xl bg-slate-900/60">
                            <div className={`absolute top-0 left-0 right-0 h-36 bg-linear-to-b ${roleConfig.gradient} opacity-70`} />

                            <div className="relative pt-12 pb-8 px-8 flex flex-col items-center">
                                <div className={`relative w-28 h-28 rounded-3xl overflow-hidden mb-6 shadow-2xl ${roleConfig.glow}`}>
                                    <div className={`absolute inset-0 ${roleConfig.bg} border ${roleConfig.border} flex items-center justify-center`}>
                                        <User size={56} className={roleConfig.color} />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{user.nom}</h1>
                                    <p className="text-slate-400 font-medium flex items-center justify-center gap-2 text-xs">
                                        <Mail size={14} className="text-indigo-400 shrink-0" /> {user.email}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 w-full space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statut</span>
                                        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Actif</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rôle</span>
                                        <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${roleConfig.bg} ${roleConfig.color} ${roleConfig.border}`}>
                                            {roleConfig.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Membre depuis</span>
                                        <span className="text-xs text-slate-300 font-medium">{formattedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Actions Panel */}
                        <div className="glass-card rounded-[28px] p-6 border border-white/5 backdrop-blur-xl bg-slate-900/60 space-y-3">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
                                Navigation Rapide
                            </h3>

                            <Link
                                href={roleConfig.actionLink}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl ${roleConfig.bg} hover:brightness-110 border ${roleConfig.border} transition-all group shadow-sm`}
                            >
                                <div className="flex items-center gap-3">
                                    <LayoutDashboard size={20} className={roleConfig.color} />
                                    <div>
                                        <p className="text-white font-bold text-sm leading-tight">{roleConfig.actionLabel}</p>
                                        <p className="text-slate-400 text-[11px] mt-0.5">Accès dédié à votre rôle</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                            >
                                {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHTSIDE: Role-Specific Hub & System Info */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Role Welcome Banner */}
                        <div className="glass-card rounded-[36px] border border-white/5 p-8 relative overflow-hidden backdrop-blur-xl bg-slate-900/60 shadow-2xl">
                            <div className="flex items-start gap-5">
                                <div className={`p-4 rounded-2xl border ${roleConfig.bg} ${roleConfig.border}`}>
                                    <Shield className={roleConfig.color} size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-white tracking-tight">
                                        Tableau de Bord — {roleConfig.label}
                                    </h2>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {roleConfig.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SPECIFIC TILES ACCORDING TO ROLE */}
                        {user.role === 'USER' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        href="/profile/utilisateur"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                                <Bell size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                Mes Abonnements
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Gérez vos alertes pour les établissements, tutelles et programmes d'études suivis.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                                            <span>Ouvrir mes abonnements</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/concours"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <GraduationCap size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                Concours & Admissions
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Consultez tous les concours d'entrée officiels ouverts au Cameroun et préparez vos dossiers.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                                            <span>Explorer les concours</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/explore"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                                <Building2 size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                                Établissements (EES)
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Découvrez les universités, grandes écoles et instituts d'enseignement supérieur agréés.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-purple-400 font-semibold text-xs">
                                            <span>Parcourir le catalogue</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/tutelles"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <BookOpen size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                                                Tutelles Ministérielles
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Parcourez les ministères régulateurs (MINESUP, MINSANTE, MINADER...) et leurs structures.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                                            <span>Voir les tutelles</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {user.role === 'GESTIONAIRE' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        href="/profile/gestion"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                                <Building2 size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                                Mon Établissement
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Éditer la fiche de l'EES qui vous est assigné (coordonnées, ville, type, tutelle).
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-purple-400 font-semibold text-xs">
                                            <span>Ouvrir l'espace établissement</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/formconcours"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <PlusCircle size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                Publier un Concours
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Créer une session de concours ou d'admission officielle pour votre établissement.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                                            <span>Formulaire de concours</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/formactuality"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                                <Sparkles size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                                                Publier une Actualité
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Diffuser un communiqué, des résultats d'admission ou des annonces officielles.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-amber-400 font-semibold text-xs">
                                            <span>Créer une actualité</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/profile/utilisateur"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                                <Bell size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                Mes Alertes & Abonnements
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Gérez vos propres souscriptions personnelles en tant qu'utilisateur de la plateforme.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                                            <span>Voir mes alertes</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {user.role === 'ADMIN' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        href="/profile/admin"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                                <Shield size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                                                Gestion des Utilisateurs
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Attribuer les rôles, assigner des EES, modifier les identités, réinitialiser des mots de passe ou suspendre des comptes.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-pink-400 font-semibold text-xs">
                                            <span>Ouvrir la console admin</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/gestionnairetutelle"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <BookOpen size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                Gestion des Tutelles
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Gérer les ministères de tutelle (création, mise à jour, suivi réglementaire).
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                                            <span>Gérer les tutelles</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/gestionnaire_ees"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                                <Building2 size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                                Référentiel des Établissements
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Création, rattachement de tutelle et supervision des universités et instituts du Cameroun.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-purple-400 font-semibold text-xs">
                                            <span>Gérer les établissements</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/profile/utilisateur"
                                        className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                                <Bell size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                Mon Profil & Abonnements
                                            </h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Consulter vos abonnements personnels ou tester la vue utilisateur classique.
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                                            <span>Espace abonné</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Audit & Security Integrity Footer Card */}
                        <div className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div>
                                    <p className="text-slate-200 font-semibold">Intégrité de Session Validée</p>
                                    <p className="text-slate-500 text-[11px]">Signature cryptographique HMAC active et vérifiée à chaque requête.</p>
                                </div>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 hidden sm:inline">
                                ID: {user.id.slice(0, 8)}...
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
