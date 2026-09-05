# -*- coding: utf-8 -*-
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from statistiques.models.stat import VueStatistiques, VueTopClients, VueTopProduits
from statistiques.serializers.stat_serializer import (
    VueStatistiquesSerializer, VueTopClientsSerializer, VueTopProduitsSerializer,
    PeriodeInputSerializer, MeilleurProduitInputSerializer,
)
from statistiques.models.db import get_chiffre_affaires, get_nombre_commandes, get_meilleur_client, get_meilleur_produit
from comptes.permissions import EstDirecteur


def executer_avec_gestion_erreur(fonction, *args):
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class VueStatistiquesViewSet(viewsets.ReadOnlyModelViewSet):
    """Chiffre d'affaires et marge, mois par mois — déjà entièrement calculé côté PostgreSQL."""
    queryset = VueStatistiques.objects.all().order_by("-periode")
    serializer_class = VueStatistiquesSerializer
    permission_classes = [EstDirecteur]


class VueTopClientsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VueTopClients.objects.all().order_by("rang")
    serializer_class = VueTopClientsSerializer
    permission_classes = [EstDirecteur]


class VueTopProduitsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VueTopProduits.objects.all().order_by("rang")
    serializer_class = VueTopProduitsSerializer
    permission_classes = [EstDirecteur]


class ChiffreAffairesView(APIView):
    """GET /api/statistiques/chiffre-affaires/?date_debut=2026-01-01&date_fin=2026-12-31"""
    permission_classes = [EstDirecteur]

    def get(self, request):
        serializer = PeriodeInputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        montant = executer_avec_gestion_erreur(
            get_chiffre_affaires, d.get("date_debut"), d.get("date_fin")
        )
        return Response({"chiffre_affaires": montant})


class NombreCommandesView(APIView):
    """GET /api/statistiques/nombre-commandes/?date_debut=...&date_fin=...&statut=validee"""
    permission_classes = [EstDirecteur]

    def get(self, request):
        serializer = PeriodeInputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        statut = request.query_params.get("statut")

        nombre = executer_avec_gestion_erreur(
            get_nombre_commandes, d.get("date_debut"), d.get("date_fin"), statut
        )
        return Response({"nombre_commandes": nombre})


class MeilleurClientView(APIView):
    """GET /api/statistiques/meilleur-client/?date_debut=...&date_fin=..."""
    permission_classes = [EstDirecteur]

    def get(self, request):
        serializer = PeriodeInputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        resultat = executer_avec_gestion_erreur(
            get_meilleur_client, d.get("date_debut"), d.get("date_fin")
        )
        if resultat is None:
            return Response({"detail": "Aucune vente sur cette période."}, status=404)
        return Response(resultat)


class MeilleurProduitView(APIView):
    """GET /api/statistiques/meilleur-produit/?date_debut=...&date_fin=...&critere=quantite"""
    permission_classes = [EstDirecteur]

    def get(self, request):
        serializer = MeilleurProduitInputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        resultat = executer_avec_gestion_erreur(
            get_meilleur_produit, d.get("date_debut"), d.get("date_fin"), d["critere"]
        )
        if resultat is None:
            return Response({"detail": "Aucune vente sur cette période."}, status=404)
        return Response(resultat)