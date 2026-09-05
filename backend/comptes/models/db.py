# -*- coding: utf-8 -*-
# ============================================================
# COUCHE D'ACCÈS AUX FONCTIONS POSTGRESQL — MODULE COMPTES
# ============================================================
# Rôle : faire le pont entre Django (Python) et les fonctions PL/pgSQL
# définies directement dans la base de données.
#
# Pourquoi ne pas utiliser Django ORM ?
#   - La logique métier (hachage du mot de passe, contraintes) est
#     codée côté PostgreSQL pour être garantie par la base quelle que
#     soit l'application qui appelle.
#   - Chaque fonction ici exécute une requête `SELECT nom_fonction(...)`
#     qui appelle la fonction SQL correspondante et retourne son résultat.
#   - Les `%s` sont des paramètres positionnels sécurisés (anti-injection).
#
# Toutes les fonctions renvoient l'ID créé (ou None) et sont utilisées
# par les « viewsets » de l'API REST.
from django.db import connection


def creer_employe(nom, prenom, poste, email, mot_de_passe, telephone=None):
    """Crée un nouveau compte employé dans la base.

    Appelle `creer_employe(...)` côté PostgreSQL qui :
      1. insère la ligne dans la table `employes` ;
      2. hache le mot de passe avec `crypt()` (bcrypt) grâce à pgcrypto
         -> le mot de passe n'est JAMAIS stocké en clair.

    Returns
    -------
    int : l'identifiant (id_employe) du compte créé.
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT creer_employe(%s, %s, %s, %s, %s, %s)",
            # NB : l'ordre des paramètres doit correspondre à la signature SQL.
            [nom, prenom, poste, email, mot_de_passe, telephone],
        )
        return cur.fetchone()[0]