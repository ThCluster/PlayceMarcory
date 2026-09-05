# -*- coding: utf-8 -*-
# ============================================================
# COUCHE D'ACCÈS AUX FONCTIONS POSTGRESQL — MODULE CLIENTS
# ============================================================
# Rôle : encapsuler les appels aux fonctions PL/pgSQL de gestion des
# clients. La base gère elle-même les règles (identifiants uniques,
# désactivation plutôt que suppression réelle, etc.).
#
# Chaque méthode ouvre un curseur, exécute la fonction SQL via
# `SELECT nom_fonction(...)` puis retourne le résultat. Les `%s` sont
# remplacés par les valeurs fournies (bind params -> anti-injection).
from django.db import connection


def creer_client(nom, prenom, telephone=None, email=None, adresse=None):
    """Crée un nouveau client.

    Returns
    -------
    int : l'id_client du client créé.
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_client(%s, %s, %s, %s, %s)",
            [nom, prenom, telephone, email, adresse],
        )
        return cur.fetchone()[0]


def modifier_client(id_client, nom=None, prenom=None, telephone=None, email=None, adresse=None):
    """Met à jour UNIQUEMENT les champs fournis (None = ne rien changer)."""
    with connection.cursor() as cur:
        cur.execute(
            "SELECT modifier_client(%s, %s, %s, %s, %s, %s)",
            [id_client, nom, prenom, telephone, email, adresse],
        )


def desactiver_client(id_client):
    """Désactive un client (archivage logique), jamais de suppression réelle.

    Idéal pour conserver l'historique des achats/ventes d'un ancien client.
    """
    with connection.cursor() as cur:
        cur.execute("SELECT desactiver_client(%s)", [id_client])