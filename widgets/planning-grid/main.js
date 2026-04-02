const statusDiv = document.getElementById("status");
const gridDiv = document.getElementById("grid");

let settings = {};

function makePivot(data, rowField, colField, valField) {
  const rows = [...new Set(data.map(r => r[rowField]))];
  const cols = [...new Set(data.map(r => r[colField]))];

  // Tri optionnel
  rows.sort();
  cols.sort();

  const map = {};

  for (const r of rows) {
    map[r] = {};
  }

  for (const row of data) {
    const r = row[rowField];
    const c = row[colField];
    const v = row[valField];

    // On accepte absolument tous les types de données
    map[r][c] = v ?? "";
  }

  return { rows, cols, map };
}

async function update() {
  if (!settings.rowField || !settings.colField || !settings.valField) {
    statusDiv.innerHTML = "<b>Configurez les champs dans les paramètres du widget.</b>";
    gridDiv.innerHTML = "";
    return;
  }

  const table = await grist.fetchSelectedTable();

  const pivot = makePivot(
    table,
    settings.rowField,
    settings.colField,
    settings.valField
  );

  statusDiv.innerHTML =
    `Ligne: <b>${settings.rowField}</b> • Colonne: <b>${settings.colField}</b> • Valeur: <b>${settings.valField}</b>`;

  let html = "<table>";

  // Ligne d’en-tête
  html += "<tr><th>" + settings.rowField + "</th>";
  for (const c of pivot.cols) html += `<th>${c}</th>`;
  html += "</tr>";

  // Corps du tableau
  for (const r of pivot.rows) {
    html += `<tr><th>${r}</th>`;
    for (const c of pivot.cols) {
      const v = pivot.map[r][c] ?? "";
      html += `<td>${v}</td>`;
    }
    html += "</tr>";
  }

  html += "</table>";
  gridDiv.innerHTML = html;
}

grist.ready();

// Récupérer les paramètres définis dans Grist
grist.onSettings(s => {
  settings = s;
  update();
});

grist.onRecord(update);
grist.onRecords(update);
grist.onSelection(update);
