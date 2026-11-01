'use client';

import { useEffect, useState } from 'react';
import { GetCurrentUser, GetUserFollows, UpdateUserProfile, ChangePassword } from '@/app/action/user';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Shield, Key, CheckCircle2,
    AlertCircle, Loader2, ArrowLeft, Save,
    Lock, Eye, EyeOff, Bell, Building2, GraduationCap, BookOpen
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

    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const data = await GetCurrentUser();
            if (!data) {
                router.push('/login');
                return;
            }
            setUser(data);
            const followData = await GetUserFollows();
            setFollows(followData);
            setLoading(false);
        }
        fetchUser();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-28 pb-20 px-4 max-w-4xl mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Espace Personnel</span>
                    </Link>
                    <h1 className="text-2xl font-black text-white tracking-tight">Paramètres du compte</h1>
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

                {/* Mes suivis */}
                {follows && (
                    <section className="glass-card rounded-[32px] border-white/5 overflow-hidden animate-scale-in mb-8">
                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                <Bell className="text-pink-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">Mes suivis</h2>
                                <p className="text-slate-500 text-xs">Établissements, tutelles et programmes que vous suivez</p>
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <GraduationCap size={12} /> Établissements ({follows.ees?.length || 0})
                                </h3>
                                <div className="space-y-2">
                                    {follows.ees?.length ? follows.ees.map((f: any) => (
                                        <Link key={f.id} href={`/explore/${f.ees.id}`} className="block p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition text-sm font-bold text-white">
                                            {f.ees.nomEes}
                                            <span className="block text-[10px] text-slate-500 font-medium">{f.ees.ville?.nomVille}</span>
                                        </Link>
                                    )) : <p className="text-slate-600 text-xs italic">Aucun établissement suivi</p>}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Building2 size={12} /> Tutelles ({follows.tutelles?.length || 0})
                                </h3>
                                <div className="space-y-2">
                                    {follows.tutelles?.length ? follows.tutelles.map((f: any) => (
                                        <Link key={f.id} href={`/tutelles/${f.tutelle.id}`} className="block p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition text-sm font-bold text-white">
                                            {f.tutelle.nomTutelle}
                                        </Link>
                                    )) : <p className="text-slate-600 text-xs italic">Aucune tutelle suivie</p>}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <BookOpen size={12} /> Programmes ({follows.programmes?.length || 0})
                                </h3>
                                <div className="space-y-2">
                                    {follows.programmes?.length ? follows.programmes.map((f: any) => (
                                        <Link key={f.id} href={`/explore/${f.programme.ees.id}`} className="block p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition text-sm font-bold text-white">
                                            {f.programme.nomProgramme}
                                            <span className="block text-[10px] text-slate-500 font-medium">{f.programme.ees.nomEes}</span>
                                        </Link>
                                    )) : <p className="text-slate-600 text-xs italic">Aucun programme suivi</p>}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <div className="space-y-8">
                    {/* Informations Personnelles */}
                    <section className="glass-card rounded-[32px] border-white/5 overflow-hidden animate-scale-in">
                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <User className="text-indigo-400" size={20} />
                            </div>
                            <h2 className="text-lg font-black text-white uppercase tracking-wider">Identité</h2>
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
                                            defaultValue={user.nom}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 ring-indigo-500/50 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresse Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            name="email"
                                            type="email"
                                            defaultValue={user.email}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 ring-indigo-500/50 outline-none transition-all"
                                            required
                                        />
                                    </div>
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
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Shield className="text-purple-400" size={20} />
                            </div>
                            <h2 className="text-lg font-black text-white uppercase tracking-wider">Sécurité</h2>
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
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 ring-purple-500/50 outline-none transition-all"
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
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 ring-purple-500/50 outline-none transition-all"
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
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 ring-purple-500/50 outline-none transition-all"
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
