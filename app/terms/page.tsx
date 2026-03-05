import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
          <Navbar />

        <Navbar />

      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-4">Conditions d'Utilisation</h1>
          <p className="text-slate-400">Dernière mise à jour : Mars 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Accès à la plateforme</h2>
            <p className="text-slate-300">
              Concours-Camer est une plateforme gratuite et accessible à tous. En utilisant ce site, 
              vous acceptez nos conditions d'utilisation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Utilisation acceptable</h2>
            <p className="text-slate-300 mb-3">Vous vous engagez à :</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Utiliser la plateforme de manière légale et éthique</li>
              <li>Ne pas diffuser de contenu offensant ou illégal</li>
              <li>Respecter les droits de propriété intellectuelle</li>
              <li>Ne pas tenter de pirater ou compromettre la sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Responsabilité des informations</h2>
            <p className="text-slate-300">
              Concours-Camer s'efforce de fournir des informations exactes et à jour sur les établissements 
              et concours. Cependant :
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 mt-3">
              <li>Les informations peuvent contenir des erreurs</li>
              <li>Les établissements peuvent modifier leurs offres sans préavis</li>
              <li>Consultez toujours les sites officiels pour confirmation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitation de responsabilité</h2>
            <p className="text-slate-300">
              Concours-Camer n'est pas responsable des erreurs, omissions ou conséquences en découlant. 
              La plateforme est fournie "telle quelle" sans garantie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Propriété intellectuelle</h2>
            <p className="text-slate-300">
              Tout le contenu de Concours-Camer (textes, images, mises en page) est protégé par les droits 
              d'auteur. Vous pouvez le consulter mais non le reproduire sans permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Modification des conditions</h2>
            <p className="text-slate-300">
              Nous pouvons modifier ces conditions à tout moment. les modifications prennent effet 
              immédiatement lors de la publication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Loi applicable</h2>
            <p className="text-slate-300">
              Ces conditions sont régies par les lois de la République du Cameroun.
            </p>
          </section>

          <section className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-3">Questions ?</h2>
            <p className="text-slate-300">
              Pour toute question sur ces conditions, contactez-nous à : 
              <a href="mailto:legal@concours-camer.cm" className="text-indigo-300 hover:text-indigo-200 ml-1">
                legal@concours-camer.cm
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
