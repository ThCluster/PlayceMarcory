# -*- coding: utf-8 -*-
from django.db import connection


def get_chiffre_affaires(date_debut=None, date_fin=None):
    with connection.cursor() as cur:
        cur.execute("SELECT chiffre_affaires(%s, %s)", [date_debut, date_fin])
        return cur.fetchone()[0]


def get_nombre_commandes(date_debut=None, date_fin=None, statut=None):
    with connection.cursor() as cur:
        cur.execute("SELECT nombre_commandes(%s, %s, %s)", [date_debut, date_fin, statut])
        return cur.fetchone()[0]


def get_meilleur_client(date_debut=None, date_fin=None):
    with connection.cursor() as cur:
        cur.execute("SELECT * FROM meilleur_client(%s, %s)", [date_debut, date_fin])
        row = cur.fetchone()
        if row is None:
            return None
        columns = [c[0] for c in cur.description]
        return dict(zip(columns, row))


def get_meilleur_produit(date_debut=None, date_fin=None, critere="montant"):
    with connection.cursor() as cur:
        cur.execute("SELECT * FROM meilleur_produit(%s, %s, %s)", [date_debut, date_fin, critere])
        row = cur.fetchone()
        if row is None:
            return None
        columns = [c[0] for c in cur.description]
        return dict(zip(columns, row))