# -*- coding: utf-8 -*-
from django.db import connection


def creer_vente(id_client, id_employe):
    with connection.cursor() as cur:
        cur.execute("SELECT creer_vente(%s, %s)", [id_client, id_employe])
        return cur.fetchone()[0]


def ajouter_ligne_vente(id_vente, id_produit, quantite):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT ajouter_ligne_vente(%s, %s, %s)",
            [id_vente, id_produit, quantite],
        )
        return cur.fetchone()[0]


def retirer_ligne_vente(id_ligne_vente):
    with connection.cursor() as cur:
        cur.execute("SELECT retirer_ligne_vente(%s)", [id_ligne_vente])


def valider_vente(id_vente):
    with connection.cursor() as cur:
        cur.execute("SELECT valider_vente(%s)", [id_vente])


def annuler_vente(id_vente):
    with connection.cursor() as cur:
        cur.execute("SELECT annuler_vente(%s)", [id_vente])