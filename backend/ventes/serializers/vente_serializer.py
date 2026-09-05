# -*- coding: utf-8 -*-
from rest_framework import serializers
from ventes.models.commandeVue import VueCommande
from ventes.models.ligneVente import LigneVente


class VueCommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VueCommande
        fields = "__all__"


class LigneVenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneVente
        fields = "__all__"


# ---- Serializers d'ENTRÉE (actions), pas des ModelSerializer : ce sont des actions, pas des objets ----

class CreerVenteInputSerializer(serializers.Serializer):
    id_client = serializers.IntegerField()


from decimal import Decimal


class AjouterLigneInputSerializer(serializers.Serializer):
    id_produit = serializers.IntegerField()
    quantite = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal("0.01")
    )