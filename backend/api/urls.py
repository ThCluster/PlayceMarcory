# -*- coding: utf-8 -*-
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path, include

from comptes.viewsets.utilisateur_viewset import UtilisateurViewSet
# from produits.views import ProduitViewSet   # au fur et à mesure des autres apps
# from ventes.views import VenteViewSet

router = DefaultRouter()
router.register("utilisateurs", UtilisateurViewSet, basename="utilisateurs")
# router.register("produits", ProduitViewSet, basename="produits")
# router.register("ventes", VenteViewSet, basename="ventes")

urlpatterns = [
    path("", include(router.urls)),
    path("token/refresh/", TokenRefreshView.as_view()),
]