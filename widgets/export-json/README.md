# Export JSON (universel)

Widget permettant d’exporter **n’importe quelle table Grist** au format JSON.

## Fonctionnement

- Connectez une table au widget (comme pour n’importe quel widget Grist).
- Le widget récupère automatiquement la table attachée via :

  ```js
  grist.fetchSelectedTable();
