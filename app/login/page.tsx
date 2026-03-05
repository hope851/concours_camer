'use client';

import { LoginUser } from '../action/user';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await LoginUser(formData);

            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    router.push('/profile');
                }, 1000);
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
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
                <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
            </div>

            <div className="relative w-full max-w-md z-10 animate-scale-in">
                {/* Glassmorphic Card */}
                <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl border-white/5">
                    {/* Header with gradient */}
                    <div className="relative p-10 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            <div className="absolute w-40 h-40 bg-indigo-400 rounded-full blur-3xl -top-20 -right-20" />
                        </div>
                        <div className="relative text-center">
                            <h1 className="text-4xl font-black text-white tracking-tighter">Connexion</h1>
                            <p className="text-indigo-200/70 mt-3 font-medium">Bon retour sur Concours-Camer</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">
                                Adresse Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/30 transition-all outline-none"
                                    placeholder="votre@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-xs font-black text-indigo-300 uppercase tracking-widest">
                                    Mot de passe
                                </label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/30 transition-all outline-none"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="text-red-400 shrink-0" size={20} />
                                <p className="text-red-200 text-sm font-semibold">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">✓</div>
                                <p className="text-emerald-200 text-sm font-semibold">{success}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Connexion...</span>
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/5"></div>
                            <span className="flex-shrink mx-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ou</span>
                            <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        {/* Register Link */}
                        <div className="text-center pb-2">
                            <p className="text-slate-400 text-sm font-medium">
                                Nouveau ici ?{' '}
                                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-black transition-colors underline underline-offset-4 decoration-2 decoration-indigo-500/30 hover:decoration-indigo-500">
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-white/5 bg-white/[0.02] text-center">
                        <Link href="/" className="text-xs text-slate-500 hover:text-indigo-300 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                            <ArrowLeft size={14} /> Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}