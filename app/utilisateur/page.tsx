import Link from "next/link";
import prisma from "../../lib/prisma";
import { RegisterUser } from "../action/user";

export default async function UsersPage() {
  // Récupération des utilisateurs depuis la BDD
  let users: any[] = [];
  try {
    users = await prisma.users.findMany({
      orderBy: { date_inscription: 'desc' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
  }

  async function handleAction(formData: FormData) {
  "use server"; // On répète la directive ici pour être sûr
  await RegisterUser(formData);
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Concours Cameroun
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Gestion des Utilisateurs</h1>

        {/* Section création d'utilisateur */}
        <div className="bg-white rounded-lg shadow p-8 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Créer un Nouvel Utilisateur</h2>
          
          <form action={handleAction} className="space-y-4 max-w-md">
            <input 
              name="nom" 
              type="text" 
              placeholder="Nom complet" 
              required 
              className="w-full p-2 border rounded"
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              required 
              className="w-full p-2 border rounded"
            />
            <input 
              name="password" 
              type="password" 
              placeholder="Mot de passe" 
              required 
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Créer l'utilisateur
            </button>
          </form>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm">{user.nom}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
