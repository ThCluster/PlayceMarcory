from django.db import models


class LigneVente(models.Model):
    """Lecture seule : pointe sur lignes_vente, pour afficher le détail d'une vente."""
    id_ligne_vente = models.IntegerField(primary_key=True)
    id_vente = models.IntegerField()
    id_produit = models.IntegerField()
    quantite = models.DecimalField(max_digits=12, decimal_places=2)
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=2)
    montant_ligne = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = "lignes_vente"
