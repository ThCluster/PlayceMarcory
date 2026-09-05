# -*- coding: utf-8 -*-
# ============================================================
# VIEWSET — FOURNISSEURS
# ============================================================
# Rôle : exposer via l'API le répertoire des fournisseurs (lecture) et
# les actions d'écriture (créer, modifier, désactiver un fournisseur).
#
# Architecture : la lecture passe par l'ORM sur les tables non gérées ;
# les écritures appellent des fonctions PostgreSQL (creer_fournisseur, …)
# qui centralisent la logique métier côté base.
#
# Permissions : accessible au magasinier et à l'administrateur (EstMagasinier),
# qui gèrent le réapprovisionnement.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Sum, Value, DecimalField, Subquery, OuterRef
from django.db.models.functions import Coalesce

from fournisseurs.models.fournisseur import Fournisseur
from fournisseurs.models.achat import Achat
from fournisseurs.serializers.fournisseur_serializer import FournisseurSerializer, CreerFournisseurInputSerializer, ModifierFournisseurInputSerializer
from fournisseurs.models.db import creer_fournisseur, modifier_fournisseur, desactiver_fournisseur
from comptes.permissions import EstMagasinier


def executer_avec_gestion_erreur(fonction, *args):
    """Exécute une fonction SQL métier et transforme toute erreur PostgreSQL
    en erreur de validation API lisible par le frontend."""
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class FournisseurViewSet(viewsets.ReadOnlyModelViewSet):
    # On ne renvoie que les fournisseurs actifs (les désactivés sont masqués).
    # On agrége la somme des montants des achats par fournisseur (total_achats)
    # pour alimenter la carte « Volume Total d'Achats » du frontend.
    queryset = Fournisseur.objects.filter(actif=True).annotate(
        total_achats=Coalesce(
            Subquery(
                Achat.objects
                .filter(id_fournisseur=OuterRef("id_fournisseur"), statut="validee")
                .values("id_fournisseur")
                .annotate(total=Sum("montant_total"))
                .values("total")
            ),
            Value(0),
            output_field=DecimalField(max_digits=14, decimal_places=2),
        )
    )
    serializer_class = FournisseurSerializer
    permission_classes = [EstMagasinier]

    def create(self, request):
        """Création d'un fournisseur via la fonction SQL creer_fournisseur()."""
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
        """Modifie les informations d'un fournisseur."""
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
        """Désactive un fournisseur (il n'apparaît plus dans le répertoire)."""
        executer_avec_gestion_erreur(desactiver_fournisseur, pk)
        return Response({"detail": "Fournisseur désactivé."})