# -*- coding: utf-8 -*-
# ============================================================
# COUCHE D'ACCÈS AUX FONCTIONS POSTGRESQL — MODULE PRODUITS
# ============================================================
# Rôle : encapsuler les appels aux fonctions PL/pgSQL de gestion des
# produits et du stock.
#
# Les fonctions PostgreSQL centralisent toutes les règles métier :
#   - un prix négatif est interdit (trigger) ;
#   - la modification d'un prix est historisée (table historique_prix) ;
#   - un ajustement de stock trace un mouvement (mouvements_stock).
# Django se contente d'appeler ces fonctions via `SELECT ...`.
from django.db import connection


def creer_produit(id_categorie, nom, prix_achat, prix_vente, seuil_alerte=0, code_barre=None, unite_mesure="unité"):
    """Crée un produit rattaché à une catégorie.

    Returns
    -------
    int : l'id_produit du produit créé.
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_produit(%s, %s, %s, %s, %s, %s, %s)",
            [id_categorie, nom, prix_achat, prix_vente, seuil_alerte, code_barre, unite_mesure],
        )
        return cur.fetchone()[0]


def modifier_produit(id_produit, nom=None, prix_achat=None, prix_vente=None, seuil_alerte=None):
    """Modifie un produit. Si un prix change, le trigger PostgreSQL
    `trg_historique_prix` enregistre automatiquement l'ancien et le
    nouveau prix dans `historique_prix` (traçabilité des prix).
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT modifier_produit(%s, %s, %s, %s, %s)",
            [id_produit, nom, prix_achat, prix_vente, seuil_alerte],
        )


def desactiver_produit(id_produit):
    """Désactive un produit (il n'apparaît plus dans le catalogue), sans
    supprimer l'historique de ses ventes/mouvements."""
    with connection.cursor() as cur:
        cur.execute("SELECT desactiver_produit(%s)", [id_produit])


def ajuster_stock(id_produit, nouvelle_quantite, motif="ajustement manuel"):
    """Force le stock d'un produit à une quantité donnée (inventaire).

    La fonction PostgreSQL `ajuster_stock` crée un mouvement de stock
    (entrée ou sortie selon le sens) avec un motif explicatif, ce qui
    assure la traçabilité complète des stocks.
    """
    with connection.cursor() as cur:
        cur.execute("SELECT ajuster_stock(%s, %s, %s)", [id_produit, nouvelle_quantite, motif])