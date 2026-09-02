# -*- coding: utf-8 -*-
from django.db import connection


def creer_fournisseur(nom_entreprise, contact_nom=None, telephone=None, email=None, adresse=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_fournisseur(%s, %s, %s, %s, %s)",
            [nom_entreprise, contact_nom, telephone, email, adresse],
        )
        return cur.fetchone()[0]


def modifier_fournisseur(id_fournisseur, nom_entreprise=None, contact_nom=None, telephone=None, email=None, adresse=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT modifier_fournisseur(%s, %s, %s, %s, %s, %s)",
            [id_fournisseur, nom_entreprise, contact_nom, telephone, email, adresse],
        )


def desactiver_fournisseur(id_fournisseur):
    with connection.cursor() as cur:
        cur.execute("SELECT desactiver_fournisseur(%s)", [id_fournisseur])