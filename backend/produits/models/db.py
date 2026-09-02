# -*- coding: utf-8 -*-
from django.db import connection


def creer_produit(id_categorie, nom, prix_achat, prix_vente, seuil_alerte=0, code_barre=None, unite_mesure="unité"):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_produit(%s, %s, %s, %s, %s, %s, %s)",
            [id_categorie, nom, prix_achat, prix_vente, seuil_alerte, code_barre, unite_mesure],
        )
        return cur.fetchone()[0]


def modifier_produit(id_produit, nom=None, prix_achat=None, prix_vente=None, seuil_alerte=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT modifier_produit(%s, %s, %s, %s, %s)",
            [id_produit, nom, prix_achat, prix_vente, seuil_alerte],
        )


def desactiver_produit(id_produit):
    with connection.cursor() as cur:
        cur.execute("SELECT desactiver_produit(%s)", [id_produit])


def ajuster_stock(id_produit, nouvelle_quantite, motif="ajustement manuel"):
    with connection.cursor() as cur:
        cur.execute("SELECT ajuster_stock(%s, %s, %s)", [id_produit, nouvelle_quantite, motif])