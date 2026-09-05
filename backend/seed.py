# -*- coding: utf-8 -*-
"""
Script de génération de données de démonstration (seed) pour PlayceMarcory.

Idempotent : il peut être relancé sans risque (il purge les données métier
existantes avant de réinsérer). Il utilise les fonctions PL/pgSQL du projet
(creer_client, creer_produit, creer_vente, ajouter_ligne_vente, valider_vente,
enregistrer_paiement_client, ajuster_stock) pour que toute la logique métier
s'applique : déclencheurs de mise à jour du stock, calcul des montants,
interdiction de stock négatif, etc.

Lancer depuis le dossier backend :
    python seed.py
"""
import os
import random
from datetime import timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.db import connection
from django.utils import timezone

from comptes.models.db import creer_employe


# ---------------------------------------------------------------------------
# Données réalistes (supermarché ivoirien)
# ---------------------------------------------------------------------------
EMPLOYES = [
    ("Kouassi", "Marie", "magasinier", "marie.kouassi@supermarche.com"),
    ("Ouattara", "Fatou", "vendeur", "fatou.ouattara@supermarche.com"),
    ("Kone", "Ibrahim", "vendeur", "ibrahim.kone@supermarche.com"),
    ("Diallo", "Aminata", "directeur", "aminata.diallo@supermarche.com"),
]

CATEGORIES = [
    ("Épicerie", "Produits secs, riz, sucre, conserves"),
    ("Boissons", "Eaux, sodas, jus"),
    ("Produits laitiers", "Lait, yaourts, beurre"),
    ("Boulangerie", "Pain, pâtisseries"),
    ("Hygiène", "Savons, lessives, produits d'entretien"),
    ("Fruits & Légumes", "Produits frais"),
    ("Congelé", "Poissons, viandes surgelées"),
    ("Snacks", "Biscuits, chips, confiseries"),
]

FOURNISSEURS = [
    ("SODEXCI SA", "Jean-Marc Tano", "0102030405", "contact@sodexci.ci", "Zone industrielle, Yopougon, Abidjan"),
    ("CFAO Distribution", "Awa Traore", "0506070809", "cfao@cfao.ci", "Boulevard de Marseille, Abidjan"),
    ("Ivory Foods", "Serge N'Guessan", "0708091011", "contact@ivoryfoods.ci", "Marcory, Abidjan"),
    ("Transit Ouest", "Yao Kouadio", "0910111213", "transit@ouest.ci", "San Pedro"),
]

CLIENTS = [
    ("Kouadio", "Jean", "0102030405", "jean.kouadio@gmail.com", "Cocody, Abidjan"),
    ("Diarra", "Aissatou", "0506070809", "aissatou.diarra@yahoo.fr", "Treichville, Abidjan"),
    ("Bamba", "Moussa", "0708091011", "bamba.moussa@outlook.com", "Yopougon, Abidjan"),
    ("Yao", "Koffi", "0910111213", "yao.koffi@gmail.com", "Adjamé, Abidjan"),
    ("N'Dri", "Aya", "0102030406", "aya.ndri@gmail.com", "Marcory, Abidjan"),
    ("Soro", "Lamine", "0506070805", "soro.lamine@hotmail.com", "Koumassi, Abidjan"),
    ("Kouakou", "Grace", "0708091002", "grace.kouakou@gmail.com", "Port-Bouët, Abidjan"),
    ("Coulibaly", "Ousmane", "0910111203", "cousmane@gmail.com", "Attécoubé, Abidjan"),
    ("Guede", "Sarah", "0102030407", "sarah.guede@gmail.com", "Riviera, Abidjan"),
    ("Traore", "Issa", "0506070802", "issa.traore@yahoo.fr", "Abobo, Abidjan"),
]

# (index catégorie (0..7), nom, prix_achat, prix_vente, seuil_alerte, code_barre, unite)
PRODUITS = [
    (0, "Riz parfumé 5kg", 3200, 4000, 40, "6200000000017", "Sac"),
    (0, "Riz parfumé 25kg", 15000, 18200, 15, "6200000000024", "Sac"),
    (0, "Sucre en poudre 1kg", 750, 1000, 30, "6200000000031", "Paquet"),
    (0, "Huile végétale 1L", 1200, 1500, 25, "6200000000048", "Bouteille"),
    (0, "Tomate concentrée 70g", 180, 250, 60, "6200000000055", "Boîte"),
    (0, "Sardines à l'huile 125g", 500, 700, 50, "6200000000062", "Boîte"),
    (0, "Manioc (attiéké) 1kg", 800, 1200, 20, "6200000000079", "Paquet"),
    (1, "Eau minérale 1,5L", 400, 600, 80, "6200000000086", "Bouteille"),
    (1, "Soda sucré 50cl", 350, 500, 70, "6200000000093", "Bouteille"),
    (1, "Jus d'orange 1L", 900, 1300, 40, "6200000000109", "Brique"),
    (2, "Lait entier 1L", 900, 1200, 45, "6200000000116", "Brique"),
    (2, "Yaourt nature 125g", 200, 350, 60, "6200000000123", "Pot"),
    (2, "Beurre 250g", 1500, 2000, 20, "6200000000130", "Plaquette"),
    (3, "Pain baguette", 250, 400, 30, "6200000000147", "Pièce"),
    (4, "Savon de ménage 250g", 300, 450, 40, "6200000000154", "Pièce"),
    (4, "Lessive en poudre 1kg", 1400, 1800, 25, "6200000000161", "Sachet"),
    (4, "Dentifrice 75ml", 600, 900, 35, "6200000000178", "Tube"),
    (5, "Bananes 1kg", 500, 800, 25, "6200000000185", "Kg"),
    (5, "Tomates fraîches 1kg", 700, 1100, 20, "6200000000192", "Kg"),
    (5, "Oignons 1kg", 600, 900, 25, "6200000000208", "Kg"),
    (6, "Poulet congelé 1kg", 2500, 3500, 15, "6200000000215", "Kg"),
    (6, "Poisson (capitaine) 1kg", 4000, 5500, 10, "6200000000222", "Kg"),
    (7, "Biscuits au chocolat", 250, 400, 50, "6200000000239", "Paquet"),
    (7, "Chips de pommes 80g", 300, 500, 40, "6200000000246", "Sachet"),
]

MODES_PAIEMENT = ["especes", "mobile_money", "carte", "virement"]


# ---------------------------------------------------------------------------
# Utilitaires SQL
# ---------------------------------------------------------------------------
def ex(sql, params=None, fetch=True):
    with connection.cursor() as cur:
        cur.execute(sql, params or [])
        if fetch:
            try:
                return cur.fetchone()[0]
            except Exception:
                return None
        return None


def purge():
    """Purge les tables métier dans l'ordre respectant les clés étrangères."""
    tables = [
        "historique_prix",
        "paiement_fournisseur",
        "paiement_client",
        "paiements",
        "ventes",  # déclenche le journal de suppression ; lignes_vente restent
        "lignes_vente",
        "achats",
        "lignes_achat",
        "mouvements_stock",
        "stocks",
        "produits",
        "fournisseurs",
        "clients",
        "categories",
    ]
    for t in tables:
        ex(f"DELETE FROM {t}", fetch=False)
    print("  purge des tables métier : OK")


def creer_categories():
    for nom, desc in CATEGORIES:
        ex(
            "INSERT INTO categories (nom, description, actif, date_creation) "
            "VALUES (%s, %s, TRUE, %s)",
            [nom, desc, timezone.now()],
        )


def ids_map(requete):
    with connection.cursor() as cur:
        cur.execute(requete)
        return {r[0]: r[1] for r in cur.fetchall()}


def creer_produits():
    # mapping nom -> id
    cat_par_nom = {nom: cid for cid, nom in ids_map("SELECT id_categorie, nom FROM categories").items()}
    for (cat_idx, nom, pa, pv, seuil, code, unite) in PRODUITS:
        cid = cat_par_nom.get(CATEGORIES[cat_idx][0])
        if cid:
            ex(
                "SELECT creer_produit(%s, %s, %s, %s, %s, %s, %s)",
                [cid, nom, pa, pv, seuil, code, unite],
            )


def creer_fournisseurs():
    for (nom, contact, tel, email, adresse) in FOURNISSEURS:
        ex("SELECT creer_fournisseur(%s, %s, %s, %s, %s)", [nom, contact, tel, email, adresse])


def creer_clients():
    for (nom, prenom, tel, email, adresse) in CLIENTS:
        ex("SELECT creer_client(%s, %s, %s, %s, %s)", [nom, prenom, tel, email, adresse])


def creer_employes():
    for (nom, prenom, poste, email) in EMPLOYES:
        try:
            creer_employe(nom, prenom, poste, email, "demo1234", "0700000000")
        except Exception:
            # email déjà présent -> on passe
            pass


def ajuster_stock_initial():
    with connection.cursor() as cur:
        cur.execute("SELECT id_produit, GREATEST(seuil_alerte * 8, 30) FROM produits")
        for (pid, qte) in cur.fetchall():
            ex("SELECT ajuster_stock(%s, %s, %s)", [pid, qte, "Stock initial de démonstration"])


def stock_disponible(pid):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT COALESCE(quantite_actuelle, 0) FROM stocks WHERE id_produit=%s",
            [pid],
        )
        row = cur.fetchone()
        return float(row[0]) if row else 0.0


def creer_ventes_et_paiements():
    random.seed(42)
    maintenant = timezone.now()

    with connection.cursor() as cur:
        cur.execute("SELECT id_employe FROM employes")
        id_employes = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT id_client FROM clients")
        id_clients = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT id_produit FROM produits")
        id_produits = [r[0] for r in cur.fetchall()]

    if not (id_employes and id_clients and id_produits):
        print("  -> référentiels incomplets ; ventes ignorées")
        return 0

    nb_ventes = 0
    for i in range(90):
        cid = random.choice(id_clients)
        eid = random.choice(id_employes)

        vente_id = ex("SELECT creer_vente(%s, %s)", [cid, eid])
        if not vente_id:
            continue

        jours_arriere = random.randint(1, 150)
        ex(
            "UPDATE ventes SET date_vente=%s WHERE id_vente=%s",
            [maintenant - timedelta(days=jours_arriere), vente_id],
        )

        # 1 à 6 lignes, en respectant le stock disponible
        produits_vente = []
        for pid in random.sample(id_produits, min(6, len(id_produits))):
            max_qte = int(stock_disponible(pid))
            if max_qte >= 1:
                qte = random.randint(1, min(5, max_qte))
                produits_vente.append((pid, qte))

        for (pid, qte) in produits_vente:
            ex("SELECT ajouter_ligne_vente(%s, %s, %s)", [vente_id, pid, qte])

        validee = False
        if random.random() < 0.9:
            ex("SELECT valider_vente(%s)", [vente_id])
            validee = True
            nb_ventes += 1

        if validee and random.random() < 0.85:
            total = ex("SELECT montant_total FROM ventes WHERE id_vente=%s", [vente_id])
            if total:
                total = float(total)
                if random.random() < 0.3:
                    total = total * random.uniform(0.3, 0.95)
                ex(
                    "SELECT enregistrer_paiement_client(%s, %s, %s, %s, %s)",
                    [vente_id, round(total, 2), random.choice(MODES_PAIEMENT), eid, f"REF-{1000+i}"],
                )

    return nb_ventes


def creer_achats():
    """Crée des achats fournisseurs. Les triggers PostgreSQL calculent le
    montant_total (trg_calcul_montant_achat) et mettent à jour le stock
    (trg_maj_stock_achat) automatiquement à l'insertion des lignes."""
    random.seed(7)
    maintenant = timezone.now()

    with connection.cursor() as cur:
        cur.execute("SELECT id_fournisseur FROM fournisseurs")
        id_fournisseurs = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT id_employe FROM employes")
        id_employes = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT id_produit, prix_achat FROM produits")
        produits = cur.fetchall()

    if not (id_fournisseurs and id_employes and produits):
        print("  -> référentiels incomplets ; achats ignorés")
        return 0

    id_par_produit, prix_achat_par_produit = {}, {}
    for (pid, prix) in produits:
        id_par_produit[pid] = pid
        prix_achat_par_produit[pid] = float(prix)

    statuts = ["en_attente", "validee", "annulee"]
    nb = 0
    for i in range(24):
        f_id = random.choice(id_fournisseurs)
        e_id = random.choice(id_employes)
        jours_arriere = random.randint(1, 120)
        date_a = maintenant - timedelta(days=jours_arriere)
        statut = random.choice(statuts)

        # insertion de l'achat (montant total recalcule par trigger)
        achat_id = ex(
            "INSERT INTO achats (id_fournisseur, id_employe, date_achat, statut, montant_total, montant_paye) "
            "VALUES (%s, %s, %s, %s, 0, 0) RETURNING id_achat",
            [f_id, e_id, date_a, statut],
        )
        if not achat_id:
            continue

        nb_lignes = random.randint(2, 6)
        for pid in random.sample(list(id_par_produit.keys()), min(nb_lignes, len(id_par_produit))):
            qte = random.randint(5, 50)
            prix = prix_achat_par_produit.get(pid, 1000)
            ex(
                "INSERT INTO lignes_achat (id_achat, id_produit, quantite, prix_unitaire) "
                "VALUES (%s, %s, %s, %s)",
                [achat_id, pid, qte, prix],
            )

        nb += 1

    return nb


def creer_historique_prix():
    """Peuple la table historique_prix (auparavant vide). Deux mécanismes :
    1) modifier_produit() déclenche le trigger trg_historique_prix qui
       enregistre l'anciennouveau prix ;
    2) insertion directe de lignes rétroactives (date_modification dans le
       passé + modifie_par) pour un historique de démonstration riche."""
    maintenant = timezone.now()

    # 1) vrais changements de prix via le trigger PostgreSQL
    with connection.cursor() as cur:
        cur.execute("SELECT id_produit FROM produits")
        ids = [r[0] for r in cur.fetchall()]
    if ids:
        for pid in ids[:5]:
            pa = ex("SELECT prix_achat FROM produits WHERE id_produit=%s", [pid])
            pv = ex("SELECT prix_vente FROM produits WHERE id_produit=%s", [pid])
            if pa is not None:
                ex(
                    "SELECT modifier_produit(%s, NULL, %s, %s, NULL)",
                    [pid, round(float(pa) * 1.12, 2), round(float(pv) * 1.15, 2)],
                )

    # 2) historique rétroactif (modifications de prix sur les derniers mois)
    ex(
        "INSERT INTO historique_prix (id_produit, ancien_prix_achat, nouveau_prix_achat, "
        "ancien_prix_vente, nouveau_prix_vente, date_modification, modifie_par) VALUES "
        "(%s, %s, %s, %s, %s, %s, %s)",
        [ids[0] if ids else None, 1200, 1300, 1500, 1650, maintenant - timedelta(days=145), "Direction"],
    )
    ex(
        "INSERT INTO historique_prix (id_produit, ancien_prix_achat, nouveau_prix_achat, "
        "ancien_prix_vente, nouveau_prix_vente, date_modification, modifie_par) VALUES "
        "(%s, %s, %s, %s, %s, %s, %s)",
        [ids[1] if len(ids) > 1 else None, 800, 900, 1000, 1150, maintenant - timedelta(days=100), "Direction"],
    )
    ex(
        "INSERT INTO historique_prix (id_produit, ancien_prix_achat, nouveau_prix_achat, "
        "ancien_prix_vente, nouveau_prix_vente, date_modification, modifie_par) VALUES "
        "(%s, %s, %s, %s, %s, %s, %s)",
        [ids[2] if len(ids) > 2 else None, 350, 400, 500, 575, maintenant - timedelta(days=60), "Direction"],
    )
    ex(
        "INSERT INTO historique_prix (id_produit, ancien_prix_achat, nouveau_prix_achat, "
        "ancien_prix_vente, nouveau_prix_vente, date_modification, modifie_par) VALUES "
        "(%s, %s, %s, %s, %s, %s, %s)",
        [ids[3] if len(ids) > 3 else None, 2000, 2150, 2400, 2600, maintenant - timedelta(days=30), "Magasinier"],
    )


def creer_paiements_fournisseurs():
    """Règle les achats validés en créant des paiements fournisseurs.
    Utilise la fonction PL/pgSQL enregistrer_paiement_fournisseur qui insère
    dans paiements (type='fournisseur') et paiement_fournisseur, puis ajuste
    montant_paye de l'achat. Les dates sont rétroactives (après l'achat)."""
    random.seed(11)
    with connection.cursor() as cur:
        cur.execute("SELECT id_employe FROM employes")
        id_employes = [r[0] for r in cur.fetchall()]
        cur.execute(
            "SELECT id_achat, date_achat, montant_total FROM achats "
            "WHERE statut='validee' ORDER BY id_achat"
        )
        achats = cur.fetchall()
    if not (id_employes and achats):
        print("  -> aucun achat validé ; paiements fournisseurs ignorés")
        return 0

    nb = 0
    for (id_achat, date_achat, montant_total) in achats:
        eid = random.choice(id_employes)
        mode = random.choice(MODES_PAIEMENT)
        # paiement complet ou acompte (30 à 100 %)
        fraction = random.choice([0.5, 0.75, 1.0, 1.0, 0.3])
        montant = round(float(montant_total) * fraction, 2)
        try:
            id_paiement = ex(
                "SELECT enregistrer_paiement_fournisseur(%s, %s, %s, %s, %s)",
                [id_achat, montant, mode, eid, f"ACH-PAY-{id_achat:06d}"],
            )
            # la date du paiement : aujourd'hui, à des heures plus tardives
            # que les recettes pour bien figurer en tête du journal
            heure = timezone.now().replace(hour=random.randint(10, 18),
                                           minute=random.randint(0, 59),
                                           second=random.randint(0, 59),
                                           microsecond=0)
            ex(
                "UPDATE paiements SET date_paiement=%s WHERE id_paiement=%s",
                [heure, id_paiement],
            )
            nb += 1
        except Exception as e:
            print(f"  -> échec paiement fournisseur achat {id_achat}: {e}")
    return nb


def main():
    print("=== Génération des données de démonstration ===")
    print("[étape 1] Purge des données existantes ...")
    purge()
    print("[étape 2] Catégories ...")
    creer_categories()
    print("[étape 3] Produits ...")
    creer_produits()
    print("[étape 4] Stock initial ...")
    ajuster_stock_initial()
    print("[étape 5] Fournisseurs ...")
    creer_fournisseurs()
    print("[étape 6] Clients ...")
    creer_clients()
    print("[étape 7] Employés ...")
    creer_employes()
    print("[étape 8] Ventes + paiements ...")
    nb_ventes = creer_ventes_et_paiements()
    print("[étape 9] Achats fournisseurs ...")
    nb_achats = creer_achats()
    print("[étape 10] Historique des prix ...")
    creer_historique_prix()
    print("[étape 11] Paiements fournisseurs ...")
    nb_paiements_fournisseurs = creer_paiements_fournisseurs()

    print("\n=== Récapitulatif ===")
    with connection.cursor() as cur:
        for t in ["categories", "produits", "fournisseurs", "clients", "employes", "ventes", "achats", "lignes_vente", "lignes_achat", "paiements", "paiement_fournisseur", "historique_prix"]:
            cur.execute(f"SELECT COUNT(*) FROM {t}")
            print(f"  {t}: {cur.fetchone()[0]}")
    print(f"  ventes validées: {nb_ventes} | achats créés: {nb_achats} | paiements fournisseurs: {nb_paiements_fournisseurs}")


if __name__ == "__main__":
    main()