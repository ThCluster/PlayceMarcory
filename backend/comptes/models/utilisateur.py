# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, BaseUserManager
from django.utils.translation import gettext_lazy as _


class UtilisateurManager(BaseUserManager):

    """
    Obligatoire pour AbstractBaseUser. La création d'un utilisateur ne passe
    jamais par l'ORM Django : elle se fait via la fonction PostgreSQL
    creer_employe(), qui gère elle-même le hachage du mot de passe.
    """

    def create_user(self, email, **extra_fields):
        raise NotImplementedError(
            "La création d'un utilisateur passe par la fonction PostgreSQL "
            "creer_employe(), jamais par l'ORM Django."
        )

    def create_superuser(self, email, **extra_fields):
        raise NotImplementedError(
            "Aucun superutilisateur Django : les droits sont gérés par les "
            "rôles PostgreSQL (administrateur, vendeur, magasinier, directeur)."
        )


class Utilisateur(AbstractBaseUser, PermissionsMixin):
    """
    Ce modèle ne gère PAS sa propre table : il pointe sur "employes",
    déjà créée et entièrement définie par le script SQL du projet.
    Contrairement aux autres modèles du projet, il n'hérite volontairement
    PAS de StandardModel, car sa structure est fixée côté PostgreSQL.
    """
    id_employe = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=80, verbose_name=_("Nom"))
    prenom = models.CharField(max_length=80, verbose_name=_("Prénom"))
    email = models.EmailField(unique=True, verbose_name=_("Email"))
    poste = models.CharField(max_length=50, verbose_name=_("Poste"))
    actif = models.BooleanField(default=True, verbose_name=_("Actif"))

    # Le mot de passe est stocké côté PostgreSQL dans la colonne "mot_de_passe",
    # haché par la fonction creer_employe() (crypt + gen_salt). On le mappe sur
    # le champ attendu par AbstractBaseUser.
    password = models.CharField(
        max_length=255,
        db_column="mot_de_passe",
        editable=False,
        blank=True,
        null=True,
    )

    objects = UtilisateurManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        managed = False
        db_table = "employes"
        verbose_name = _("utilisateur")
        verbose_name_plural = _("utilisateurs")

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.poste})"

    @property
    def is_active(self):
        return self.actif

    @property
    def is_staff(self):
        return self.poste == "administrateur"