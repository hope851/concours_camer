# Système d'Authentification Concours-Camer

## Vue d'ensemble

Le système d'authentification de Concours-Camer permet aux utilisateurs de créer un compte et se connecter pour accéder à des fonctionnalités personnalisées.

## Fonctionnalités

### 1. **Inscription (Registration)**
- Page: `/register`
- Validation des champs (nom, email, mot de passe)
- Vérification de la force du mot de passe
- Vérification de l'unicité de l'email
- Hachage sécurisé du mot de passe avec `bcryptjs`
- Création automatique d'une session après l'inscription

### 2. **Connexion (Login)**
- Page: `/login`
- Validation des informations d'identification
- Vérification du compte actif
- Création d'une session sécurisée
- Redirection après connexion réussie

### 3. **Profil Utilisateur**
- Page: `/utilisateur/profile`
- Affichage des informations personnelles
- Affichage du rôle de l'utilisateur
- Bouton de déconnexion
- Routes protégées

### 4. **Déconnexion (Logout)**
- Suppression de la session
- Redirection vers la page d'accueil

## Architecture Technique

### Fichiers Clés

#### Actions Serveur (`app/action/user.ts`)
```typescript
- RegisterUser(formData)     // Créer un compte
- LoginUser(formData)         // Se connecter
- LogoutUser()               // Se déconnecter
- GetCurrentUser()           // Récupérer l'utilisateur actuel
```

#### Pages Frontend
- `/login` - Page de connexion avec UI moderne
- `/register` - Page d'inscription avec indicateur de force du mot de passe
- `/utilisateur/profile` - Profil utilisateur

#### Composants
- `Navbar.tsx` - Navigation avec affichage du statut d'authentification
- `AuthCallToAction.tsx` - Appels à l'action sur la page d'accueil

#### Middleware (`middleware.ts`)
- Protection des routes
- Redirection basée sur l'authentification

### Base de Données

Modèle `Users` (Prisma):
```prisma
model Users {
  id               String @id @default(uuid())
  email            String @unique
  password         String
  nom              String
  role             Role @default(USER)
  isActive         Boolean @default(true)
  date_inscription DateTime @default(now())
}

enum Role {
  ADMIN
  GESTIONAIRE
  USER
}
```

### Gestion des Sessions

- **Méthode**: Cookies HTTP-only
- **Durée**: 7 jours
- **Sécurité**: 
  - `httpOnly: true` - Protégé contre les attaques XSS
  - `secure: true` (en production) - HTTPS uniquement
  - `sameSite: 'lax'` - Protection CSRF

## Flux d'Authentification

### Inscription
1. Utilisateur remplit le formulaire de registration
2. Validation des données côté serveur
3. Vérification de l'email non existant
4. Hachage du mot de passe
5. Création du compte dans la BD
6. Création d'une session (cookie)
7. Redirection vers `/utilisateur/profile`

### Connexion
1. Utilisateur remplit le formulaire de login
2. Vérification de l'email
3. Vérification du mot de passe
4. Vérification du statut du compte
5. Création d'une session (cookie)
6. Redirection vers `/utilisateur/profile`

### Accès aux Routes Protégées
1. Middleware vérifie l'existence du cookie `userId`
2. Si absent: redirection vers `/login`
3. Si présent: accès autorisé à la page

## Sécurité

- **Hachage des mots de passe**: `bcryptjs` avec 10 rounds
- **Validation des emails**: Vérification d'ounicité
- **Sessions sécurisées**: Cookies HTTP-only
- **Protection des routes**: Middleware d'authentification
- **Validation côté serveur**: Toutes les données validées

## Routes Protégées

Les routes suivantes nécessitent une authentification:
- `/utilisateur/*`
- `/formupdateconcours`
- `/formupdateees`
- `/formupdatetutelle`

## Utilisation

### Créer un Nouveau Compte
1. Cliquez sur "S'inscrire" dans la barre de navigation
2. Remplissez le formulaire
3. Cliquez sur "Créer mon compte"
4. Vous serez automatiquement connecté

### Se Connecter
1. Cliquez sur "Se connecter" dans la barre de navigation
2. Entrez vos identifiants
3. Cliquez sur "Se connecter"
4. Vous serez redirigé vers votre profil

### Se Déconnecter
1. Cliquez sur votre nom dans la barre de navigation
2. Cliquez sur "Déconnexion"

## Personnalisation

Pour modifier le système d'authentification:

1. **Ajouter des champs utilisateur**: Modifiez le schéma `Users` dans `prisma/schema.prisma`
2. **Changer la durée de session**: Modifiez `maxAge` dans les fonctions d'action
3. **Ajouter des rôles**: Ajoutez des valeurs à l'enum `Role` dans le schéma
4. **Personnaliser les pages**: Modifiez les fichiers dans `/app/login` et `/app/register`

## Dépendances

- `next`: Framework React
- `bcryptjs`: Hachage des mots de passe
- `@prisma/client`: ORM
- `lucide-react`: Icônes
- `tailwindcss`: Styling CSS

## Exemple d'Utilisation

### Vérifier si un utilisateur est connecté

En client-side:
```tsx
const user = await GetCurrentUser();
if (!user) {
  // L'utilisateur n'est pas connecté
}
```

### Protéger une page

La protection est automatique grâce au middleware.

### Créer un formulaire de login personnalisé

```tsx
async function handleLogin(email: string, password: string) {
  const formData = new FormData();
  formData.set('email', email);
  formData.set('password', password);
  
  const result = await LoginUser(formData);
  if (result.success) {
    // Redirection
  } else {
    // Afficher l'erreur
  }
}
```

## Dépannage

### La redirection ne fonctionne pas
- Vérifiez que le middleware est correctement configuré
- Vérifiez les permissions des fichiers

### Les sessions ne persistent pas
- Vérifiez que les cookies sont activés
- Vérifiez la configuration HTTPS en production

### Erreur "Email déjà utilisé"
- Cet email est déjà associé à un compte
- Utilisez "Se connecter" à la place

## Support

Pour toute question ou problème d'authentification, veuillez consulter la documentation ou contacter le support.
