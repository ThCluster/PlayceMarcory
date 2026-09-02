from django.db import models

class VueStock(models.Model):
    """Lecture seule : pointe sur vue_stock (déjà calculée : statut Rupture/Alerte/Normal)."""
    id_produit = models.IntegerField(primary_key=True)
    produit = models.CharField(max_length=150)
    categorie = models.CharField(max_length=100)
    quantite_actuelle = models.DecimalField(max_digits=12, decimal_places=2)
    quantite_min = models.DecimalField(max_digits=12, decimal_places=2)
    quantite_max = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    prix_achat = models.DecimalField(max_digits=12, decimal_places=2)
    prix_vente = models.DecimalField(max_digits=12, decimal_places=2)
    valeur_stock = models.DecimalField(max_digits=14, decimal_places=2)
    statut_stock = models.CharField(max_length=20)
    date_derniere_maj = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "vue_stock"