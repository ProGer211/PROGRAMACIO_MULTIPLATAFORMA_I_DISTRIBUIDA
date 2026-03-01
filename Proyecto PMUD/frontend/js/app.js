import { loadFavoriteTeams,loadFavoriteLeagues, loadCountry, loadLeagueCountry, loadLeagueSeasons, loadContinents, loadInformationLeague, 
    loadStandingsLeague, loadMatches, loadTeamsFilterPanel,onFilterContinentChange,onFilterCountryChange,onFilterShowTeams, loadLogin, loadRegister,
    handleLogin, handleRegister, initSession, handleLogout, addLeagueToFavorites, addTeamToFavorites,removeFavorite,loadFeaturedLeagues,
     
 } from "./controller.js";

//BOTON ATRAS
const navState = {
    continent: null,
    country: null,
    league: null,
    season: null
};

//EQUIPOS FAVORITOS
const boton_equipos_fav = document.getElementById("btn-fav-teams");
boton_equipos_fav.addEventListener("click", () => {
    document.getElementById("fav-error").textContent = "";
    loadFavoriteTeams();
});

//LIGAS FAVORITAS
const boton_ligas_fav = document.getElementById("btn-fav-leagues");
boton_ligas_fav.addEventListener("click" ,() => {
    document.getElementById("fav-error").textContent = "";
    loadFavoriteLeagues();
})

//LIGAS
const boton_ligas = document.getElementById("btn-leagues")
document.getElementById("fav-error").textContent = "";
boton_ligas.addEventListener("click",() => {
    document.getElementById("fav-error").textContent = "";
    loadContinents();
})
//3 LIGAS
document.getElementById("btn-featured-leagues")
    .addEventListener("click", () => {
        document.getElementById("fav-error").textContent = "";
        loadFeaturedLeagues();
    });
//CONTENT-BODY
document.getElementById("content-body").addEventListener("click", async (e) => {

    document.getElementById("fav-error").textContent = "";
    if (e.target.matches(".btn-standings")) 
    {
        const box = e.target.closest(".standings-box");
        const select = box.querySelector(".standings-year");
        const id_league = e.target.dataset.league;
        const year_league = select.value;
        navState.season = select.value;
        loadStandingsLeague(id_league, year_league);
        return;
    }
    if (e.target.id === "btn-back-today") 
    {
        loadMatches(); 
        return;
    }   
    /*if (e.target.id === "btn-back-live") {
    loadMatches();
    return;
    }*/
     if (e.target.id === "filter-show-teams") {
        const leagueId = document.getElementById("filter-league").value;
        onFilterShowTeams(leagueId);
    }
     if (e.target.id === "filter-reset") {

        document.getElementById("filter-continent").value = "";
        document.getElementById("filter-country").value = "";
        document.getElementById("filter-league").value = "";

        document.getElementById("filter-country").disabled = true;
        document.getElementById("filter-league").disabled = true;
        document.getElementById("filter-show-teams").disabled = true;

        document.getElementById("teams-filter-result").innerHTML = "";
    }
    if (e.target.classList.contains("btn-back")) 
    {
        const type = e.target.dataset.back;

        if (type === "continents") 
        {
            loadContinents();
            return;
        }

        if (type === "countries") 
        {
            loadCountry(navState.continent);
            return;
        }
        if (type === "leagues") 
        {
            loadLeagueCountry(navState.country);
            return;
        }
        if (type === "featured-leagues") 
        {   
            loadFeaturedLeagues();
            return;
        }
        if (type === "league-info") 
        {
            loadInformationLeague(navState.league);
            return;
        }
    }
    if (e.target.id === "btn-login-submit") 
    {
        handleLogin(
            document.getElementById("login-email").value,
            document.getElementById("login-pass").value
        );
    }

    if (e.target.id === "btn-register-submit") 
    {
        handleRegister(
            document.getElementById("reg-name").value,
            document.getElementById("reg-country").value,
            document.getElementById("reg-email").value,
            document.getElementById("reg-pass").value
        );
    }
    if (e.target.classList.contains("btn-fav-team")) 
    {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.target;
        // Ya añadido → eliminar
        if (btn.classList.contains("fav-added")) 
        {
            if (!confirm("¿Eliminar de favoritos?")) return;
            removeFavorite(btn.dataset.fav);
            btn.classList.remove("fav-added");
            btn.removeAttribute("data-fav");
            btn.textContent = "⭐";
            return;
        }
        // Añadir
        const fav = await addTeamToFavorites(
        btn.dataset.team,
        navState.league);
        if (fav) 
        {
            btn.classList.add("fav-added");
            btn.dataset.fav = fav.id;
        }   
    }
    if (e.target.classList.contains("btn-fav-league")) 
    {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.target;
        // Si ya está añadido → eliminar
        if (btn.classList.contains("fav-added")) 
        {
            if (!confirm("¿Eliminar de favoritos?")) return;
            removeFavorite(btn.dataset.fav);
            btn.classList.remove("fav-added");
            btn.removeAttribute("data-fav");
            btn.disabled = false;
            btn.textContent = "Añadir liga a favoritos";
            return;
        }
        // Añadir
        const fav = await addLeagueToFavorites(btn.dataset.league);
        if (fav) 
        {
            btn.classList.add("fav-added");
            btn.dataset.fav = fav.id;
            btn.disabled = false; // sigue activo para hover
        }
    }
    if (e.target.classList.contains("btn-remove-favorite")) 
    {
        e.preventDefault();
        e.stopPropagation();
        const favId = e.target.dataset.fav;
        if (!confirm("¿Eliminar de favoritos?")) return;
        removeFavorite(favId);
        e.target.closest("li").remove();
        return;
    }   
    //if(!e.target.matches("span,img")) return;
    const liContinent = e.target.closest("li.clickable-continent");
    const liCountry = e.target.closest("li.clickable-pais");
    const liLeague = e.target.closest("li.clickable-league");
    if (liContinent) {
        const code_continent = liContinent.dataset.continent;
        navState.continent = code_continent;
        navState.country = null;
        if(code_continent == "wo")
        {
            navState.country = "wo"; 
            loadLeagueCountry("wo","continents");
            return;
        }
        console.log("APP → continente clicado:", code_continent);
        loadCountry(code_continent);
        return;
    }

    if (liCountry) {
        const country = liCountry.dataset.country;
        navState.country = country; 
        console.log("APP → país clicado:", country);
        loadLeagueCountry(country,"countries");
        return;
    }
    if(liLeague)
    {
        const league = liLeague.dataset.league;
        const from = liLeague.dataset.from || "normal";
        navState.league = league;   
        navState.season = null;;
        navState.from = from; 
        console.log("APP → país clicado:", league);
        loadInformationLeague(league,from);
    }
});

// PARTIDOS
document.getElementById("btn-matches").addEventListener("click", () => {
    document.getElementById("fav-error").textContent = "";
    loadMatches(); 
});

//CAMBIAR FECHA
document.getElementById("content-body").addEventListener("change", (e) => {
    document.getElementById("fav-error").textContent = "";
    if (e.target.id === "match-date") 
    {
        loadMatches({
            mode: "date",
            date: e.target.value
        });
    }
    if (e.target.id === "filter-continent") 
    {
        onFilterContinentChange(e.target.value);
    }

    if (e.target.id === "filter-country") 
    {
        onFilterCountryChange(e.target.value);
    }
});

// Abrir panel de filtros desde botón EQUIPOS
document.getElementById("btn-teams").addEventListener("click", () => {
    document.getElementById("fav-error").textContent = "";
    loadTeamsFilterPanel();
});

document.getElementById("user-actions").addEventListener("click", (e) => {
    document.getElementById("fav-error").textContent = "";
    if (e.target.id === "btn-login") {
        loadLogin();
    }

    if (e.target.id === "btn-register") {
        loadRegister();
    }

    if (e.target.id === "btn-logout") {
        handleLogout();
    }
});

//USUARIO LOGUEADO
initSession();



