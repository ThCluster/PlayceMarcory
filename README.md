# PlayceMarcory

Projet d'évaluation finale : **Création et Exploitation de données SQL**
Développement d'une plateforme Web de gestion d'un supermarché.

Une application Web (backend **Django** + frontend **React**) dont toute la
logique métier est implémentée dans **PostgreSQL** (fonctions et triggers).

---

## Démarrer le projet

Ouvrir deux terminaux séparés à la racine du projet.

### 1. Backend (Django, port 8000)

```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend (React / Vite, port 3000)

```bash
cd frontend
npm install      # seulement la première fois
npm run dev
```

Puis ouvrir le navigateur sur : **http://localhost:3000**