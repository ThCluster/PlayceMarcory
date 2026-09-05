# -*- coding: utf-8 -*-
# couche d'accès aux fonctions PostgreSQL du module comptes
from django.db import connection


def creer_employe(nom, prenom, poste, email, mot_de_passe, telephone=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_employe(%s, %s, %s, %s, %s, %s)",
            [nom, prenom, poste, email, mot_de_passe, telephone],  # même ordre que la signature SQL
        )
        return cur.fetchone()[0]