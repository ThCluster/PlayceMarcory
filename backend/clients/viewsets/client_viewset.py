# -*- coding: utf-8 -*-
# ============================================================
# VIEWSET — CLIENTS
# ============================================================
# Rôle : exposer via l'API le carnet de clients (lecture) et les actions
# d'écriture (créer, modifier, désactiver un client).
#
# Architecture : la lecture passe par l'ORM sur les tables non gérées ;
# les écritures appellent des fonctions PostgreSQL (creer_client, …) qui
# centralisent la logique métier côté base.
#
# Permissions : accessible aux vendeurs et à l'administrateur (EstVendeur),
# car ce sont eux qui encaissent les ventes auprès des clients.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from clients.models.client import Client
from clients.serializers.clients_serializer import ClientSerializer, CreerClientInputSerializer, ModifierClientInputSerializer
from clients.models.db import creer_client, modifier_client, desactiver_client
from comptes.permissions import EstVendeur


def executer_avec_gestion_erreur(fonction, *args):
    """Exécute une fonction SQL métier et transforme toute erreur PostgreSQL
    en erreur de validation API lisible par le frontend."""
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class ClientViewSet(viewsets.ReadOnlyModelViewSet):
    # On ne renvoie que les clients actifs (les désactivés sont masqués).
    queryset = Client.objects.filter(actif=True)
    serializer_class = ClientSerializer
    permission_classes = [EstVendeur]

    def create(self, request):
        """Création d'un client via la fonction SQL creer_client()."""
        serializer = CreerClientInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id_client = executer_avec_gestion_erreur(
            creer_client,
            serializer.validated_data["nom"],
            serializer.validated_data["prenom"],
            serializer.validated_data.get("telephone"),
            serializer.validated_data.get("email"),
            serializer.validated_data.get("adresse"),
        )
        return Response({"id_client": id_client}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"])
    def modifier(self, request, pk=None):
        """Modifie les coordonnées d'un client."""
        serializer = ModifierClientInputSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        executer_avec_gestion_erreur(
            modifier_client, pk,
            d.get("nom"), d.get("prenom"),
            d.get("telephone"), d.get("email"), d.get("adresse"),
        )
        return Response({"detail": "Client modifié."})

    @action(detail=True, methods=["post"])
    def desactiver(self, request, pk=None):
        """Désactive un client (il n'apparaît plus dans le carnet)."""
        executer_avec_gestion_erreur(desactiver_client, pk)
        return Response({"detail": "Client désactivé."})