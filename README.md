# Plateforme de Gestion des Concours - Cameroun

Une application Next.js pour la gestion des concours et des utilisateurs.

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de la Base de Données

Modifiez le fichier `.env.local` avec votre URL de base de données PostgreSQL:

```env
DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/concours_camer"
```

### 3. Initialisation de Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Exécuter les migrations (crée les tables)
npx prisma migrate dev --name init
```

### 4. Démarrage du serveur de développement

```bash
npm run dev
```

L'application est accessible à [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
├── app/
│   ├── action/              # Server Actions
│   │   └── user.ts         # Fonction de création d'utilisateur
│   ├── utilisateur/         # Page de gestion des utilisateurs
│   │   └── page.tsx
│   ├── layout.tsx           # Layout racine
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux
├── lib/
│   └── prisma.ts           # Instance Prisma
├── prisma/
│   └── schema.prisma       # Schéma de la base de données
└── public/                 # Fichiers statiques
```

## 🗄️ Base de Données

Le projet utilise PostgreSQL avec Prisma ORM.

### Modèles Principaux

- **Users**: Gestion des utilisateurs avec authentification
- **EES**: Établissements d'Enseignement Supérieur
- **Filiere**: Filières d'études
- **Concours**: Concours académiques
- **TutelleInstitutionelle**: Entités tutélaires

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcryptjs
- Les données sensibles sont protégées avec des variables d'environnement

## 📝 Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/concours_camer"
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Crée une version de production
- `npm start` - Démarre le serveur de production
- `npm run lint` - Exécute l'analyseur de code

## 📦 Dépendances Principales

- **Next.js 16.1.6** - Framework React
- **Prisma 7.3.0** - ORM Base de données
- **React 19.2.3** - Bibliothèque UI
- **Tailwind CSS 4** - Framework CSS
- **TypeScript** - Typage statique

## 🚨 Dépannage

### Erreur: "Can't find module '@prisma/client'"

Solution: Exécutez `npx prisma generate`

### Erreur: "Database connection failed"

Vérifiez que:
1. PostgreSQL est en cours d'exécution
2. La DATABASE_URL est correcte dans .env.local
3. La base de données existe

## 📞 Support

Pour plus d'informations, consultez:
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)

