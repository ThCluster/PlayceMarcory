# -*- coding: utf-8 -*-
# ============================================================
# VIEWSET — ACHATS FOURNISSEURS
# ============================================================
# Rôle : exposer via l'API l'historique des achats / réapprovisionnements
# fournisseurs (page « Achats fournisseurs »).
#
# NB : EN LECTURE SEULE — la création d'un achat passe par le seed ou
# par les fonctions PostgreSQL (elles calculent le montant total et
# mettent à jour le stock via des triggers).
#
# Accessible : directeur + magasinier + admin (EstAchats).
#   - le Directeur crée/valide les réapprovisionnements ;
#   - le Magasinier les consulte en lecture seule (contrôle livraison).
from rest_framework import viewsets
from fournisseurs.models.achat import Achat
from fournisseurs.serializers.achat_serializer import AchatSerializer
from comptes.permissions import EstAchats


class AchatViewSet(viewsets.ReadOnlyModelViewSet):
    """Historique des achats fournisseurs (réapprovisionnements)."""
    queryset = Achat.objects.all().order_by("-date_achat")
    serializer_class = AchatSerializer
    permission_classes = [EstAchats]