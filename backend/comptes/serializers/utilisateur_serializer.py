# -*- coding: utf-8 -*-
from rest_framework import serializers
from comptes.models.utilisateur import Utilisateur

# Create your serializers here.


class UtilisateurSerializer(serializers.ModelSerializer):
    """
    Représente un employé déjà authentifié / consulté.
    Utilisé en LECTURE SEULE : le mot de passe n'apparaît jamais ici,
    et la création/modification d'un employé ne passe pas par ce serializer
    (elle passera par une fonction PostgreSQL dédiée, ex: creer_employe()).
    """

    class Meta:
        model = Utilisateur
        fields = ["id_employe", "nom", "prenom", "email", "poste", "actif"]
        read_only_fields = fields   # aucun champ modifiable via ce serializer


class LoginSerializer(serializers.Serializer):
    """
    Sert uniquement à valider la FORME des identifiants envoyés.
    Pas un ModelSerializer : ce n'est pas la représentation d'un objet,
    c'est une action (déclenche verifier_connexion() côté PostgreSQL).
    """
    email = serializers.EmailField()
    mot_de_passe = serializers.CharField(write_only=True, trim_whitespace=False)


POSTES_AUTORISES = ["administrateur", "directeur", "magasinier", "vendeur"]


class CreerEmployeInputSerializer(serializers.Serializer):
    """
    Valide la FORME des données pour créer un employé.
    L'enregistrement réel passe par la fonction PostgreSQL creer_employe(),
    qui hache le mot de passe (crypt + gen_salt) — jamais par l'ORM.
    """
    nom = serializers.CharField(max_length=80)
    prenom = serializers.CharField(max_length=80)
    email = serializers.EmailField()
    poste = serializers.ChoiceField(choices=POSTES_AUTORISES)
    mot_de_passe = serializers.CharField(write_only=True, min_length=8)
    telephone = serializers.CharField(max_length=20, required=False, allow_null=True, allow_blank=True)

    def validate_telephone(self, value):
        return value or None
    