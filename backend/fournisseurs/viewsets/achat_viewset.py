# -*- coding: utf-8 -*-
from rest_framework import viewsets
from fournisseurs.models.achat import Achat
from fournisseurs.serializers.achat_serializer import AchatSerializer
from comptes.permissions import EstDirecteur


class AchatViewSet(viewsets.ReadOnlyModelViewSet):
    """Historique des achats fournisseurs (réapprovisionnements)."""
    queryset = Achat.objects.all().order_by("-date_achat")
    serializer_class = AchatSerializer
    permission_classes = [EstDirecteur]