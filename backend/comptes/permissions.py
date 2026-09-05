# -*- coding: utf-8 -*-
from rest_framework.permissions import BasePermission


class EstPoste(BasePermission):
    """Base commune : autorise seulement les postes listés dans `postes_autorises`."""
    postes_autorises = []

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.poste in self.postes_autorises
        )


class EstVendeur(EstPoste):
    postes_autorises = ["vendeur", "administrateur"]


class EstMagasinier(EstPoste):
    postes_autorises = ["magasinier", "administrateur"]


class EstDirecteur(EstPoste):
    postes_autorises = ["directeur", "administrateur"]


class EstAchats(EstPoste):
    """Achats fournisseurs : gérés par le magasinier (réappro.) et
    approuvés/suivis par le directeur."""
    postes_autorises = ["directeur", "magasinier", "administrateur"]
