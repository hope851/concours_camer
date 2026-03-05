'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GetCurrentUser } from '@/app/action/user';

interface UserType {
  id: string;
  nom: string;
  email: string;
}

export default function AuthCallToAction() {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkUser() {
            const currentUser = await GetCurrentUser();
            setUser(currentUser);
            setLoading(false);
        }
        checkUser();
    }, []);

    if (loading) {
        return null;
    }

    if (user) {
        return (
            <section className="py-16 px-4 bg-white/5 border-t border-b border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-300">Vous êtes connecté</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Bienvenue {user.nom.split(' ')[0]}!</h2>
                    <p className="text-slate-300 mb-8">Vous avez accès à toutes les fonctionnalités de Concours-Camer.</p>
                    <Link
                        href="/utilisateur/profile"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
                    >
                        Mon Profil
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 bg-linear-to-r from-indigo-600/20 to-purple-600/20 border-y border-white/10">
            <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Benefits */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Commencez votre journey académique
                        </h2>
                        <p className="text-slate-300 mb-8">
                            Rejoignez des milliers d'étudiants qui utilisent Concours-Camer pour trouver leur programme idéal.
                        </p>
                        
                        <ul className="space-y-4 mb-8">
                            {[
                                "Explorez tous les établissements camerounais",
                                "Recherchez par filière et région",
                                "Suivez les dates de concours en temps réel",
                                "Accédez aux informations complètes des programmes",
                                "Recevez les actualités des concours"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-200">
                                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-3">
                            <Link
                                href="/register"
                                className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                S'inscrire Gratuitement
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-all duration-300"
                            >
                                Se Connecter
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Features Card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Avantages de créer un compte</h3>
                        
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-indigo-300 font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Recherche Personnalisée</h4>
                                    <p className="text-slate-400 text-sm">Trouvez les programmes qui correspondent à vos critères</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-purple-300 font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Alertes Concours</h4>
                                    <p className="text-slate-400 text-sm">Soyez informé des dates limites de candidature</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="w-10 h-10 rounded-full bg-pink-600/30 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-pink-300 font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">Profil Complet</h4>
                                    <p className="text-slate-400 text-sm">Gérez votre expérience et vos préférences</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-linear-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-500/30">
                            <p className="text-sm text-indigo-200">
                                <span className="font-semibold">Gratuit et sécurisé</span> - Aucune information de paiement requise
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}