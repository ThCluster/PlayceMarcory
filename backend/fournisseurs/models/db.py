# -*- coding: utf-8 -*-
# ============================================================
# COUCHE D'ACCÈS AUX FONCTIONS POSTGRESQL — MODULE FOURNISSEURS
# ============================================================
# Rôle : encapsuler les appels aux fonctions PL/pgSQL de gestion des
# fournisseurs (les entreprises qui approvisionnent le supermarché).
#
# Comme pour les autres modules, on délègue la logique à la base de
# données (contraintes d'unicité, désactivation logique, etc.).
from django.db import connection


def creer_fournisseur(nom_entreprise, contact_nom=None, telephone=None, email=None, adresse=None):
    """Crée un nouveau fournisseur.

    Returns
    -------
    int : l'id_fournisseur créé.
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_fournisseur(%s, %s, %s, %s, %s)",
            [nom_entreprise, contact_nom, telephone, email, adresse],
        )
        return cur.fetchone()[0]


def modifier_fournisseur(id_fournisseur, nom_entreprise=None, contact_nom=None, telephone=None, email=None, adresse=None):
    """Met à jour les champs fournis (None = ne pas toucher)."""
    with connection.cursor() as cur:
        cur.execute(
            "SELECT modifier_fournisseur(%s, %s, %s, %s, %s, %s)",
            [id_fournisseur, nom_entreprise, contact_nom, telephone, email, adresse],
        )


def desactiver_fournisseur(id_fournisseur):
    """Désactive un fournisseur sans le supprimer réellement."""
    with connection.cursor() as cur:
        cur.execute("SELECT desactiver_fournisseur(%s)", [id_fournisseur])