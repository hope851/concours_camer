import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
        <Navbar />

      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-4">Politique de Confidentialité</h1>
          <p className="text-slate-400">Dernière mise à jour : Mars 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Collecte de données</h2>
            <p className="text-slate-300">
              Concours-Camer collecte les informations que vous choisissez de partager via nos formulaires 
              de contact, notamment votre nom, email et message.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Utilisation des données</h2>
            <p className="text-slate-300 mb-3">Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Répondre à vos demandes de contact</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des informations pertinentes (si vous le souhaitez)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cookies</h2>
            <p className="text-slate-300">
              Notre plateforme utilise des cookies pour améliorer votre expérience utilisateur. 
              Vous pouvez les désactiver via les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sécurité</h2>
            <p className="text-slate-300">
              Nous prenons la sécurité de vos données au sérieux et mettons en place des mesures 
              de protection appropriées.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Droits de l'utilisateur</h2>
            <p className="text-slate-300">
              Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles. 
              Contactez-nous pour exercer ces droits.
            </p>
          </section>

          <section className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p className="text-slate-300">
              Pour toute question relative à votre confidentialité, contactez-nous à : 
              <a href="mailto:privacy@concours-camer.cm" className="text-indigo-300 hover:text-indigo-200 ml-1">
                privacy@concours-camer.cm
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
