# -*- coding: utf-8 -*-
# ============================================================
# COUCHE D'ACCÈS AUX FONCTIONS POSTGRESQL — MODULE VENTES
# ============================================================
# Rôle : encapsuler les appels aux fonctions PL/pgSQL du cycle de vente.
#
# Un cycle de vente côté base se déroule ainsi :
#   1. creer_vente()        -> ouvre une facture (statut en_attente) ;
#   2. ajouter_ligne_vente()-> ajoute un produit au panier ;
#   3. valider_vente()      -> valide : le stock est décrémenté et un
#                              mouvement de stock 'sortie' est créé ;
#   4. (retirer/annuler)    -> corrections éventuelles avant/après validation.
#
# Toutes ces règles (calcul du montant, mise à jour stock, interdiction
# de stock négatif) sont garanties par la base de données.
from django.db import connection


def creer_vente(id_client, id_employe):
    """Crée une nouvelle facture / vente pour un client par un employé.

    Returns
    -------
    int : l'id_vente de la facture créée (statut initial 'en_attente').
    """
    with connection.cursor() as cur:
        cur.execute("SELECT creer_vente(%s, %s)", [id_client, id_employe])
        return cur.fetchone()[0]


def ajouter_ligne_vente(id_vente, id_produit, quantite):
    """Ajoute un produit (avec sa quantité) à une vente.

    La fonction vérifie le stock disponible et recalcule le montant
    de la ligne et de la facture.

    Returns
    -------
    int : l'id_ligne_vente créé.
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT ajouter_ligne_vente(%s, %s, %s)",
            [id_vente, id_produit, quantite],
        )
        return cur.fetchone()[0]


def retirer_ligne_vente(id_ligne_vente):
    """Retire une ligne du panier (avant validation)."""
    with connection.cursor() as cur:
        cur.execute("SELECT retirer_ligne_vente(%s)", [id_ligne_vente])


def valider_vente(id_vente):
    """Valide la vente : décrémente le stock et crée les mouvements.
    C'est l'étape qui « fige » la vente dans les statistiques."""
    with connection.cursor() as cur:
        cur.execute("SELECT valider_vente(%s)", [id_vente])


def annuler_vente(id_vente):
    """Annule une vente (remise en stock, si les règles le permettent)."""
    with connection.cursor() as cur:
        cur.execute("SELECT annuler_vente(%s)", [id_vente])