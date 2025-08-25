const API_KEY = "fb415971737e4598ad43c3731883e300"; // wklej swój klucz z Football-Data.org
const BASE_URL = "https://api.football-data.org/v4/competitions";

const searchInput = document.getElementById('search');
const ligaList = document.getElementById('liga-list');

let leagues = [];

// Pobierz wszystkie ligi
async function getLeagues() {
  const res = await fetch(BASE_URL, {
    headers: { "X-Auth-Token": API_KEY }
  });
  const data = await res.json();
  leagues = data.competitions; // tablica lig
  showLeagues(leagues);
}

// Wyświetl ligi
function showLeagues(list) {
  ligaList.innerHTML = '';
  list.forEach(liga => {
    const div = document.createElement('div');
    div.innerHTML = `<h2>${liga.name} (${liga.area.name})</h2>
                     <p>Planowany start: ${liga.currentSeason?.startDate || 'Brak danych'}</p>`;
    ligaList.appendChild(div);
  });
}

// Filtruj wg wyszukiwania
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = leagues.filter(liga =>
    liga.name.toLowerCase().includes(query) ||
    liga.area.name.toLowerCase().includes(query)
  );
  showLeagues(filtered);
});

getLeagues();
