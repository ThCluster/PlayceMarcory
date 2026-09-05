# -*- coding: utf-8 -*-
from decimal import Decimal
from rest_framework import serializers
from paiements.models.paiement import Paiement, PaiementClient, PaiementFournisseur

MODES_PAIEMENT = ["especes", "carte", "cheque", "virement", "mobile_money"]


class PaiementSerializer(serializers.ModelSerializer):
    tiers = serializers.SerializerMethodField()

    class Meta:
        model = Paiement
        fields = "__all__"
        read_only_fields = ["tiers"]

    def get_tiers(self, obj):
        """Renvoie le nom du client (recette) ou du fournisseur (dépense)."""
        # ... remplacé par une résolution basée sur le type côté viewset
        return getattr(obj, "tiers_nom", "")


class PaiementClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementClient
        fields = "__all__"


class PaiementFournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementFournisseur
        fields = "__all__"

# ---- Serializers d'entrée (actions) ----

class EnregistrerPaiementClientInputSerializer(serializers.Serializer):
    id_vente = serializers.IntegerField()
    montant = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=Decimal("0.01"))
    mode_paiement = serializers.ChoiceField(choices=MODES_PAIEMENT)
    reference_externe = serializers.CharField(max_length=100, required=False, allow_null=True)


class EnregistrerPaiementFournisseurInputSerializer(serializers.Serializer):
    id_achat = serializers.IntegerField()
    montant = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=Decimal("0.01"))
    mode_paiement = serializers.ChoiceField(choices=MODES_PAIEMENT)
    reference_externe = serializers.CharField(max_length=100, required=False, allow_null=True)