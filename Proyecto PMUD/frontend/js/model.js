
/*const API_KEY = "198bd53f943e0bf6ed7e1b2d5bc44ca2";
const BASE_URL = "https://apiclient.besoccerapps.com/scripts/api/api.php";
const TZ = "Europe/Madrid";*/
const API_URL = "http://localhost:5000";


//----------------LOGIN----------------
export async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) return null;
    return await res.json();
}

//----------------REGISTER----------------
export async function registerUser(user) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
    }

    return await res.json();
}


//----------------LOGOUT ----------------
export async function logout() {
    await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });
}

//----------------FAVORITE TEAM----------------
export async function getTeamByLeagueAndId(teamId) {
    const res = await fetch(`${API_URL}/team/${teamId}`);
    return await res.json();
}

export async function getFavorites() {
    const res = await fetch(`${API_URL}/favorites`, {
        credentials: "include"
    });

    if (res.status === 401) {
        // No logueado
        return null;
    }

    if (!res.ok) {
        throw new Error("Error al cargar favoritos");
    }

    return await res.json();
}
//----------------FAVORITE LEAGUES----------------
export async function getLeagueNameById(leagueId) {
    const league = await getInformationLeague(leagueId);
    return league;
}


// ---------------- ELIMINAR FAVORITO ----------------
export async function deleteFavorite(favId) {
    const res = await fetch(`${API_URL}/favorites/${favId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error("No se pudo eliminar el favorito");
    }

    return await res.json();
}
// añadir favorito
export async function addFavorite(favorite) {
    const res = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorite)
    });
    return await res.json();
}

// comprobar si ya existe
export async function existsFavorite(type, leagueId = null, teamId = null) {
    const res = await fetch(`${API_URL}/favorites`, {
        credentials: "include"
    });

    if (res.status === 401) {
        throw new Error("NOT_LOGGED");
    }

    const data = await res.json();

    return data.find(f =>
        f.type === type &&
        f.league_id == leagueId &&
        f.team_id == teamId
    );
}

//----------------CONTINENTES ----------------
export async function getContinents() {
    const res = await fetch(`${API_URL}/continents`);
    return await res.json();
}


//----------------PAISES ----------------
export async function getCountriesContinent(code_continent) {
    const res = await fetch(`${API_URL}/countries/${code_continent}`);
    return await res.json();
}

//----------------COMPETICIONES ----------------
export async function getLeaguesByCountry(countryCode) {
    const res = await fetch(`${API_URL}/leagues/${countryCode}`);
    return await res.json();
}


//----------------INFORMACIÓN DE LAS LIGAS----------------
export async function getInformationLeague(leagueId) {
    const res = await fetch(`${API_URL}/league/${leagueId}`);
    return await res.json();
}
//----------------EQUIPOS ----------------
export async function getTeamsByLeague(leagueId) {
    const res = await fetch(`${API_URL}/teams/${leagueId}`);
    return await res.json();
}

//----------------CLASIFICACIÓN ----------------
export async function getStandingLeague(leagueId, season) {
    const res = await fetch(`${API_URL}/standings/${leagueId}/${season}`);
    return await res.json();
}
//---------------- PARTIDOS DEL DÍA ----------------
export async function getMatchesDay(date = null) {
    let url = `${API_URL}/matches`;
    if (date) url += `?date=${date}`;
    const res = await fetch(url);
    return await res.json();
}

//---------------- FAVORITOS DE UN USUARIO ----------------
export async function getUserFavorites() {
    const favorites = await getFavorites();

    if (!favorites) {
        // usuario no logueado
        return [];
    }

    return favorites;
}

//---------------- PARTIDOS EN DIRECTO ----------------
/*export async function getLiveMatches() {

    const url = `${BASE_URL}?key=${API_KEY}&tz=${TZ}&format=json&req=live_matches`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.matches || data.matches === false) {
        return [];
    }
    return Array.isArray(data.matches) ? data.matches : [];
}*/

//----------------TEMPORADAS ----------------
export async function getSeasonsByLeagues(leagueId) {
    const url = `${BASE_URL}?key=${API_KEY}&tz=${TZ}&req=temporadas&id=${leagueId}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return { league: { id: leagueId, name: data.league_name }, seasons: data.seasons };
}
