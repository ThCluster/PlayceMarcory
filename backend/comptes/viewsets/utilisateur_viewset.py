# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from comptes.models.utilisateur import Utilisateur
from comptes.serializers.utilisateur_serializer import LoginSerializer, UtilisateurSerializer
from comptes.models.verification import verifier_connexion

class UtilisateurViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ReadOnlyModelViewSet et non ModelViewSet : la lecture (list/retrieve)
    peut passer par l'ORM Django sans problème, mais aucune écriture
    (create/update/delete) n'est exposée ici — toute modification d'un
    employé doit passer par une fonction PostgreSQL dédiée (creer_employe(),
    etc.), jamais par l'ORM.
    """
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Seule l'action "login" doit être accessible sans être déjà connecté
        if self.action == "login":
            return [AllowAny()]
        return super().get_permissions()

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