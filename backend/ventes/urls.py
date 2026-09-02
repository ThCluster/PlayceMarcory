# -*- coding: utf-8 -*-
from rest_framework.routers import SimpleRouter

from ventes.viewsets.views import VenteViewSet

router = SimpleRouter()
# Route racine : api/urls.py inclut ce module sous le préfixe "ventes/".
router.register("", VenteViewSet, basename="ventes")

urlpatterns = router.urls