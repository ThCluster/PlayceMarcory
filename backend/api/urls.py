# -*- coding: utf-8 -*-
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path, include
from paiements.urls import urlpatterns as paiements_urlpatterns
from paiements.viewsets.paiement_viewset import PaiementViewSet

from comptes.viewsets import UtilisateurViewSet
from ventes.viewsets.views import VenteViewSet
from produits.viewsets.produit_viewset import ProduitViewSet, VueStockViewSet
from produits.viewsets.mouvement_viewset import MouvementStockViewSet
from fournisseurs.viewsets.fournisseur_viewset import FournisseurViewSet
from fournisseurs.viewsets.achat_viewset import AchatViewSet
from clients.viewsets.client_viewset import ClientViewSet
from statistiques.viewsets.stat_viewset import VueStatistiquesViewSet, VueTopClientsViewSet, VueTopProduitsViewSet
from statistiques.urls import urlpatterns as statistiques_urlpatterns
router = DefaultRouter()

router.register("utilisateurs", UtilisateurViewSet, basename="utilisateurs")
router.register("produits", ProduitViewSet, basename="produits")
router.register("ventes", VenteViewSet, basename="ventes")
router.register("stock", VueStockViewSet, basename="stock")
router.register("mouvements-stock", MouvementStockViewSet, basename="mouvements-stock")
router.register("fournisseurs", FournisseurViewSet, basename="fournisseurs")
router.register("achats", AchatViewSet, basename="achats")
router.register("clients", ClientViewSet, basename="clients")
router.register("paiements", PaiementViewSet, basename="paiements")
router.register("statistiques/mensuelles", VueStatistiquesViewSet, basename="statistiques-mensuelles")
router.register("statistiques/top-clients", VueTopClientsViewSet, basename="top-clients")
router.register("statistiques/top-produits", VueTopProduitsViewSet, basename="top-produits")

urlpatterns = [
    # Les routes explicites (paiements/clients, paiements/fournisseurs,
    # statistiques/...) doivent passer AVANT le router, sinon le router
    # "paiements/{pk}" capture "paiements/clients" (pk='clients' -> 404/405).
    path("", include(paiements_urlpatterns)),
    path("", include(statistiques_urlpatterns)),
    path("", include(router.urls)),
    path("token/refresh/", TokenRefreshView.as_view()),
]