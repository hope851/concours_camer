import { CheckCircle, Heart, Zap, Target } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
        <Navbar />

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-4">À propos de Concours-Camer</h1>
          <p className="text-slate-400">
            Centraliser l'information académique au Cameroun pour orienter les jeunes
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6">Notre Mission</h2>

          <div className="p-8 bg-linear-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-indigo-500/30">
            <p className="text-lg text-slate-200 mb-4">
              <strong>Concours-Camer</strong> est une plateforme dédiée à l'orientation académique et professionnelle 
              au Cameroun.
            </p>
            <p className="text-slate-300">
              Notre objectif est de centraliser toutes les informations relatives aux formations académiques et 
              professionnelles disponibles au Cameroun, afin que les élèves et étudiants puissent :
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Découvrir les établissements d'enseignement supérieur",
                "Explorer les filières et domaines d'étude",
                "Connaître les procédures d'admission et les concours",
                "Prendre des décisions académiques éclairées",
                "Planifier leur parcours d'orientation",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 text-white">
                  <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6">Nos Valeurs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Accessibilité</h3>
              <p className="text-slate-300">
                Nous croyons que l'information académique doit être accessible à tous, gratuitement.
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fiabilité</h3>
              <p className="text-slate-300">
                Nous collaborons avec les établissements pour y assurer des informations à jour et précises.
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Engagement</h3>
              <p className="text-slate-300">
                Nous sommes passionnés par l'éducation et l'orientation des jeunes Camerounais.
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transparence</h3>
              <p className="text-slate-300">
                Nous mettons à disposition les informations telles qu'elles nous sont fournies par les établissements.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6">Ce que vous trouverez ici</h2>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Établissements</h3>
              <p className="text-slate-300">
                Un catalogue complet des établissements d'enseignement supérieur publics et privés au Cameroun, 
                avec leurs caractéristiques, filières et conditions d'admission.
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Formations</h3>
              <p className="text-slate-300">
                Les différentes filières et programmes d'études disponibles, classés par domaine, établissement 
                et niveau d'étude.
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Concours</h3>
              <p className="text-slate-300">
                Un calendrier complet des concours d'accès avec dates, procédures et prérequis pour vous aider 
                à préparer vos admissions.
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Ressources</h3>
              <p className="text-slate-300">
                Guides d'orientation, FAQ et conseils pour vous aider à prendre les meilleures décisions pour 
                votre parcours académique.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6">Important</h2>

          <div className="p-6 bg-amber-500/10 backdrop-blur-sm rounded-xl border border-amber-500/30">
            <p className="text-amber-200 mb-4">
              <strong>Concours-Camer</strong> est une plateforme d'information indépendante. Nous ne sommes pas 
              l'organisme officiel d'admission ni affiliés au gouvernement camerounais.
            </p>
            <ul className="space-y-2 text-amber-100 text-sm">
              <li>• Les informations sont mises à jour régulièrement mais peuvent varier.</li>
              <li>• Consultez toujours les sites officiels des établissements pour les détails.</li>
              <li>• Les procédures d'admission relèvent de la responsabilité de chaque établissement.</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center p-8 bg-linear-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-indigo-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Prêt à explorer ?</h2>
          <p className="text-slate-300 mb-6">Commencez votre parcours d'orientation maintenant</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Explorer les formations
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition"
            >
              Nous contacter
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
