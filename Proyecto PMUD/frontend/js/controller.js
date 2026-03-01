
import { getFavorites, getTeamByLeagueAndId, getLeagueNameById, getCountriesContinent, getLeaguesByCountry, getSeasonsByLeagues
    , getContinents, getInformationLeague, getTeamsByLeague, getStandingLeague, getMatchesDay, loginUser, registerUser,addFavorite, existsFavorite
,deleteFavorite,getUserFavorites,logout    } from "./model.js";
import { renderFavorites, renderLeagues, rendercountries, renderleague_country, renderSeasons_league,
     renderContinentes, renderInformationLeague, renderStandingLeague, renderMatchesByDate, renderTeamsFilterPanel,
    fillFilterContinents, fillFilterCountries, fillFilterLeagues, renderTeamsFilteredResult,renderLogin, renderRegister,renderHome,renderUserHeader, 
     renderGuestHeader,renderFeaturedLeagues, showError } from "./view.js";


export function initSession() {
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if (user) {
        renderUserHeader(user);
    } else {
        renderGuestHeader();
    }
}

//----------------LOGIN ----------------
export function loadLogin() {
    renderLogin();
}

export async function handleLogin(email, password) {
    try {
        const user = await loginUser(email, password);

        if (!user) {
            showError("Email o contraseña incorrectos");
            return;
        }

        localStorage.setItem("loggedUser", JSON.stringify(user));

        initSession();     // vuelve a pintar header
        renderHome();      // quita formulario

    } catch {
        showError("Error al iniciar sesión");
    }
}

//----------------REGISTER----------------
export function loadRegister() {
    renderRegister();
}
export async function handleRegister(name, country, email, password) {
    try {
        if (!name || !country || !email || !password) {
            showError("Todos los campos son obligatorios");
            return;
        }

        const newUser = {name, country, email, password};
        await registerUser(newUser);
        const user = await loginUser(email, password);
        localStorage.setItem("loggedUser", JSON.stringify(user));
        initSession();
        renderHome();      
        alert("Usuario registrado correctamente");

    } catch (e) {
        showError("Error al registrar usuario");
    }
}

//----------------CERRAR SESSIÓN----------------
export async function handleLogout() {
    await logout(); // cierra sesión en backend
    localStorage.removeItem("loggedUser");
    initSession();
    renderHome();
}

//----------------FAVORITE TEAM----------------
export async function loadFavoriteTeams() {
    try {
        const favoritos = await getFavorites(); // 👈 sin userId

        const teamsFavs = favoritos.filter(f => f.type === "team");

        if (teamsFavs.length === 0) {
            showError("No tienes equipos favoritos todavía");
            return;
        }

        const names = [];
        const ids = [];

        for (const fav of teamsFavs) {
            const team = await getTeamByLeagueAndId(fav.team_id);
            names.push(team);
            ids.push(fav.id);
        }

        renderFavorites("Mis equipos favoritos", names, ids);

    } catch {
        showError("No se pudieron cargar los equipos favoritos");
    }
}


//----------------FAVORITE LEAGUES----------------
export async function loadFavoriteLeagues() {
    try {
        const favoritos = await getFavorites(); // 👈 sin userId

        const leagueFavs = favoritos.filter(f => f.type === "league");

        if (leagueFavs.length === 0) {
            showError("No tienes ligas favoritas todavía");
            return;
        }

        const names = [];
        const flags = [];
        const ids = [];

        for (const fav of leagueFavs) {
            const league = await getLeagueNameById(fav.league_id);
            const teams = await getTeamsByLeague(fav.league_id);
            const flag = teams?.[0]?.flag ?? "";
            names.push(league);
            flags.push(flag);
            ids.push(fav.id);
        }

        renderLeagues("Mis ligas favoritas", names, flags, ids);

    } catch {
        showError("No se pudieron cargar las ligas favoritas");
    }
}
//----------------AÑADIR LIGA A FAVORITO ----------------
export async function addLeagueToFavorites(leagueId) {

    try {
        // backend comprobará si hay sesión
        const already = await existsFavorite("league", leagueId);
        if (already) {
            showError("Esta liga ya está en favoritos");
            return null;
        }

        await addFavorite({
            type: "league",
            externalId: leagueId
        });

        // volvemos a pedir favoritos para obtener el id
        const fav = await existsFavorite("league", leagueId);
        return fav;

    } catch (e) {
        if (e.message === "NOT_LOGGED") {
            showError("Debes iniciar sesión para guardar favoritos");
        } else {
            showError("No se pudo añadir a favoritos");
        }
        return null;
    }
}
//----------------AÑADIR EQUIPO A FAVORITO ----------------
export async function addTeamToFavorites(teamId, leagueId) {

    try {
        const already = await existsFavorite("team", null, Number(teamId));
        if (already) {
            showError("Este equipo ya está en favoritos");
            return null;
        }

        await addFavorite({
            type: "team",
            externalId: Number(teamId),
            leagueId: Number(leagueId)
        });

        const fav = await existsFavorite("team", null, Number(teamId));
        return fav;

    } catch (e) {
        if (e.message === "NOT_LOGGED") {
            showError("Debes iniciar sesión para guardar favoritos");
        } else {
            showError("No se pudo añadir a favoritos");
        }
        return null;
    }
}

//----------------ELIMINAR FAVORITO ----------------
export async function removeFavorite(favId) {
    try {
        await deleteFavorite(favId);
        showError("Favorito eliminado");
    } catch (e) {
        showError("No se pudo eliminar el favorito");
    }
}
//----------------CONTIENTES ----------------

export async function loadContinents()
{
    try
    {
        const continents = await getContinents();
        renderContinentes(continents);
    }
    catch(error)
    {
        showError("No se pudieron cargar los continentes");
    }
}
//----------------PAISES ----------------
const EUROPE_BLACKLIST = [ "co", "n1","c1","cs"];
const AFRICA_BLACKLIST = [];
const ASIA_BLACKLIST = [
  "au","ck","fj","sb","nc","nz","pg","pf","ws","tv","vu", // oceanía
  "ofc"  // competiciones oceanía
];
export async function loadCountry(code_continent)
{
    try {
        const countries = await getCountriesContinent(code_continent);
        const filtered = cleanByContinent(code_continent, countries);
        rendercountries(filtered, code_continent);
    }
    catch(error) {
        showError("No se pudieron cargar los paises");
    }
}

export function cleanByContinent(code, list) {

    const blacklist = {
        eu: EUROPE_BLACKLIST,
        af: AFRICA_BLACKLIST,
        as: ASIA_BLACKLIST
    };

    const blocked = blacklist[code] ?? [];

    return list
        // 1. Filtrar países incorrectos
        .filter(item => {
            const c =
                item.code?.toLowerCase() ||
                item.country?.toLowerCase();

            return c && !blocked.includes(c);
        })

        // 2. Ordenar alfabéticamente por nombre
        .sort((a, b) => {
            const nameA = a.name?.toLowerCase() ?? "";
            const nameB = b.name?.toLowerCase() ?? "";
            return nameA.localeCompare(nameB);
        });
}
//----------------COMPETICIONES ----------------
export async function loadLeagueCountry(country, backTarget) {
    if (!backTarget) {
        backTarget = (country === "wo") ? "continents" : "countries";
    }
    try {
        const leagues = await getLeaguesByCountry(country);
        if (!Array.isArray(leagues) || leagues.length === 0) {
            showError("No hay competiciones disponibles para este país");
            return;
        }
        renderleague_country(leagues, backTarget);
    } 
    catch (error) 
    {
        console.error("ERROR EN loadLeagueCountry:", error);
        showError("No se pudieron cargar las ligas");
    }
}

//----------------INFORMACÓN DE LAS LIGAS----------------
export async function  loadInformationLeague(league,from)
{
    try
    {
        const information = await getInformationLeague(league);
        const teams = await getTeamsByLeague(league);
        let favorites = [];
        let isLogged = true;
        try {
            favorites = await getUserFavorites(); 
        } catch(e) {
            isLogged = false; 
        }
        const backTarget = from === "featured"
            ? "featured-leagues"
            : "leagues";
        renderInformationLeague(information,teams,backTarget,favorites,isLogged);
    }
    catch(error)
    {
        showError("No se pudieron cargar la información");
    }

}

//----------------CLASIFICACIÓN ----------------
export async function loadStandingsLeague(id_league,year_league)
{
    try
    {
        const standing = await getStandingLeague(id_league,year_league);
        console.log("CLASIFICACIÓN:", standing);
        if (standing.length == 0) 
        {
            showError("No hay clasificación disponible para esta liga para este año " + year_league);
            return;
        }
        renderStandingLeague(standing);
    }
    catch(error)
    {
        showError("No se pudieron cargar la clasificación");
    }

}

//----------------PARTIDOS ----------------
export async function loadMatches({ date = null } = {}) {
    try {
        const matches = await getMatchesDay(date);
        renderMatchesByDate(matches, date);
    } catch (error) {
        console.error(error);
        showError("No se pudieron cargar los partidos");
    }
}

//----------------FILTRAR ----------------
export async function loadTeamsFilterPanel() {

    try {
        renderTeamsFilterPanel();

        const continents = await getContinents();
        fillFilterContinents(continents);

    } catch (e) {
        showError("No se pudo cargar el panel de filtros");
    }
}
export async function onFilterContinentChange(code) {

    const countries = await getCountriesContinent(code);
    const filtered = cleanByContinent(code, countries);

    fillFilterCountries(filtered);
}

export async function onFilterCountryChange(code) {
    const leagues = await getLeaguesByCountry(code);
    if (!Array.isArray(leagues) || leagues.length === 0) {
        fillFilterLeagues([]);
        return;
    }

    fillFilterLeagues(leagues);
}

export async function onFilterShowTeams(leagueId) {

    const teams = await getTeamsByLeague(leagueId);
    renderTeamsFilteredResult(teams);
}



//----------------TEMPORADAS ----------------
export async function loadLeagueSeasons(league)
{
    try
    {
        const seasons_league = await getSeasonsByLeagues(league);
        renderSeasons_league(seasons_league);
    }
    catch(error)
    {
        showError("No se pudieron cargar las temporadas");
    }
}


//----------------LAS 3 LIGAS ----------------
export async function loadFeaturedLeagues() {
    try {
        const leagues = [];

        for (const id of [10, 1, 2]) {
            const data = await getInformationLeague(id);
            leagues.push(data);
        }

        renderFeaturedLeagues(leagues);
    } catch (e) {
        console.error(e);
        showError("No se pudieron cargar las ligas destacadas");
    }
}