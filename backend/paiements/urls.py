# -*- coding: utf-8 -*-
from django.urls import path
from paiements.viewsets.paiement_viewset import PaiementClientView, PaiementFournisseurView

urlpatterns = [
    path("paiements/clients/", PaiementClientView.as_view()),
    path("paiements/fournisseurs/", PaiementFournisseurView.as_view()),
]