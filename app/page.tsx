import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen  from-gray-900 to-gray-800 text-white">
      <nav className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">Concours Cameroun</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Bienvenue sur la Plateforme</h2>
          <p className="text-gray-300 text-lg">Gestion des concours et utilisateurs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/utilisateur" className="bg-blue-600 hover:bg-blue-700 p-8 rounded-lg text-center transition">
            <h3 className="text-2xl font-bold mb-2">Gestion des Utilisateurs</h3>
            <p className="text-gray-200">Accéder à la gestion des utilisateurs</p>
          </Link>

          <div className="bg-gray-700 p-8 rounded-lg text-center opacity-50">
            <h3 className="text-2xl font-bold mb-2">Autres Pages</h3>
            <p className="text-gray-200">À venir...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
