## Boilerplate NestJS Auth

Ce projet est un **boilerplate NestJS** orienté **authentification** prêt à l’emploi, basé sur:

- **NestJS 11**
- **JWT** pour l’authentification stateless
- **Prisma** + **PostgreSQL** pour la couche de persistance
- **bcrypt** pour le hash des mots de passe
- **Swagger** pour la documentation API
- **Throttler** pour la protection contre le brute-force / spam

Il fournit une base solide pour démarrer rapidement une API sécurisée avec gestion des utilisateurs et rôles.

---

## Fonctionnalités principales

- **Authentification JWT**
  - Endpoint `POST /auth/login` (email + password)
  - Génération d’un `access_token` JWT contenant `sub`, `email` et `role`
  - Guard `JwtAuthGuard` pour protéger les routes

- **Gestion des utilisateurs**
  - Module `users` avec `UsersController` et `UsersService`
  - Endpoint `GET /users` (listage des utilisateurs, réservé `ADMIN`)
  - Endpoint `GET /users/me` (retourne l’utilisateur courant)
  - Endpoint `POST /users` (création d’utilisateur, réservé `ADMIN`)
  - Hash du mot de passe avec `bcrypt`
  - Stockage via `Prisma` (`User` model)

- **Rôles & autorisation**
  - Enum `UserRole`
  - Décorateur `@Roles(...)`
  - Guard `RolesGuard` appliqué sur le module `users`

- **Reset de mot de passe**
  - `POST /auth/request-reset-password`
    - Génère un **token JWT de reset** valable 15 minutes (`type: 'password_reset'`)
    - Ne révèle pas si l’email existe (protection privacy)
  - `POST /auth/reset-password`
    - Vérifie le token, son type et son expiration
    - Met à jour le mot de passe (hashé avec `bcrypt`)

- **Rate limiting**
  - `@Throttle` sur :
    - `POST /auth/login` (5 tentatives / minute)
    - `POST /auth/request-reset-password` (3 demandes / minute)
    - `POST /auth/reset-password` (5 tentatives / minute)

- **Documentation Swagger**
  - Décorateurs `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBody`, `@ApiBearerAuth`
  - Fichier `swagger.json` généré et script `sync:postman` (export Postman)

---

## Prérequis

- **Node.js** (version recommandée : 20+)
- **pnpm** (ou adapter les commandes à npm/yarn)
- **PostgreSQL** accessible

---

## Installation

```bash
pnpm install
```

Configurer ensuite les variables d’environnement (fichier `.env` à la racine, par exemple) :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nest_auth_db"
JWT_SECRET="change-me"
NODE_ENV="development"
POSTMAN_API_KEY="api-key"
POSTMAN_COLLECTION_UID="collectionId"
```

Adapter `DATABASE_URL`, `JWT_SECRET` et les autres variables à votre contexte.

---

## Base de données (Prisma)

Le schéma Prisma se trouve dans `prisma/schema.prisma`.

- **Appliquer les migrations existantes** :

```bash
pnpm prisma migrate deploy
```

- **Générer le client Prisma** (si nécessaire) :

```bash
pnpm prisma generate
```

---

## Démarrer le projet

```bash
# développement
pnpm run start:dev

# mode normal
pnpm run start

# production (après build)
pnpm run build
pnpm run start:prod
```

L’API sera disponible sur `http://localhost:3000/api` (par défaut).

---

## Documentation Swagger

- **Swagger UI** : `http://localhost:3000/api/docs` (ou similaire)

---

## Endpoints principaux

- **Auth**
  - `POST /auth/login`  
    - Body : `{ "email": string, "password": string }`  
    - Réponse : `{ "access_token": string }`
  - `POST /auth/request-reset-password`  
    - Body : `{ "email": string }`  
    - Réponse générique (ne révèle pas si l’email existe)
  - `POST /auth/reset-password`  
    - Body : `{ "token": string, "newPassword": string }`

- **Users** (protégé par `JwtAuthGuard` + `RolesGuard`)
  - `GET /users` (role `ADMIN`)
  - `GET /users/profile` (utilisateur connecté)
  - `POST /users` (role `ADMIN`) — création d’utilisateur

---

## Scripts utiles

- **Lancer en dev** : `pnpm run start:dev`
- **Build** : `pnpm run build`
- **Tests unitaires** : `pnpm run test`
- **Tests e2e** : `pnpm run test:e2e`
- **Coverage** : `pnpm run test:cov`
- **Lint** : `pnpm run lint`
- **Format** : `pnpm run format`
- **Sync Postman depuis `swagger.json`** : `pnpm run sync:postman`

---

## Personnalisation

- **Ajouter des champs utilisateur** : modifier le modèle `User` dans `prisma/schema.prisma`, puis générer et migrer.
- **Changer la stratégie JWT** : adapter `jwt.strategy.ts` et la configuration JWT (secret, expiration).
- **Ajouter des rôles** : mettre à jour `UserRole`, les guards et les contrôleurs.
- **Envoyer les emails de reset** : remplacer le `console.log` dans `AuthService.requestPasswordReset` par un appel à votre provider email.

---

## Licence

Ce boilerplate est fourni tel quel dans le cadre du projet `nest-auth`. Adapter la licence selon vos besoins (actuellement `UNLICENSED` dans `package.json`).


## Environnement de build Jenkins


Configurer ensuite les variables d’environnement (fichier `.env.production.local` à la racine, par exemple) :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nest_auth_db"
JWT_SECRET="change-me"
NODE_ENV="development"
POSTMAN_API_KEY="api-key"
POSTMAN_COLLECTION_UID="collectionId"
POSTGRES_USER="test"
POSTGRES_PASSWORD="test"
POSTGRES_DB="test_db"
NODE_ENV='production'
```

Démarrer tous les services :
```bash
docker-compose up -d
```

Arrêter tous les services :
```bash
docker-compose down
```

Arrêter tous les services :
```bash
docker-compose logs -f <service_name>
```

Construire les images sans démarrer les containers :
```bash
docker-compose build
```

L’interface Jenkins sera disponible sur `http://localhost:8080`.

