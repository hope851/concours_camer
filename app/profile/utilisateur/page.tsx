'use client';

import { useEffect, useState } from 'react';
import {
    GetCurrentUser, GetUserFollows, UpdateUserProfile, ChangePassword,
    UnfollowEes, UnfollowTutelle, UnfollowProgramme
} from '@/app/action/user';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Shield, Key, CheckCircle2,
    AlertCircle, Loader2, ArrowLeft, Save,
    Lock, Eye, EyeOff, Bell, Building2, GraduationCap,
    BookOpen, BellOff, ExternalLink, Compass
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function UserProfileSettings() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
    const [follows, setFollows] = useState<any>(null);
    const [unfollowingId, setUnfollowingId] = useState<string | null>(null);

    const router = useRouter();

    const fetchAllData = async () => {
        try {
            const data = await GetCurrentUser();
            if (!data) {
                router.push('/login');
                return;
            }
            setUser(data);
            const followData = await GetUserFollows();
            setFollows(followData);
        } catch (error) {
            console.error("Erreur chargement profil utilisateur:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [router]);

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData(e.currentTarget);
        const res = await UpdateUserProfile(formData);

        if (res.success) {
            setMessage({ type: 'success', text: res.message || "Profil mis à jour" });
            const updated = await GetCurrentUser();
            setUser(updated);
        } else {
            setMessage({ type: 'error', text: res.error || "Une erreur est survenue" });
        }
        setSubmitting(false);
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData(e.currentTarget);
        const res = await ChangePassword(formData);

        if (res.success) {
            setMessage({ type: 'success', text: res.message || "Mot de passe modifié" });
            (e.target as HTMLFormElement).reset();
        } else {
            setMessage({ type: 'error', text: res.error || "Erreur lors de la modification" });
        }
        setSubmitting(false);
    };

    // Gestion individuelle des abonnements de l'utilisateur
    const handleUnfollowEes = async (eesId: string, nomEes: string) => {
        setUnfollowingId(eesId);
        const res = await UnfollowEes(eesId);
        if (res.success) {
            setMessage({ type: 'success', text: `Désabonné de ${nomEes}` });
            const followData = await GetUserFollows();
            setFollows(followData);
        } else {
            setMessage({ type: 'error', text: res.error || "Impossible de se désabonner" });
        }
        setUnfollowingId(null);
    };

    const handleUnfollowTutelle = async (tutelleId: string, nomTutelle: string) => {
        setUnfollowingId(tutelleId);
        const res = await UnfollowTutelle(tutelleId);
        if (res.success) {
            setMessage({ type: 'success', text: `Désabonné de ${nomTutelle}` });
            const followData = await GetUserFollows();
            setFollows(followData);
        } else {
            setMessage({ type: 'error', text: res.error || "Impossible de se désabonner" });
        }
        setUnfollowingId(null);
    };

    const handleUnfollowProgramme = async (programmeId: string, nomProgramme: string) => {
        setUnfollowingId(programmeId);
        const res = await UnfollowProgramme(programmeId);
        if (res.success) {
            setMessage({ type: 'success', text: `Désabonné du programme ${nomProgramme}` });
            const followData = await GetUserFollows();
            setFollows(followData);
        } else {
            setMessage({ type: 'error', text: res.error || "Impossible de se désabonner" });
        }
        setUnfollowingId(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    const totalFollows = (follows?.ees?.length || 0) + (follows?.tutelles?.length || 0) + (follows?.programmes?.length || 0);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-28 pb-20 px-4 max-w-5xl mx-auto">
                <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Tableau de bord</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Espace Personnel & Abonnements</h1>
                        <p className="text-xs text-slate-500 mt-1">Gérez vos suivis universitaires et vos paramètres de sécurité</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <p className="text-sm font-bold">{message.text}</p>
                    </div>
                )}

                {/* GESTION COMPLÈTE DES ABONNEMENTS */}
                <section className="glass-card rounded-[32px] border-white/5 overflow-hidden animate-scale-in mb-10 shadow-2xl">
                    <div className="p-8 border-b border-white/5 bg-white/2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
                                <Bell size={22} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Mes Abonnements Universitaires</h2>
                                <p className="text-slate-500 text-xs font-medium">Vous êtes abonné à {totalFollows} source{totalFollows > 1 ? 's' : ''} d&apos;information</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/explore" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition flex items-center gap-1.5 border border-white/5">
                                <Compass size={14} /> Explorer
                            </Link>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 1. Établissements */}
                        <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                        <GraduationCap size={16} className="text-indigo-400" />
                                        Établissements ({follows?.ees?.length || 0})
                                    </h3>
                                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">EES</span>
                                </div>

                                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                    {follows?.ees?.length ? follows.ees.map((f: any) => (
                                        <div key={f.id} className="p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-indigo-500/30 transition group flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/explore/${f.ees.id}`} className="text-sm font-bold text-white hover:text-indigo-300 transition block truncate">
                                                    {f.ees.nomEes}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-500 font-medium truncate">{f.ees.ville?.nomVille || 'Cameroun'}</span>
                                                    {f.ees.domaine && <span className="text-[9px] text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.2 rounded truncate">{f.ees.domaine}</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnfollowEes(f.ees.id, f.ees.nomEes)}
                                                disabled={unfollowingId === f.ees.id}
                                                className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 transition"
                                                title="Se désabonner de cet établissement"
                                            >
                                                {unfollowingId === f.ees.id ? <Loader2 size={14} className="animate-spin" /> : <BellOff size={14} />}
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="py-8 text-center space-y-2">
                                            <p className="text-slate-600 text-xs italic">Aucun établissement suivi</p>
                                            <Link href="/explore" className="inline-block text-[10px] text-indigo-400 hover:underline font-bold">Découvrir les universités →</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Tutelles */}
                        <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                        <Building2 size={16} className="text-amber-400" />
                                        Tutelles ({follows?.tutelles?.length || 0})
                                    </h3>
                                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Ministères</span>
                                </div>

                                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                    {follows?.tutelles?.length ? follows.tutelles.map((f: any) => (
                                        <div key={f.id} className="p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-amber-500/30 transition group flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/tutelles/${f.tutelle.id}`} className="text-sm font-bold text-white hover:text-amber-300 transition block truncate">
                                                    {f.tutelle.nomTutelle}
                                                </Link>
                                                <p className="text-[10px] text-slate-500 mt-1">Institution de tutelle</p>
                                            </div>
                                            <button
                                                onClick={() => handleUnfollowTutelle(f.tutelle.id, f.tutelle.nomTutelle)}
                                                disabled={unfollowingId === f.tutelle.id}
                                                className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 transition"
                                                title="Se désabonner de cette tutelle"
                                            >
                                                {unfollowingId === f.tutelle.id ? <Loader2 size={14} className="animate-spin" /> : <BellOff size={14} />}
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="py-8 text-center space-y-2">
                                            <p className="text-slate-600 text-xs italic">Aucune tutelle suivie</p>
                                            <Link href="/tutelles" className="inline-block text-[10px] text-amber-400 hover:underline font-bold">Consulter les tutelles →</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Programmes */}
                        <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                        <BookOpen size={16} className="text-purple-400" />
                                        Programmes ({follows?.programmes?.length || 0})
                                    </h3>
                                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Filières</span>
                                </div>

                                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                    {follows?.programmes?.length ? follows.programmes.map((f: any) => (
                                        <div key={f.id} className="p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-purple-500/30 transition group flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/explore/${f.programme.ees.id}`} className="text-sm font-bold text-white hover:text-purple-300 transition block truncate">
                                                    {f.programme.nomProgramme}
                                                </Link>
                                                <p className="text-[10px] text-slate-500 truncate mt-1">
                                                    {f.programme.niveau} · {f.programme.ees.nomEes}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleUnfollowProgramme(f.programme.id, f.programme.nomProgramme)}
                                                disabled={unfollowingId === f.programme.id}
                                                className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 transition"
                                                title="Se désabonner de ce programme"
                                            >
                                                {unfollowingId === f.programme.id ? <Loader2 size={14} className="animate-spin" /> : <BellOff size={14} />}
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="py-8 text-center space-y-2">
                                            <p className="text-slate-600 text-xs italic">Aucun programme suivi</p>
                                            <Link href="/explore" className="inline-block text-[10px] text-purple-400 hover:underline font-bold">Explorer les filières →</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="space-y-8">
                    {/* Informations Personnelles (Règles de sécurité strictes) */}
                    <section className="glass-card rounded-[32px] border-white/5 overflow-hidden animate-scale-in">
                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Identité du Compte</h2>
                                    <p className="text-xs text-slate-500">Rôle actuel : <span className="text-indigo-400 font-bold">{user?.role}</span></p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom Complet</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            name="nom"
                                            type="text"
                                            defaultValue={user?.nom}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 ring-indigo-500/50 outline-none transition-all text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adresse Email</label>
                                        {user?.role !== 'ADMIN' && (
                                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                                Protégé · Non modifiable
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            name="email"
                                            type="email"
                                            defaultValue={user?.email}
                                            readOnly={user?.role !== 'ADMIN'}
                                            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all ${user?.role !== 'ADMIN' ? 'opacity-60 cursor-not-allowed text-slate-400 select-none' : 'focus:ring-2 ring-indigo-500/50 text-white'}`}
                                            required
                                        />
                                    </div>
                                    {user?.role !== 'ADMIN' && (
                                        <p className="text-[10px] text-slate-500 italic ml-1">
                                            Information sensible : Seul un administrateur est habilité à modifier l'adresse email de connexion.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Sécurité et Mot de Passe */}
                    <section className="glass-card rounded-[32px] border-white/5 overflow-hidden animate-scale-in delay-100">
                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">Sécurité du Mot de Passe</h2>
                                <p className="text-xs text-slate-500">Modification sécurisée nécessitant la confirmation de votre ancien mot de passe</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ancien mot de passe</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                        <input
                                            name="oldPassword"
                                            type={showPasswords.old ? "text" : "password"}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 ring-purple-500/50 outline-none transition-all text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                            <input
                                                name="newPassword"
                                                type={showPasswords.new ? "text" : "password"}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 ring-purple-500/50 outline-none transition-all text-white"
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                            >
                                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmer</label>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                            <input
                                                name="confirmPassword"
                                                type={showPasswords.confirm ? "text" : "password"}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 ring-purple-500/50 outline-none transition-all text-white"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                            >
                                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95"
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                    Mettre à jour la sécurité
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
