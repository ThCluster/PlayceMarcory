# -*- coding: utf-8 -*-
from rest_framework.routers import SimpleRouter

from fournisseurs.viewsets.fournisseur_viewset import FournisseurViewSet

router = SimpleRouter()
# Route racine : api/urls.py inclut ce module sous le préfixe "fournisseurs/".
router.register("", FournisseurViewSet, basename="fournisseurs")

urlpatterns = router.urls
