# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from comptes.models.utilisateur import Utilisateur
from comptes.serializers.utilisateur_serializer import LoginSerializer, UtilisateurSerializer, CreerEmployeInputSerializer
from comptes.models.verification import verifier_connexion
from comptes.models.db import creer_employe
from comptes.permissions import EstDirecteur

class UtilisateurViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lecture seule par défaut : la consultation (list/retrieve) passe par l'ORM
    Django, mais toute ÉCRITURE d'un employé passe par des fonctions PostgreSQL
    dédiées (creer_employe(), etc.), jamais par l'ORM — le mot de passe est
    haché côté base (crypt + gen_salt).
    """
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # La connexion est accessible sans être déjà connecté.
        if self.action == "login":
            return [AllowAny()]
        # La création d'un employé est réservée au directeur/administrateur.
        if self.action == "create":
            return [EstDirecteur()]
        return super().get_permissions()

    def create(self, request):
        serializer = CreerEmployeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        id_employe = creer_employe(
            d["nom"],
            d["prenom"],
            d["poste"],
            d["email"],
            d["mot_de_passe"],
            d.get("telephone"),
        )
        return Response(
            {"id_employe": id_employe, "detail": "Employé créé avec succès."},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resultat = verifier_connexion(
            serializer.validated_data["email"],
            serializer.validated_data["mot_de_passe"],
        )
        if resultat is None:
            return Response(
                {"detail": "Email ou mot de passe incorrect."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        utilisateur = Utilisateur(**resultat)
        refresh = RefreshToken.for_user(utilisateur)
        refresh["poste"] = resultat["poste"]

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "utilisateur": UtilisateurSerializer(utilisateur).data,
        })

    @action(detail=False, methods=["get"])
    def me(self, request):
        return Response(UtilisateurSerializer(request.user).data)