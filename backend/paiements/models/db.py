# -*- coding: utf-8 -*-
from django.db import connection


def enregistrer_paiement_client(id_vente, montant, mode_paiement, id_employe, reference_externe=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT enregistrer_paiement_client(%s, %s, %s, %s, %s)",
            [id_vente, montant, mode_paiement, id_employe, reference_externe],
        )
        return cur.fetchone()[0]


def enregistrer_paiement_fournisseur(id_achat, montant, mode_paiement, id_employe, reference_externe=None):
    with connection.cursor() as cur:
        cur.execute(
            "SELECT enregistrer_paiement_fournisseur(%s, %s, %s, %s, %s)",
            [id_achat, montant, mode_paiement, id_employe, reference_externe],
        )
        return cur.fetchone()[0]