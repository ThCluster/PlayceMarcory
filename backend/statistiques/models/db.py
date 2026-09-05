# -*- coding: utf-8 -*-
# ============================================================
# COUCHE D'ACCÈS AUX FONCTIONS POSTGRESQL — MODULE STATISTIQUES
# ============================================================
# Rôle : exposer des agrégats calculés par PostgreSQL pour le tableau
# de bord et la page d'analyses (réservés au Directeur/Admin).
#
# Contrairement aux modules d'écriture, ici on ne fait QUE lire et
# agréger : chiffre d'affaires, nombre de commandes, meilleur client,
# meilleur produit. Les calculs lourds sont délégués à la base.
from django.db import connection


def get_chiffre_affaires(date_debut=None, date_fin=None):
    """Retourne le chiffre d'affaires total (éventuellement filtré par période)."""
    with connection.cursor() as cur:
        cur.execute("SELECT chiffre_affaires(%s, %s)", [date_debut, date_fin])
        return cur.fetchone()[0]


def get_nombre_commandes(date_debut=None, date_fin=None, statut=None):
    """Retourne le nombre de commandes, optionnellement filtré par statut."""
    with connection.cursor() as cur:
        cur.execute("SELECT nombre_commandes(%s, %s, %s)", [date_debut, date_fin, statut])
        return cur.fetchone()[0]


def get_meilleur_client(date_debut=None, date_fin=None):
    """Retourne le client ayant généré le plus d'achats.

    La fonction SQL renvoie une ligne multi-colonnes ; on la convertit
    en dictionnaire {nom_colonne: valeur} pour un accès nommé côté Django.

    Returns
    -------
    dict | None
    """
    with connection.cursor() as cur:
        cur.execute("SELECT * FROM meilleur_client(%s, %s)", [date_debut, date_fin])
        row = cur.fetchone()
        if row is None:
            return None
        columns = [c[0] for c in cur.description]
        return dict(zip(columns, row))


def get_meilleur_produit(date_debut=None, date_fin=None, critere="montant"):
    """Retourne le produit le plus vendu, classé par 'montant' (CA) ou par
    quantité selon le critère fourni.

    Returns
    -------
    dict | None
    """
    with connection.cursor() as cur:
        cur.execute("SELECT * FROM meilleur_produit(%s, %s, %s)", [date_debut, date_fin, critere])
        row = cur.fetchone()
        if row is None:
            return None
        columns = [c[0] for c in cur.description]
        return dict(zip(columns, row))