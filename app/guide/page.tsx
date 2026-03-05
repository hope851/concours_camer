import { CheckCircle, AlertCircle, BookOpen, Target } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
        <Navbar />

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-4">Guide d'Orientation</h1>
          <p className="text-slate-400">Tout ce qu'il faut savoir pour choisir votre formation et réussir vos concours</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <div className="mb-12 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Sommaire</h2>
          <ul className="space-y-2">
            {[
              { id: "choix", title: "1. Comment choisir sa formation ?" },
              { id: "concours", title: "2. Préparer les concours" },
              { id: "candidature", title: "3. Processus d'admission" },
              { id: "documents", title: "4. Documents nécessaires" },
              { id: "bourses", title: "5. Financement et bourses" },
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-indigo-300 hover:text-indigo-200 transition font-semibold"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 1 */}
        <section id="choix" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-indigo-400" />
            Comment choisir sa formation ?
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Évaluez vos intérêts</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Identifiez vos domaines de prédilection</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Réfléchissez à votre projet professionnel</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Prenez en compte vos résultats académiques</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Explorez nos formations</h3>
              <p className="text-slate-300 mb-4">
                Utilisez notre moteur de recherche pour filtrer par :
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Domaine d'étude</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Localisation géographique</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Type d'établissement</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Vérifiez les prérequis</h3>
              <p className="text-slate-300">
                Assurez-vous que vous avez le niveau requis pour chaque formation avant de postuler.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="concours" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            Préparer les concours
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Timeline de préparation</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1 bg-linear-to-b from-indigo-500 to-transparent" />
                  <div>
                    <p className="font-bold text-white mb-1">6 mois avant</p>
                    <p className="text-slate-400">Parcourez les différentes formations et établissements</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-linear-to-b from-indigo-500 to-transparent" />
                  <div>
                    <p className="font-bold text-white mb-1">4 mois avant</p>
                    <p className="text-slate-400">Début des préparations intensives</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-linear-to-b from-indigo-500 to-transparent" />
                  <div>
                    <p className="font-bold text-white mb-1">2 mois avant</p>
                    <p className="text-slate-400">Entraînement aux concours blancs</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-indigo-500" />
                  <div>
                    <p className="font-bold text-white mb-1">Jour du concours</p>
                    <p className="text-slate-400">Soyez préparé et confiant</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-indigo-500/10 backdrop-blur-sm rounded-xl border border-indigo-500/30">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-400" />
                Conseil important
              </h3>
              <p className="text-slate-300">
                Consultez régulièrement notre plateforme pour connaître les dates d'ouverture et fermeture des concours. 
                Les délais peuvent être courts, ne tardez pas à vous inscrire !
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="candidature" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-black text-white mb-6">Processus d'admission</h2>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <ol className="space-y-4">
              {[
                "Vérifier votre éligibilité pour le concours",
                "Vous inscrire en ligne avant la date limite",
                "Passer les épreuves aux dates annoncées",
                "Consulter les résultats sur le site de l'établissement",
                "Effectuer votre inscription pédagogique si admis",
              ].map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-slate-300 flex-1 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Section 4 */}
        <section id="documents" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-black text-white mb-6">Documents nécessaires</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Documents courants</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Pièce d'identité valide</li>
                <li>• Certificat de scolarité</li>
                <li>• Diplômes précédents</li>
                <li>• Relevé de notes</li>
              </ul>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Documents spécifiques</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Lettre de motivation</li>
                <li>• CV actualisé</li>
                <li>• Recommandations</li>
                <li>• Certificats médicaux (le cas échéant)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="bourses" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-black text-white mb-6">Financement et bourses</h2>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">Bourses disponibles</h3>
              <p className="text-slate-300 mb-4">Plusieurs types de financement peuvent vous aider :</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bourses d'État du Cameroun</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bourses des établissements</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bourses d'organismes internationaux</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Financement personnel ou familial</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">Comment postuler ?</h3>
              <p className="text-slate-300">
                Contactez directement les établissements ou consulter les appels à candidatures 
                publiés sur leurs sites officiels.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 p-8 bg-linear-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-indigo-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Vous avez d'autres questions ?</h2>
          <p className="text-slate-300 mb-6">Consultez notre FAQ ou contactez-nous</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Voir la FAQ
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
