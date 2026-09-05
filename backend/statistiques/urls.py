# -*- coding: utf-8 -*-
from django.urls import path
from statistiques.viewsets.stat_viewset import (
    ChiffreAffairesView, NombreCommandesView, MeilleurClientView, MeilleurProduitView,
)

urlpatterns = [
    path("statistiques/chiffre-affaires/", ChiffreAffairesView.as_view()),
    path("statistiques/nombre-commandes/", NombreCommandesView.as_view()),
    path("statistiques/meilleur-client/", MeilleurClientView.as_view()),
    path("statistiques/meilleur-produit/", MeilleurProduitView.as_view()),
]