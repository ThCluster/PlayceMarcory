# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from ventes.models.commandeVue import VueCommande
from ventes.models.ligneVente import LigneVente
from ventes.serializers.vente_serializer import (
    VueCommandeSerializer, LigneVenteSerializer,
    CreerVenteInputSerializer, AjouterLigneInputSerializer,
)
from ventes.models.vente import creer_vente, ajouter_ligne_vente, retirer_ligne_vente, valider_vente, annuler_vente
from comptes.permissions import EstVendeur


def executer_avec_gestion_erreur(fonction, *args):
    """Traduit un RAISE EXCEPTION PostgreSQL en erreur 400 lisible par le frontend."""
    try:
        return fonction(*args)
    except Exception as e:
        raise ValidationError({"detail": str(e).split("\n")[0]})


class VenteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lecture via vue_commandes (déjà entièrement calculée : montants, reste à payer...).
    Aucune écriture directe : create/update/delete passent par des actions dédiées
    qui appellent les fonctions PostgreSQL.
    """
    queryset = VueCommande.objects.all().order_by("-date_vente")
    serializer_class = VueCommandeSerializer
    permission_classes = [EstVendeur]

    def create(self, request):
        serializer = CreerVenteInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        id_vente = executer_avec_gestion_erreur(
            creer_vente,
            serializer.validated_data["id_client"],
            request.user.id_employe,
        )
        return Response({"id_vente": id_vente}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def lignes(self, request, pk=None):
        lignes = LigneVente.objects.filter(id_vente=pk)
        return Response(LigneVenteSerializer(lignes, many=True).data)

    @action(detail=True, methods=["post"])
    def ajouter_ligne(self, request, pk=None):
        serializer = AjouterLigneInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        id_ligne = executer_avec_gestion_erreur(
            ajouter_ligne_vente,
            pk,
            serializer.validated_data["id_produit"],
            serializer.validated_data["quantite"],
        )
        return Response({"id_ligne_vente": id_ligne}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path="lignes/(?P<id_ligne>[^/.]+)")
    def retirer_ligne(self, request, pk=None, id_ligne=None):
        executer_avec_gestion_erreur(retirer_ligne_vente, id_ligne)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"])
    def valider(self, request, pk=None):
        executer_avec_gestion_erreur(valider_vente, pk)
        return Response({"detail": "Vente validée."})

    @action(detail=True, methods=["post"])
    def annuler(self, request, pk=None):
        executer_avec_gestion_erreur(annuler_vente, pk)
        return Response({"detail": "Vente annulée."})

    @action(detail=False, methods=["get"], url_path="recap-produits")
    def recap_produits(self, request):
        """Agrège en une requête SQL les quantités/CA vendues par produit,
        avec la catégorie. Permet au Dashboard de calculer le Top produits
        et la répartition par catégorie à partir des vraies ventes."""
        from django.db import connection
        with connection.cursor() as cur:
            cur.execute(
                """
                SELECT p.nom,
                       c.nom AS categorie,
                       SUM(lv.quantite) AS quantite,
                       SUM(lv.montant_ligne) AS montant
                FROM lignes_vente lv
                JOIN produits p ON p.id_produit = lv.id_produit
                JOIN categories c ON c.id_categorie = p.id_categorie
                JOIN ventes v ON v.id_vente = lv.id_vente
                WHERE v.statut = 'validee'
                GROUP BY p.nom, c.nom
                ORDER BY montant DESC
                """
            )
            rows = [
                {"nom": r[0], "categorie": r[1],
                 "quantite": float(r[2] or 0), "montant": float(r[3] or 0)}
                for r in cur.fetchall()
            ]
        return Response(rows)