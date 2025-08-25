const API_KEY = "fb415971737e4598ad43c3731883e300"; // wklej swój klucz z Football-Data.org
const BASE_URL = "https://api.football-data.org/v4/competitions";

const searchInput = document.getElementById('search');
const ligaList = document.getElementById('liga-list');

let leagues = [];

// Pobierz wszystkie ligi
async function getLeagues() {
  try {
    const res = await fetch(BASE_URL, {
      headers: { "X-Auth-Token": API_KEY }
    });
    const data = await res.json();
    leagues = data.competitions;
    await showLeagues(leagues);
  } catch (err) {
    ligaList.innerHTML = "<p>Nie udało się pobrać lig. Sprawdź klucz API.</p>";
  }
}

// Pobierz tabelę dla ligi
async function getStandings(leagueId) {
  try {
    const res = await fetch(`${BASE_URL}/${leagueId}/standings`, {
      headers: { "X-Auth-Token": API_KEY }
    });
    const data = await res.json();
    return data.standings[0]?.table || [];
  } catch {
    return [];
  }
}

// Wyświetl ligi i ich tabele w kartach
async function showLeagues(list) {
  ligaList.innerHTML = '';
  for (const liga of list) {
    const div = document.createElement('div');
    div.classList.add('liga-card');
    div.innerHTML = `<h2>${liga.name} (${liga.area.name})</h2>`;
    ligaList.appendChild(div);

    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Miejsce</th><th>Klub</th><th>Punkty</th></tr>`;
    div.appendChild(table);

    const standings = await getStandings(liga.id);
    if (standings.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="3">Brak danych tabeli</td>`;
      table.appendChild(row);
    } else {
      standings.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${team.position}</td><td>${team.team.name}</td><td>${team.points}</td>`;
        table.appendChild(row);
      });
    }
  }
}

// Wyszukiwanie po nazwie ligi lub kraju
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.toLowerCase();
  const filtered = leagues.filter(liga =>
    liga.name.toLowerCase().includes(query) ||
    liga.area.name.toLowerCase().includes(query)
  );
  await showLeagues(filtered);
});

getLeagues();
