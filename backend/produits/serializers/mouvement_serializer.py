# -*- coding: utf-8 -*-
from rest_framework import serializers
from produits.models.mouvement import MouvementStock


class MouvementStockSerializer(serializers.ModelSerializer):
    produit = serializers.SerializerMethodField()

    class Meta:
        model = MouvementStock
        fields = "__all__"

    def get_produit(self, obj):
        from produits.models.produit import Produit
        try:
            p = Produit.objects.get(pk=obj.id_produit)
            return p.nom
        except Produit.DoesNotExist:
            return ""