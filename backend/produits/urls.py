# -*- coding: utf-8 -*-
from rest_framework.routers import SimpleRouter

from produits.viewsets.produit_viewset import ProduitViewSet, VueStockViewSet

# Route racine : api/urls.py inclut ce module sous "produits/".
router = SimpleRouter()
router.register("", ProduitViewSet, basename="produits")

# Exposée séparément sous "stock/" (voir api/urls.py).
stock_router = SimpleRouter()
stock_router.register("", VueStockViewSet, basename="stock")

urlpatterns = router.urls