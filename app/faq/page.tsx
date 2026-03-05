'use client';

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const faqs = [
  {
    question: "Comment m'inscrire sur la plateforme ?",
    answer:
      "Vous n'avez pas besoin de créer un compte pour consulter les formations et concours. Notre plateforme est entièrement gratuite et accessible à tous. Les inscriptions aux concours se font directement auprès des établissements.",
  },
  {
    question: "Puis-je postuler à plusieurs concours ?",
    answer:
      "Oui, vous pouvez postuler à autant de concours que vous le souhaitez, à condition de respecter les dates limites de dépôt et de remplir les prérequis de chaque établissement.",
  },
  {
    question: "Quels sont les frais d'inscription aux concours ?",
    answer:
      "Les frais d'inscription varient selon les établissements. Consultez la page de chaque établissement pour connaître les tarifs exacts. Certains concours peuvent être gratuits.",
  },
  {
    question: "Comment puis-je connaître mes résultats ?",
    answer:
      "Les résultats sont généralement publiés sur les sites officiels des établissements. Nous vous recommandons de consulter régulièrement le site de l'établissement après la date des examens.",
  },
  {
    question: "Y a-t-il une date limite pour m'inscrire ?",
    answer:
      "Oui, chaque concours a une date limite de dépôt. Vous pouvez consulter les dates sur notre plateforme. Ne tardez pas, les délais peuvent être courts !",
  },
  {
    question: "Puis-je modifier mon inscription après l'avoir soumise ?",
    answer:
      "Cela dépend de l'établissement. Contactez directement le service d'admission en cas de modification nécessaire. Nous ne gérons pas les inscriptions, seulement les informations.",
  },
  {
    question: "Comment puis-je m'inscrire à une filière après être admis ?",
    answer:
      "Une fois admis au concours, vous devez effectuer votre inscription pédagogique directement auprès de l'établissement, généralement pendant une période définie. L'établissement vous communiquera les modalités.",
  },
  {
    question: "Y a-t-il des bourses disponibles ?",
    answer:
      "Oui, plusieurs types de bourses existent au Cameroun. L'État propose des bourses, les établissements aussi, ainsi que des organismes internationaux. N'hésitez pas à contacter directement les établissements.",
  },
  {
    question: "Comment signaler une erreur ou une information incorrecte ?",
    answer:
      "Si vous trouvez une information incorrecte ou obsolète, contactez-nous immédiatement via notre formulaire de contact. Nous mettrons à jour l'information au plus vite.",
  },
  {
    question: "La plateforme est-elle officielle ?",
    answer:
      "Concours-Camer est une plateforme indépendante créée pour centraliser les informations sur les formations et concours. Nous ne sommes pas l'organisme officiel d'admission, mais un service informatif.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:border-indigo-500/50 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/10 transition"
      >
        <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-slate-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
        <Navbar />

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-4">Questions Fréquentes</h1>
          <p className="text-slate-400">
            Trouvez les réponses aux questions les plus posées sur Concours-Camer
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-8 bg-linear-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-indigo-500/30">
          <p className="text-slate-400 mb-4">Vous n'avez pas trouvé votre réponse ?</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}
