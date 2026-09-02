# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from fournisseurs.models.fournisseur import Fournisseur
from fournisseurs.serializers.fournisseur_serializer import FournisseurSerializer, CreerFournisseurInputSerializer, ModifierFournisseurInputSerializer
from fournisseurs.models.db import creer_fournisseur, modifier_fournisseur, desactiver_fournisseur
from comptes.permissions import EstMagasinier


def executer_avec_gestion_erreur(fonction, *args):
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class FournisseurViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fournisseur.objects.filter(actif=True)
    serializer_class = FournisseurSerializer
    permission_classes = [EstMagasinier]

    def create(self, request):
        serializer = CreerFournisseurInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id_fournisseur = executer_avec_gestion_erreur(
            creer_fournisseur,
            serializer.validated_data["nom_entreprise"],
            serializer.validated_data.get("contact_nom"),
            serializer.validated_data.get("telephone"),
            serializer.validated_data.get("email"),
            serializer.validated_data.get("adresse"),
        )
        return Response({"id_fournisseur": id_fournisseur}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"])
    def modifier(self, request, pk=None):
        serializer = ModifierFournisseurInputSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        executer_avec_gestion_erreur(
            modifier_fournisseur, pk,
            d.get("nom_entreprise"), d.get("contact_nom"),
            d.get("telephone"), d.get("email"), d.get("adresse"),
        )
        return Response({"detail": "Fournisseur modifié."})

    @action(detail=True, methods=["post"])
    def desactiver(self, request, pk=None):
        executer_avec_gestion_erreur(desactiver_fournisseur, pk)
        return Response({"detail": "Fournisseur désactivé."})