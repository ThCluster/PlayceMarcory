# -*- coding: utf-8 -*-
# ============================================================
# VIEWSET — MOUVEMENTS DE STOCK
# ============================================================
# Rôle : exposer via l'API l'historique des mouvements de stock
# (entrées, sorties, ajustements) pour la page « Stocks ».
#
# NB : c'est un ViewSet EN LECTURE SEULE (ReadOnlyModelViewSet).
# Les mouvements ne sont jamais créés directement par l'API : ils sont
# générés automatiquement par PostgreSQL (triggers) lorsqu'un stock
# change (achat -> entrée, vente -> sortie, ajustement manuel).
#
# Accessible : magasinier + administrateur (EstMagasinier).
from rest_framework import viewsets
from produits.models.mouvement import MouvementStock
from produits.serializers.mouvement_serializer import MouvementStockSerializer
from comptes.permissions import EstMagasinier


class MouvementStockViewSet(viewsets.ReadOnlyModelViewSet):
    """Historique des mouvements de stock (entrées, sorties, ajustements)."""
    # Les mouvements les plus récents apparaissent en premier (-date).
    queryset = MouvementStock.objects.all().order_by("-date_mouvement")
    serializer_class = MouvementStockSerializer
    permission_classes = [EstMagasinier]