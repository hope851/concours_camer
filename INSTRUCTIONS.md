# 🔧 Instructions de Démarrage - Plateforme Concours

## ✅ Modifications Apportées

Voici ce qui a été corrigé et amélioré dans votre projet:

### 1. **Corrections de Configuration**
   - ✅ Syntaxe JSON du `package.json` corrigée
   - ✅ Configuration `next.config.ts` optimisée
   - ✅ Ancien fichier `prisma.config.ts` supprimé (non-standard)
   - ✅ Fichiers `.env` et `.env.local` configurés

### 2. **Améliorations de l'Interface**
   - ✅ Page d'accueil rénovée avec navigation
   - ✅ Page utilisateur complètement refactorisée
   - ✅ Design moderne avec Tailwind CSS
   - ✅ Tableau amélioré pour afficher les utilisateurs

### 3. **Sécurité et Validation**
   - ✅ Validation des données dans les formulaires
   - ✅ Vérification des emails en doublon
   - ✅ Gestion améliorée des erreurs
   - ✅ Hashage des mots de passe avec bcryptjs

### 4. **Documentation**
   - ✅ README.md mis à jour
   - ✅ Instructions complètes ajoutées

---

## 📋 Étapes Pour Démarrer le Projet

### Étape 1: Installer les Dépendances
```bash
npm install
```

### Étape 2: Configurer la Base de Données
Modifiez le fichier `.env.local` (ou créez-le à partir de `.env`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/concours_camer"
```

**Options de base de données:**
- **PostgreSQL LOCAL**: `postgresql://user:password@localhost:5432/concours_camer`
- **Neon (Cloud)**: `postgresql://user:password@host.neon.tech/database?sslmode=require`
- **Supabase**: Récupérez l'URL depuis votre dashboard Supabase

### Étape 3: Générer le Client Prisma
```bash
npx prisma generate
```

### Étape 4: Créer les Tables de la Base de Données
```bash
npx prisma migrate dev --name init
```

Cela créera:
- La table `users` (utilisateurs)
- Les autres tables (EES, Filiere, Concours, etc.)

### Étape 5: Démarrer le Serveur de Développement
```bash
npm run dev
```

Le serveur démarre sur: `http://localhost:3000`

---

## 🌐 Accéder aux Pages

- **Page d'accueil**: [http://localhost:3000](http://localhost:3000)
- **Gestion des utilisateurs**: [http://localhost:3000/utilisateur](http://localhost:3000/utilisateur)

---

## 🚀 Fonctionnalités Disponibles

### Page d'Accueil
- Navigation vers la gestion des utilisateurs
- Design professionnel et épuré

### Gestion des Utilisateurs
- ✅ **Créer un utilisateur** avec:
  - Nom complet
  - Email (unique)
  - Mot de passe (hashé automatiquement)
  
- ✅ **Voir la liste des utilisateurs** avec:
  - Nom et email
  - Rôle (ADMIN, GESTIONAIRE, USER)
  - Statut (Actif/Inactif)
  - Date d'inscription

---

## 🛠️ Commandes Utiles

```bash
# Démarrer le développement
npm run dev

# Construire pour la production
npm run build

# Démarrer la production
npm start

# Ouvrir Prisma Studio (visualiser la BDD)
npx prisma studio

# Générer le client Prisma après changements du schéma
npx prisma generate

# Créer une nouvelle migration
npx prisma migrate dev --name name_of_migration

# Réinitialiser la base de données (DEV UNIQUEMENT!)
npx prisma migrate reset
```

---

## ⚠️ Dépannage

### Erreur: "Can't reach database server"
**Solution**: Vérifiez que:
1. PostgreSQL est démarré
2. La `DATABASE_URL` est correcte

### Erreur: "Can't find module '@prisma/client'"
**Solution**: Exécutez
```bash
npm install
npx prisma generate
```

### La page utilisateur ne charge pas
**Solution**: 
1. Vérifiez la DATABASE_URL dans `.env.local`
2. Assurez-vous que les migrations ont été exécutées:
```bash
npx prisma migrate dev --name init
```

---

## 📱 Structure de la Base de Données

### Table Users
```
- id (UUID)
- nom (Text)
- email (String, unique)
- password (String, hashé)
- role (ADMIN, GESTIONAIRE, USER) - défaut: USER
- isActive (Boolean) - défaut: true
- date_inscription (DateTime) - défaut: now()
```

---

## 🔐 Sécurité

⚠️ **Importante**: Ne commitez jamais votre `.env.local` sur Git!

Le fichier `.gitignore` est déjà configuré pour ignorer:
- `node_modules/`
- `.env`
- `.env.local`
- Autres fichiers sensibles

---

## 📞 Support Additionnel

Si vous rencontrez des problèmes:
1. Consultez le [README.md](README.md)
2. Vérifiez les logs du terminal
3. Vérifiez que PostgreSQL est en cours d'exécution
4. Vérifiez la DATABASE_URL dans `.env.local`

---

**Projet prêt! 🎉** Commencez par l'Étape 1 et suivez chaque étape dans l'ordre.
