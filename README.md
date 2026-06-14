# 🎓 ScolaritéApp — Gestion de scolarité (Spring Boot + React)

Projet de fin de module **Spring**. Application web de gestion de scolarité
(étudiants, enseignants, filières, modules, inscriptions, notes) avec un backend
**Spring Boot** exposant une **API REST sécurisée par JWT** et un frontend **React**.

> Réimplémentation en écosystème **Java / Spring** d'un cas d'usage initialement
> proposé en Django.

---

## 🧱 Architecture

```
┌──────────────────┐   HTTP/JSON + JWT   ┌────────────────────────┐   JPA   ┌──────────┐
│  Frontend React  │ ──────────────────▶ │  Backend Spring Boot   │ ──────▶ │  Base    │
│  (Vite + TS)     │ ◀────────────────── │  REST API + Security   │         │  H2/MySQL│
└──────────────────┘                     └────────────────────────┘         └──────────┘
```

- **Backend** : Spring Boot 3.3, Spring Web, Spring Data JPA, Spring Security (JWT), Java 21, Maven.
- **Frontend** : React 19 + TypeScript + Vite, React Router, Axios, Tailwind CSS.
- **Base de données** : H2 en mémoire (développement), MySQL (production).
- **Documentation API** : Swagger UI (springdoc-openapi).

```
projet-scolarite/
├── backend/     # API Spring Boot
├── frontend/    # Application React
└── docs/        # Rapport technique + captures
```

---

## ✅ Prérequis

| Outil  | Version conseillée |
|--------|--------------------|
| Java (JDK) | 21 |
| Maven  | 3.9+ |
| Node.js | 20+ |
| npm    | 10+ |

---

## 🚀 Lancement en développement

### 1) Backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run      # ou : mvn spring-boot:run
```

> Sous Windows : `mvnw.cmd spring-boot:run`

Au démarrage, une base H2 en mémoire est créée et **alimentée avec des données de démonstration**.

- API : http://localhost:8080/api
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- Console H2 : http://localhost:8080/h2-console (JDBC URL : `jdbc:h2:mem:scolaritedb`, user `sa`, sans mot de passe)

### 2) Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Application : http://localhost:5173

Le serveur Vite redirige automatiquement les appels `/api` vers `http://localhost:8080` (cf. `vite.config.ts`).

---

## 🔐 Comptes de démonstration

| Rôle | Identifiant | Mot de passe | Droits |
|------|-------------|--------------|--------|
| Administrateur | `admin` | `admin123` | Tout gérer (CRUD complet) |
| Enseignant | `prof` | `prof123` | Saisir / modifier les notes |
| Étudiant | `etudiant` | `etud123` | Consultation |

---

## 🔌 Principaux endpoints REST

| Méthode | URL | Rôle requis | Description |
|---------|-----|-------------|-------------|
| POST | `/api/auth/login` | public | Connexion → renvoie un JWT |
| POST | `/api/auth/register` | public | Création de compte |
| GET | `/api/etudiants` | authentifié | Liste des étudiants |
| POST/PUT/DELETE | `/api/etudiants/**` | ADMIN | Gestion des étudiants |
| GET | `/api/etudiants/{id}/notes` | authentifié | Bulletin d'un étudiant |
| GET/POST/PUT/DELETE | `/api/enseignants/**` | ADMIN (écriture) | Gestion des enseignants |
| GET/POST/PUT/DELETE | `/api/filieres/**` | ADMIN (écriture) | Gestion des filières |
| GET/POST/PUT/DELETE | `/api/modules/**` | ADMIN (écriture) | Gestion des modules |
| GET/POST/DELETE | `/api/inscriptions/**` | ADMIN (écriture) | Inscription étudiant ↔ module |
| GET/POST/PUT/DELETE | `/api/notes/**` | ADMIN, ENSEIGNANT (écriture) | Gestion des notes |
| GET | `/api/dashboard/stats` | authentifié | Statistiques d'accueil |

Pour appeler un endpoint protégé : ajouter l'en-tête `Authorization: Bearer <token>`.

---

## 🧪 Tests

```bash
cd backend
mvn test
```

Tests d'intégration de l'authentification et de la sécurité (login, mauvais mot de passe → 401, endpoint protégé sans token → 401).

---

## 🏭 Build de production

### Backend (jar exécutable)
```bash
cd backend
mvn clean package
java -jar target/scolarite-1.0.0.jar --spring.profiles.active=prod
```
En profil `prod`, renseigner les variables d'environnement `DB_URL`, `DB_USER`, `DB_PASSWORD` (MySQL) et `JWT_SECRET`.

### Frontend (fichiers statiques)
```bash
cd frontend
npm run build      # génère le dossier dist/
```
Le contenu de `frontend/dist/` peut être déposé sur n'importe quel hébergement statique
(sous-domaine o2switch, Netlify, Vercel…).

---

## ☁️ Hébergement

- **Frontend** (statique) : sous-domaine o2switch, Netlify ou Vercel.
- **Backend** (Java) : Render, Railway ou Fly.io (o2switch mutualisé ne supporte pas Java).
- **Base MySQL** : o2switch ou hébergeur du backend.

> Pour la démonstration, l'exécution locale (`localhost`) est la plus simple et suffisante.

---

## 👤 Auteur

Projet réalisé dans le cadre du module Spring — Licence Génie Logiciel, FS Kénitra (UIT), 2025-2026.
