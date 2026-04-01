let jsonData = null;
const previewDiv = document.getElementById("preview");

function columnsToRows(columns) {
  const colNames = Object.keys(columns);
  const count = columns[colNames[0]].length;
  const rows = [];

  for (let i = 0; i < count; i++) {
    const row = {};
    for (const col of colNames) {
      row[col] = columns[col][i];
    }
    rows.push(row);
  }
  return rows;
}

async function update() {
  // Récupère la table connectée au widget
  const data = await grist.fetchSelectedTable();

  // `data` est un tableau d’objets, chaque colonne devient une clé
  jsonData = columnsToRows(data);

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
