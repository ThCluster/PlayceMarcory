# PlayceMarcory
Projet d'évaluation finale : Création et Exploitation de données SQL
Développement d'une plateforme Web de gestion d'un supermarché
Contexte
Une chaîne de supermarchés souhaite développer une application Web permettant
de gérer :
• les clients ;
• les employés ;
• les fournisseurs ;
• les catégories ;
• les produits ;
• les achats auprès des fournisseurs ;
• les ventes aux clients ;
• les paiements ;
• les stocks ;
• les statistiques de vente.
L'application Web sera développée en PHP, Java ou Python, tandis que toute la
logique métier devra être implémentée dans PostgreSQL.

---

## Explications simples

### BigAutoField (Django)
C'est le numéro d'identité automatique de chaque ligne de la base de données.
Quand tu ajoutes un produit, Django lui donne tout seul un numéro unique (1, 2,
3...). `BigAutoField` veut juste dire que ce numéro peut devenir très, très
grand, comme un gros compteur qui ne tombe jamais en panne.

### django_extensions
C'est une boîte à outils magique pour les développeurs. Elle ajoute des
commandes pratiques, comme `python manage.py shell_plus` qui ouvre une console
avec tous tes modèles déjà chargés, ou `python manage.py show_urls` qui affiche
toutes les adresses de ton site. Ça fait gagner du temps et ça évite d'écrire
des lignes en trop.

### corsheaders
C'est un gardien de la porte. Quand ton site (le frontend) veut parler à ton
serveur (le backend), ce gardien vérifie que la demande vient bien de toi et pas
d'un inconnu. Sans lui, le navigateur bloquerait les échanges entre les deux
parties. Il dit simplement : "OK, tu peux entrer, je te fais confiance."