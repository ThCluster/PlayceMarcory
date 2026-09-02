# -*- coding: utf-8 -*-
from rest_framework import serializers
from produits.models.produit import Produit
from produits.models.vuStock import VueStock


class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = "__all__"
        read_only_fields = fields   # jamais d'écriture ORM directe


class VueStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = VueStock
        fields = "__all__"
        read_only_fields = fields


# ---- Serializers d'entrée (actions) ----

class CreerProduitInputSerializer(serializers.Serializer):
    id_categorie = serializers.IntegerField()
    nom = serializers.CharField(max_length=150)
    prix_achat = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    prix_vente = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    seuil_alerte = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0, default=0)
    code_barre = serializers.CharField(max_length=50, required=False, allow_null=True)
    unite_mesure = serializers.CharField(max_length=20, default="unité")


class ModifierProduitInputSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=150, required=False)
    prix_achat = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0, required=False)
    prix_vente = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0, required=False)
    seuil_alerte = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0, required=False)


class AjusterStockInputSerializer(serializers.Serializer):
    nouvelle_quantite = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    motif = serializers.CharField(max_length=200, required=False, default="ajustement manuel")