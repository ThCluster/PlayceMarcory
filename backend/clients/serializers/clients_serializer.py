# -*- coding: utf-8 -*-
from rest_framework import serializers
from clients.models.client import Client


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class CreerClientInputSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=80)
    prenom = serializers.CharField(max_length=80)
    telephone = serializers.CharField(max_length=20, required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_null=True)
    adresse = serializers.CharField(required=False, allow_null=True)


class ModifierClientInputSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=80, required=False)
    prenom = serializers.CharField(max_length=80, required=False)
    telephone = serializers.CharField(max_length=20, required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_null=True)
    adresse = serializers.CharField(required=False, allow_null=True)