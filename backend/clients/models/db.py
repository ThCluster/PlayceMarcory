# -*- coding: utf-8 -*-
from django.db import connection


def creer_client(nom, prenom, telephone=None, email=None, adresse=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_client(%s, %s, %s, %s, %s)",
            [nom, prenom, telephone, email, adresse],
        )
        return cur.fetchone()[0]


def modifier_client(id_client, nom=None, prenom=None, telephone=None, email=None, adresse=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT modifier_client(%s, %s, %s, %s, %s, %s)",
            [id_client, nom, prenom, telephone, email, adresse],
        )


def desactiver_client(id_client):
    with connection.cursor() as cur:
        cur.execute("SELECT desactiver_client(%s)", [id_client])