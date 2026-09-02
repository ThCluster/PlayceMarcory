# -*- coding: utf-8 -*-
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path, include

from comptes.viewsets import UtilisateurViewSet
from ventes.viewsets.views import VenteViewSet
from produits.viewsets.produit_viewset import ProduitViewSet, VueStockViewSet
from fournisseurs.viewsets.fournisseur_viewset import FournisseurViewSet
from clients.viewsets.client_viewset import ClientViewSet

router = DefaultRouter()

router.register("utilisateurs", UtilisateurViewSet, basename="utilisateurs")
router.register("produits", ProduitViewSet, basename="produits")
router.register("ventes", VenteViewSet, basename="ventes")
router.register("stock", VueStockViewSet, basename="stock")
router.register("fournisseurs", FournisseurViewSet, basename="fournisseurs")
router.register("clients", ClientViewSet, basename="clients")

urlpatterns = [
    path("", include(router.urls)),
    path("token/refresh/", TokenRefreshView.as_view()),
]