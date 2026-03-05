'use client';

import { RegisterUser } from '../action/user';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();

    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirmPassword") as string;

            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas");
                setLoading(false);
                return;
            }

            const result = await RegisterUser(formData);

            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    router.push('/profile');
                }, 1500);
            } else {
                setError(result.error || 'Une erreur est survenue');
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 py-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 right-0 animate-pulse" />
                <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl bottom-0 left-0 animate-pulse" />
                <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-1/2 right-1/4" />
            </div>

            <div className="relative w-full max-w-md z-10 animate-scale-in">
                {/* Glassmorphic Card */}
                <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl border-white/5">
                    {/* Header with gradient */}
                    <div className="relative p-10 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <User size={100} className="text-white" />
                        </div>
                        <div className="relative">
                            <h1 className="text-4xl font-black text-white leading-none mb-2">Créer un compte</h1>
                            <p className="text-slate-400 font-medium tracking-tight">Rejoignez Concours-Camer</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-10 space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="nom" className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    required
                                    className="glass-input w-full pl-12 p-4 rounded-2xl"
                                    placeholder="Jean Dupont"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">
                                Adresse Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="glass-input w-full pl-12 p-4 rounded-2xl"
                                    placeholder="votre@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    onChange={(e) => checkPasswordStrength(e.target.value)}
                                    className="glass-input w-full pl-12 p-4 rounded-2xl"
                                    placeholder="Minimum 6 caractères"
                                    disabled={loading}
                                />
                            </div>
                            {/* Password Strength Indicator */}
                            {passwordStrength > 0 && (
                                <div className="mt-4 flex gap-1.5 px-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < passwordStrength ? 'bg-linear-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_-2px_rgba(192,132,252,0.5)]' : 'bg-white/5'
                                                }`}
                                        ></div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    minLength={6}
                                    className="glass-input w-full pl-12 p-4 rounded-2xl"
                                    placeholder="Confirmer votre mot de passe"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="flex items-center gap-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="text-rose-400 shrink-0" size={20} />
                                <p className="text-rose-200 text-sm font-bold">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle className="text-emerald-400 shrink-0" size={20} />
                                <p className="text-emerald-200 text-sm font-bold">{success}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    <span>Création...</span>
                                </>
                            ) : (
                                <>
                                    <span>Créer mon compte</span>
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center pt-2">
                            <p className="text-slate-400 text-sm font-medium">
                                Déjà un compte?{' '}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-black transition-colors underline underline-offset-4 decoration-2">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-8 border-t border-white/5 bg-white/[0.02] text-center">
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                            <ArrowLeft size={14} /> Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}