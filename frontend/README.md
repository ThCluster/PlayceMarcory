# PlayceMarcory — Frontend

Interface d'administration du supermarché **PlayceMarcory**, construite avec
**React 19 + Vite + TypeScript + Tailwind CSS**. Elle communique avec le
backend **Django REST Framework** (port `8000`).

Le port de développement du frontend est **3000**. Les appels API sont
proxys vers le backend via `vite.config.ts`.

## Démarrage

```bash
npm install        # installer les dépendances
npm run dev        # lancer le serveur de dev sur http://localhost:3000
npm run build      # compiler en production
```

## Structure du projet

```
frontend/
├── src/                       # Code source de l'application
│   ├── api/                   # Couche de communication avec le backend
│   ├── components/            # Composants UI réutilisables
│   ├── context/               # État global de l'application (React Context)
│   ├── pages/                 # Écrans / pages de l'application
│   ├── types/                 # Types TypeScript partagés
│   ├── App.tsx                # Définition des routes (React Router)
│   ├── index.css              # Styles globaux (Tailwind)
│   └── main.tsx               # Point d'entrée de l'application
├── index.html                 # Page HTML racine montée par Vite
├── vite.config.ts             # Configuration Vite (proxy API, etc.)
├── tsconfig.json              # Configuration du compilateur TypeScript
└── package.json               # Dépendances et scripts npm
```

---

## Explication de chaque dossier

### `src/api/` — Communication avec le backend

Couche qui centralise **tous les appels HTTP** vers l'API Django. Elle est
utilisée par le reste de l'application et isole le "comment on parle au
serveur" du reste du code.

- **`client.ts`** : client HTTP centralisé basé sur `fetch`. Gère le token
  **JWT** (stocké dans `localStorage`), l'ajout automatique de l'en-tête
  `Authorization`, le renouvellement du token en cas de `401`, et le
  `cache: 'no-store'` (pour toujours récupérer des données fraîches).
  Expose `api.get / post / patch / delete`.
- **`services.ts`** : fonctions métier par ressource (« services »). Chaque
  fonction appelle le client et **transforme** la réponse backend en objets
  du frontend. Exemples :
  - `fetchSuppliers()` → liste des fournisseurs (avec `totalPurchases`),
  - `fetchSales()` → ventes,
  - `loadAllData()` → charge toutes les données du contexte en un appel,
  - `creerClient()`, `creerVente()`, `enregistrerPaiementClient()`, etc.
    → actions d'écriture branchées sur le backend.

### `src/components/` — Composants UI réutilisables

Composants d'interface partagés par plusieurs pages. Divisé en trois
sous-dossiers selon leur rôle.

- **`common/`** : petits composants génériques.
  - `Badge.tsx` — badge/étiquette coloré,
  - `CarrefourLogo.tsx` — logo du magasin,
  - `StatCard.tsx` — carte d'indicateur (KPI) utilisée sur le tableau de bord.
- **`layout/`** : structure globale de l'application une fois connecté.
  - `Sidebar.tsx` — menu latéral, **filtré selon le rôle** de l'utilisateur
    (Administrateur, Directeur, Magasinier, Vendeur),
  - `Header.tsx` — barre du haut (recherche, notifications, profil).
- **`modals/`** : fenêtres modales de création/édition.
  - `ActionModals.tsx` — les modales d'action (ajout client, produit,
    vente, fournisseur, paiement, employé, etc.),
  - `SaleDetailModal.tsx` — modale de détail d'une vente (lignes du panier).

### `src/context/` — État global

- **`AppContext.tsx`** : fournisseur de contexte React qui détient **tout
  l'état partagé** de l'application : les données métier (ventes, achats,
  produits, clients, fournisseurs…), l'authentification, les modales actives,
  les notifications. Il expose aussi les **actions** (`addSale`,
  `addSupplier`, `addPayment`…) qui appellent le backend puis rechargent
  les données via `loadAllData()`.

### `src/pages/` — Écrans de l'application

Une page par écran du menu. Voici celles correspondant à chaque module :

| Fichier | Écran |
|---|---|
| `LoginPage.tsx` | Connexion (email + mot de passe) |
| `DashboardPage.tsx` | Tableau de bord (CA, achats, stock, graphiques) |
| `VentesPage.tsx` | Enregistrement / historique des ventes |
| `AchatsPage.tsx` | Achats fournisseurs / réapprovisionnements |
| `FournisseursPage.tsx` | Répertoire des fournisseurs et volumes d'achats |
| `ClientsPage.tsx` | Carnet des clients |
| `ProduitsPage.tsx` | Catalogue produits |
| `StocksPage.tsx` | Gestion des stocks et mouvements |
| `CategoriesPage.tsx` | Catégories de produits |
| `PaiementsPage.tsx` | Historique des paiements (recettes / dépenses) |
| `EmployesPage.tsx` | Gestion des employés et rôles |
| `StatistiquesPage.tsx` | Indicateurs de pilotage |
| `RapportsPage.tsx` | Export de rapports (CSV) |
| `ParametresPage.tsx` | Paramètres de la plateforme |

### `src/types/` — Types TypeScript partagés

- **`index.ts`** : définitions de types/interfaces utilisées partout dans le
  frontend : `Sale`, `Purchase`, `Product`, `Client`, `Supplier`, `Employee`,
  `Category`, `PaymentRecord`, `StockMovement`, `NotificationItem`, etc.
  Elles décrivent la forme des objets manipulés par les composants.

### `src/App.tsx` — Routes

Définit le routage de l'application (React Router) : relie chaque URL
(`/dashboard`, `/ventes`, `/achats`…) à sa page, avec la protection des
routes connectées.

### `src/main.tsx` — Point d'entrée

Monte l'application React (`ReactDOM.createRoot`) et enveloppe toute
l'application dans le `AppProvider` (contexte global).

---

## Fichiers de configuration à la racine

- **`index.html`** : page HTML de départ montée par Vite (balise `<div id="root">`).
- **`vite.config.ts`** : configuration Vite — définitions du port (3000),
  de l'hôte, et surtout le **proxy** des requêtes `/api` vers le backend
  Django (`http://127.0.0.1:8000`).
- **`tsconfig.json`** : options du compilateur TypeScript.
- **`package.json`** : liste des dépendances et scripts (`dev`, `build`).
- **`.env.example`** : modèle des variables d'environnement nécessaires.
