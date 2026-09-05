# -*- coding: utf-8 -*-
from rest_framework import serializers
from fournisseurs.models.achat import Achat, LigneAchat


class AchatSerializer(serializers.ModelSerializer):
    """Achat avec le nom du fournisseur (jointure manuelle vue)."""
    fournisseur = serializers.SerializerMethodField()

    class Meta:
        model = Achat
        fields = "__all__"

    def get_fournisseur(self, obj):
        from fournisseurs.models.fournisseur import Fournisseur
        try:
            f = Fournisseur.objects.get(pk=obj.id_fournisseur)
            return f.nom_entreprise
        except Fournisseur.DoesNotExist:
            return ""


class LigneAchatSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneAchat
        fields = "__all__"