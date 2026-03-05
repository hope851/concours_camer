'use client';

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Erreur d'envoi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
        <Navbar />

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-4">Nous Contacter</h1>
          <p className="text-slate-400">
            Avez-vous une question ? Nous sommes là pour vous aider
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Informations de contact</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-semibold mb-1">Email</p>
                  <a
                    href="mailto:balepahope@gmail.com"
                    className="text-white hover:text-indigo-300 transition"
                  >
                    contact@concours-camer.cm
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-semibold mb-1">Téléphone</p>
                  <a
                    href="tel:+237695123456"
                    className="text-white hover:text-indigo-300 transition"
                  >
                    +237 6 95 12 34 56
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-semibold mb-1">Localisation</p>
                  <p className="text-white">
                    Yaoundé, Cameroun
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-slate-400 text-sm mb-3">
                <strong className="text-white">Temps de réponse :</strong>
              </p>
              <p className="text-slate-300 text-sm">
                Nous répondons généralement dans les 24-48 heures.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition"
                  placeholder="Votre nom"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Sujet
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="general">Question générale</option>
                  <option value="error">Signaler une erreur</option>
                  <option value="missing">Information manquante</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition resize-none"
                  placeholder="Votre message..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {loading ? "Envoi..." : "Envoyer le message"}
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-300 font-semibold">
                    ✓ Votre message a été envoyé avec succès !
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <p className="text-slate-400 mb-4">
            Vous cherchez des réponses rapides ?
          </p>
          <a
            href="/faq"
            className="inline-block text-indigo-300 hover:text-indigo-200 font-semibold transition"
          >
            Consultez notre FAQ →
          </a>
        </div>
      </div>
    </div>
  );
}
