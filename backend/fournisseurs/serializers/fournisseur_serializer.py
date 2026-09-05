# -*- coding: utf-8 -*-
from rest_framework import serializers
from fournisseurs.models.fournisseur import Fournisseur


class FournisseurSerializer(serializers.ModelSerializer):
    # Volume total d'achats (somme des montants des achats) auprès de ce
    # fournisseur. Calculé dans le viewset via une annotation (get_total_achats)
    # pour éviter une requête par fournisseur. Source : table « achats ».
    total_achats = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = Fournisseur
        fields = "__all__"


class CreerFournisseurInputSerializer(serializers.Serializer):
    nom_entreprise = serializers.CharField(max_length=150)
    contact_nom = serializers.CharField(max_length=100, required=False, allow_null=True)
    telephone = serializers.CharField(max_length=20, required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_null=True)
    adresse = serializers.CharField(required=False, allow_null=True)


class ModifierFournisseurInputSerializer(serializers.Serializer):
    nom_entreprise = serializers.CharField(max_length=150, required=False)
    contact_nom = serializers.CharField(max_length=100, required=False, allow_null=True)
    telephone = serializers.CharField(max_length=20, required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_null=True)
    adresse = serializers.CharField(required=False, allow_null=True)