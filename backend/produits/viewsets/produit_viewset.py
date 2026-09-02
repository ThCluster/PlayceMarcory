# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from produits.models.produit import Produit
from produits.models.vuStock import VueStock
from produits.serializers.produit_serializer import (
    ProduitSerializer, VueStockSerializer,
    CreerProduitInputSerializer, ModifierProduitInputSerializer, AjusterStockInputSerializer,
)
from produits.models.db import creer_produit, modifier_produit, desactiver_produit, ajuster_stock
from comptes.permissions import EstMagasinier


def executer_avec_gestion_erreur(fonction, *args):
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class ProduitViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Consultation ouverte à tous les employés connectés (un vendeur doit pouvoir
    voir le catalogue). Les écritures (create/modifier/desactiver) sont
    réservées au magasinier via des permissions par action.
    """
    queryset = Produit.objects.filter(actif=True)
    serializer_class = ProduitSerializer

    def get_permissions(self):
        if self.action in ["create", "modifier", "desactiver", "ajuster_stock"]:
            return [EstMagasinier()]
        return super().get_permissions()

    def create(self, request):
        serializer = CreerProduitInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id_produit = executer_avec_gestion_erreur(creer_produit, *serializer.validated_data.values())
        return Response({"id_produit": id_produit}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"])
    def modifier(self, request, pk=None):
        serializer = ModifierProduitInputSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        executer_avec_gestion_erreur(
            modifier_produit, pk,
            serializer.validated_data.get("nom"),
            serializer.validated_data.get("prix_achat"),
            serializer.validated_data.get("prix_vente"),
            serializer.validated_data.get("seuil_alerte"),
        )
        return Response({"detail": "Produit modifié."})

    @action(detail=True, methods=["post"])
    def desactiver(self, request, pk=None):
        executer_avec_gestion_erreur(desactiver_produit, pk)
        return Response({"detail": "Produit désactivé."})

    @action(detail=True, methods=["post"], url_path="ajuster-stock")
    def ajuster_stock(self, request, pk=None):
        serializer = AjusterStockInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        executer_avec_gestion_erreur(
            ajuster_stock, pk,
            serializer.validated_data["nouvelle_quantite"],
            serializer.validated_data["motif"],
        )
        return Response({"detail": "Stock ajusté."})


class VueStockViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture seule du stock, avec alertes déjà calculées par PostgreSQL."""
    queryset = VueStock.objects.all()
    serializer_class = VueStockSerializer