# -*- coding: utf-8 -*-
# ============================================================
# COUCHE D'ACCÈS AUX FONCTIONS POSTGRESQL — MODULE PAIEMENTS
# ============================================================
# Rôle : encapsuler l'enregistrement des paiements (trésorerie).
#
# Deux flux distincts :
#   1. Paiement CLIENT : encaissement d'une vente (une recette).
#   2. Paiement FOURNISSEUR : règlement d'un achat (une dépense).
#
# Les fonctions PostgreSQL vérifient la cohérence :
#   - un achat doit être « validé » pour être payé ;
#   - on ne peut pas dépasser le montant restant à payer ;
#   - l'achat/la vente est mise à jour (montant_paye) automatiquement.
from django.db import connection


def enregistrer_paiement_client(id_vente, montant, mode_paiement, id_employe, reference_externe=None):
    """Enregistre le règlement d'une vente par un client.

    Side effects (côté PostgreSQL) :
      - crée la ligne dans `paiements` (type='client') + `paiement_client` ;
      - met à jour le montant payé / le statut de la vente.

    Returns
    -------
    int : l'id_paiement créé.
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT enregistrer_paiement_client(%s, %s, %s, %s, %s)",
            [id_vente, montant, mode_paiement, id_employe, reference_externe],
        )
        return cur.fetchone()[0]


def enregistrer_paiement_fournisseur(id_achat, montant, mode_paiement, id_employe, reference_externe=None):
    """Enregistre le règlement d'un achat fournisseur.

    Side effects (côté PostgreSQL) :
      - crée la ligne dans `paiements` (type='fournisseur') + `paiement_fournisseur` ;
      - incrémente `montant_paye` de l'achat.

    Returns
    -------
    int : l'id_paiement créé.
    """
    with connection.cursor() as cur:
        cur.execute(
            "SELECT enregistrer_paiement_fournisseur(%s, %s, %s, %s, %s)",
            [id_achat, montant, mode_paiement, id_employe, reference_externe],
        )
        return cur.fetchone()[0]