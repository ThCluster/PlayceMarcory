# -*- coding: utf-8 -*-
from rest_framework import viewsets
from produits.models.mouvement import MouvementStock
from produits.serializers.mouvement_serializer import MouvementStockSerializer
from comptes.permissions import EstMagasinier


class MouvementStockViewSet(viewsets.ReadOnlyModelViewSet):
    """Historique des mouvements de stock (entrées, sorties, ajustements)."""
    queryset = MouvementStock.objects.all().order_by("-date_mouvement")
    serializer_class = MouvementStockSerializer
    permission_classes = [EstMagasinier]