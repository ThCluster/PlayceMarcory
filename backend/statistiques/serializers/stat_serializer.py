# -*- coding: utf-8 -*-
from rest_framework import serializers
from statistiques.models.stat import VueStatistiques, VueTopClients, VueTopProduits


class VueStatistiquesSerializer(serializers.ModelSerializer):
    class Meta:
        model = VueStatistiques
        fields = "__all__"


class VueTopClientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VueTopClients
        fields = "__all__"


class VueTopProduitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VueTopProduits
        fields = "__all__"


# ---- Serializer d'entrée : valide juste la FORME des paramètres de filtre ----

class PeriodeInputSerializer(serializers.Serializer):
    date_debut = serializers.DateField(required=False, allow_null=True)
    date_fin = serializers.DateField(required=False, allow_null=True)


class MeilleurProduitInputSerializer(PeriodeInputSerializer):
    critere = serializers.ChoiceField(choices=["montant", "quantite"], default="montant")