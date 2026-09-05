# Fichier : comptes/models/verification.py
# -*- coding: utf-8 -*-
from django.db import connection


def verifier_connexion(email, mot_de_passe):
    with connection.cursor() as cur:
        cur.execute("SELECT * FROM verifier_connexion(%s, %s)", [email, mot_de_passe])
        row = cur.fetchone()
        if row is None:
            return None
        columns = [c[0] for c in cur.description]
        return dict(zip(columns, row))