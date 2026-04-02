const statusDiv = document.getElementById("status");
const gridDiv = document.getElementById("grid");

async function update() {
  const planning = await grist.fetchTable("Planning");
  const params = await grist.fetchTable("Parametres");

  if (!params.length) {
    statusDiv.innerHTML = "<b>Parametres.Mois est manquant.</b>";
    return;
  }

  const selectedMonth = new Date(params[0].Mois);
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  // Jours du mois
  const days = [];
  const last = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= last; d++) days.push(d);

  // Construction map projet → jours → valeur
  const map = {};
  for (const row of planning) {
    const date = new Date(row.Date);
    if (date.getFullYear() === year && date.getMonth() === month) {
      if (!map[row.Projet]) map[row.Projet] = {};
      map[row.Projet][date.getDate()] = row.Valeur ?? "";
    }
  }

  // Affichage statut
  statusDiv.innerHTML = `Mois affiché : <b>${selectedMonth.toISOString().substring(0,7)}</b>`;

  // Construction du tableau HTML
  let html = "<table><tr><th>Projet</th>";
  for (const d of days) html += `<th>${d}</th>`;
  html += "</tr>";

  for (const projet of Object.keys(map).sort()) {
    html += `<tr><th>${projet}</th>`;
    for (const d of days) {
      const v = map[projet][d] ?? "";
      html += `<td>${v}</td>`;
    }
    html += "</tr>";
  }

  html += "</table>";
  gridDiv.innerHTML = html;
}

grist.ready();
grist.onRecord(update);
grist.onRecords(update);
grist.onSettings(update);
grist.onSelection(update);

update();
