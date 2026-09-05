# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from paiements.models.paiement import Paiement, PaiementClient, PaiementFournisseur
from paiements.serializers.paiement_serializer import (
    PaiementSerializer, PaiementClientSerializer, PaiementFournisseurSerializer,
    EnregistrerPaiementClientInputSerializer, EnregistrerPaiementFournisseurInputSerializer,
)
from paiements.models.db import enregistrer_paiement_client, enregistrer_paiement_fournisseur
from comptes.permissions import EstVendeur, EstMagasinier


def executer_avec_gestion_erreur(fonction, *args):
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class PaiementViewSet(viewsets.ReadOnlyModelViewSet):
    """Consultation de l'historique brut de tous les paiements."""
    queryset = Paiement.objects.all().order_by("-date_paiement")
    serializer_class = PaiementSerializer


class PaiementClientView(APIView):
    """Point d'entrée unique pour enregistrer un paiement client (règle une vente)."""
    permission_classes = [EstVendeur]

    def post(self, request):
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