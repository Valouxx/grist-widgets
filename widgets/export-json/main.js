let jsonData = null;
const previewDiv = document.getElementById("preview");

async function update() {
  // Récupère la table connectée au widget
  const data = await grist.fetchSelectedTable();

  // `data` est un tableau d’objets, chaque colonne devient une clé
  jsonData = data;

  previewDiv.innerHTML = `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
}

// Téléchargement JSON
document.getElementById("export").onclick = () => {
  if (!jsonData) return;

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "export.json";
  a.click();
  URL.revokeObjectURL(url);
};

grist.ready();

// Le widget se met à jour automatiquement :
grist.onRecord(update);
grist.onRecords(update);
grist.onSelection(update);
grist.onSettings(update);

update();
