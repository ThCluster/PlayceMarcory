# -*- coding: utf-8 -*-
# ============================================================
# VIEWSET — PAIEMENTS
# ============================================================
# Rôle : d'une part consulter l'historique de tous les paiements (avec le
# nom du tiers : client ou fournisseur) ; d'autre part, enregistrer un
# paiement client (règlement d'une vente) ou fournisseur (règlement d'un
# achat).
#
# Architecture : la lecture passe par l'ORM avec une annotation SQL dédiée
# qui récupère le nom du tiers selon le type de paiement. L'enregistrement
# d'un paiement passe par des fonctions PostgreSQL
# (enregistrer_paiement_client / enregistrer_paiement_fournisseur) qui
# vérifient les montants, mettent à jour le « reste à payer » et lèvent
# une erreur si le montant dépasse la dette.
#
# Permissions : un Vendeur encaisse les paiements clients (EstVendeur),
# un Magasinier enregistre les paiements fournisseurs (EstMagasinier).
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Case, When, Value, CharField, Subquery, OuterRef
from django.db.models.expressions import RawSQL

from paiements.models.paiement import Paiement, PaiementClient, PaiementFournisseur
from paiements.serializers.paiement_serializer import (
    PaiementSerializer, PaiementClientSerializer, PaiementFournisseurSerializer,
    EnregistrerPaiementClientInputSerializer, EnregistrerPaiementFournisseurInputSerializer,
)
from paiements.models.db import enregistrer_paiement_client, enregistrer_paiement_fournisseur
from comptes.permissions import EstVendeur, EstMagasinier


def executer_avec_gestion_erreur(fonction, *args):
    """Exécute une fonction SQL métier et transforme toute erreur PostgreSQL
    en erreur de validation API lisible par le frontend."""
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class PaiementViewSet(viewsets.ReadOnlyModelViewSet):
    """Consultation de l'historique brut de tous les paiements (clients + fournisseurs)."""
    serializer_class = PaiementSerializer

    def get_queryset(self):
        # Sous-requêtes SQL : récupèrent le nom du client ou du fournisseur
        # associé au paiement, selon son type.
        nom_client = RawSQL(
            "(SELECT (cl.nom || ' ' || cl.prenom) FROM paiement_client pc "
            "JOIN clients cl ON cl.id_client = pc.id_client "
            "WHERE pc.id_paiement = paiements.id_paiement)", []
        )
        nom_fournisseur = RawSQL(
            "(SELECT fo.nom_entreprise FROM paiement_fournisseur pf "
            "JOIN fournisseurs fo ON fo.id_fournisseur = pf.id_fournisseur "
            "WHERE pf.id_paiement = paiements.id_paiement)", []
        )
        return (
            Paiement.objects.all()
            .order_by("-date_paiement")
            .annotate(
                # Colonne calculée « tiers_nom » : nom du tiers selon le type.
                tiers_nom=Case(
                    When(type_paiement='client', then=nom_client),
                    When(type_paiement='fournisseur', then=nom_fournisseur),
                    default=Value(''),
                    output_field=CharField(),
                )
            )
        )


class PaiementClientView(APIView):
    """Point d'entrée unique pour enregistrer un paiement client (règle une vente)."""
    permission_classes = [EstVendeur]

    def post(self, request):
        """Enregistre un versement client via enregistrer_paiement_client()
        (ajustement du reste à payer de la vente concernée)."""
        serializer = EnregistrerPaiementClientInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        id_paiement = executer_avec_gestion_erreur(
            enregistrer_paiement_client,
            d["id_vente"], d["montant"], d["mode_paiement"],
            request.user.id_employe, d.get("reference_externe"),
        )
        return Response({"id_paiement": id_paiement}, status=status.HTTP_201_CREATED)

    def get(self, request):
        """Historique des paiements clients, filtrable par vente : ?id_vente=12"""
        qs = PaiementClient.objects.all()
        id_vente = request.query_params.get("id_vente")
        if id_vente:
            qs = qs.filter(id_vente=id_vente)
        return Response(PaiementClientSerializer(qs, many=True).data)


class PaiementFournisseurView(APIView):
    """Point d'entrée unique pour enregistrer un paiement fournisseur (règle un achat)."""
    permission_classes = [EstMagasinier]

    def post(self, request):
        """Enregistre un versement fournisseur via enregistrer_paiement_fournisseur()
        (ajustement du reste à payer de l'achat concerné)."""
        serializer = EnregistrerPaiementFournisseurInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        id_paiement = executer_avec_gestion_erreur(
            enregistrer_paiement_fournisseur,
            d["id_achat"], d["montant"], d["mode_paiement"],
            request.user.id_employe, d.get("reference_externe"),
        )
        return Response({"id_paiement": id_paiement}, status=status.HTTP_201_CREATED)

    def get(self, request):
        """Historique des paiements fournisseurs, filtrable par achat : ?id_achat=7"""
        qs = PaiementFournisseur.objects.all()
        id_achat = request.query_params.get("id_achat")
        if id_achat:
            qs = qs.filter(id_achat=id_achat)
        return Response(PaiementFournisseurSerializer(qs, many=True).data)