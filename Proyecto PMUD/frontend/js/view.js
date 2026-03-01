
export function renderHome() {
    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = "Bienvenido";

    contenido.innerHTML = `
        <p>Selecciona una opción del menú para ver información.</p>
    `;
}


//----------------LOGIN----------------
export function renderLogin() {
    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = "Iniciar sesión";

    contenido.innerHTML = `
        <input type="email" id="login-email" placeholder="Email">
        <input type="password" id="login-pass" placeholder="Contraseña">
        <button id="btn-login-submit">Entrar</button>
    `;
}

export function renderUserHeader(user) {
    const actions = document.getElementById("user-actions");

    actions.innerHTML = `
        <span>Hola, <strong>${user.name}</strong></span>
        <button id="btn-logout">Cerrar sesión</button>
    `;
}
export function renderGuestHeader() {
    const actions = document.getElementById("user-actions");

    actions.innerHTML = `
        <button id="btn-login">Iniciar Sesión</button>
        <button id="btn-register">Registrarse</button>
    `;
}
//----------------REGISTER ----------------
export function renderRegister() {
    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = "Registro";

    contenido.innerHTML = `
        <input type="text" id="reg-name" placeholder="Nombre completo">
        <input type="text" id="reg-country" placeholder="País">
        <input type="email" id="reg-email" placeholder="Email">
        <input type="password" id="reg-pass" placeholder="Contraseña">
        <button id="btn-register-submit">Crear cuenta</button>
    `;
}


//----------------FAVORITE TEAM----------------
export async function renderFavorites(title, teams,ids) {

    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = title;
    contenido.innerHTML = "";

    if (!teams || teams.length === 0) {
        contenido.innerHTML = "<p>No hay equipos favoritos.</p>";
        return;
    }

    const list = document.createElement("ul");
    list.classList.add("favorites-list");
    let i = 0;
    for (const team of teams) {

        const name =
            team.fullName?.trim() ||
            team.nameShowTeam ||
            team.nameShow ||
            team.short_name ||
            "Equipo sin nombre";

        const item = document.createElement("li");
        item.classList.add("favorite-item");

        item.innerHTML = `
            <img src="${team.shield_big}" width="32" alt="${name}">
            <div class="fav-info">
                <strong>${name}</strong>
                <span>${team.country_code}</span>
                <img src="${team.flag}" width="32" alt="${team.countryCode}">
                 <button type="button"
                    class="btn-remove-favorite"
                    data-fav="${ids[i]}">
                ❌</button>
            </div>
        `;
        list.appendChild(item);
        i++;
    }

    contenido.appendChild(list);
}

//----------------FAVORITE LEAGUES----------------
export function renderLeagues(title, leagues,flags,ids) {

    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = title;
    contenido.innerHTML = "";

    if (!leagues || leagues.length === 0) {
        contenido.innerHTML = "<p>No hay ligas favoritas.</p>";
        return;
    }

    const list = document.createElement("ul");
    list.classList.add("favorites-list");
    let i = 0;
    for (const league of leagues) {
            const flag = flags[i] || "Sin Bandera"
            const name = league.name || "Liga sin nombre";
            const year = league.year || "";
            const logo = league.logo || "";
            const item = document.createElement("li");
            item.classList.add("favorite-item");
            item.innerHTML = `
            <img src="${logo}" width="36" alt="${name}">
            <img src="${flag}" width="28" alt="País">
            <div class="fav-info">
                <strong>${name}</strong>
                <span>Temporada ${year}</span>
                 <button type="button"
                    class="btn-remove-favorite"
                    data-fav="${ids[i]}">
                ❌</button>
            </div>
            `;
            list.appendChild(item); 
            i++;
    }

    contenido.appendChild(list);
}


//----------------CONTINENTES ----------------
export async function renderContinentes(continents)
{
const titulo = document.getElementById("content-title");
const contenido = document.getElementById("content-body");
titulo.textContent = "ELIGE EL CONTINENTE PARA VER SUS LIGAS";
contenido.innerHTML = "";
const list = document.createElement("ul");
for(const co of continents)
{
     const item = document.createElement("li");
     item.classList.add("clickable-continent");
     item.dataset.continent =  co.code;
     const img = document.createElement("img");
     img.alt = co.name;
     img.width = 24;
     img.src = `img/${co.code}.png`;
     const text = document.createElement("span");
     text.textContent = `${co.name}`;
     item.appendChild(img);
     item.appendChild(text);


     list.appendChild(item);
}
contenido.appendChild(list);
}


//----------------PAISES ----------------
export async function rendercountries(countries,code_continent)
{
const titulo = document.getElementById("content-title");
const contenido = document.getElementById("content-body");
titulo.textContent = "Paises del contiente";
const imgtitulo = document.createElement("img");
imgtitulo.alt = code_continent;
imgtitulo.src = `/frontend/img/${code_continent}.png`;
console.log(imgtitulo.src);
imgtitulo.width = 24;
titulo.appendChild(imgtitulo);
contenido.innerHTML = "";
contenido.innerHTML = `
    <button class="btn-back" data-back="continents">Volver</button>
`;
const list = document.createElement("ul");
for(const c of countries)
{
    if(c.code != "ES" && c.name != "Internacional") // LA API ENVIA DOS VECES EL PAIS "ESPAÑA" ENTONCES EL QUE TENGA COUNTRY == "ES" QUE NO ENTRE
    {
     const item = document.createElement("li");
     //item.textContent = c.name; //No se puede hacer porque entonces la imagen no saldria, ya que borraria todo el contenido de li y pondria el nombre
     item.classList.add("clickable-pais");
     item.dataset.country = c.code;
     const img = document.createElement("img");
     img.alt = c.name;
     img.width = 24;
     img.src = c.flag;
     const text = document.createElement("span");
     text.textContent = `${c.name}`;
     item.appendChild(img);
     item.appendChild(text);
     list.appendChild(item);
    }
}
contenido.appendChild(list);
}

//----------------COMPETICIONES ----------------
export async function renderleague_country(leagues_country,backTarget)
{
const titulo = document.getElementById("content-title");
const contenido = document.getElementById("content-body");
titulo.textContent = "COMPETICIONES EN LA ACTUALIDAD"; //toUpperCase() es para poner las letras en mayuscula
contenido.innerHTML = `
        <button class="btn-back" data-back="${backTarget}">Volver</button>
        <ul class="league-list"></ul>
    `;
const list = document.createElement("ul");
for(const le of leagues_country)
{
     const item = document.createElement("li");
     item.classList.add("clickable-league");
     item.dataset.league =  le.id;
     //item.textContent = `${le.league.name} --- ${le.league.type}`;
     const img = document.createElement("img");
     img.alt = le.name;
     img.width = 24;
     img.src = le.logo;
     const text = document.createElement("span");
     text.textContent = `${le.short_name} --- ${le.name}`;
     item.appendChild(img);
     item.appendChild(text);

     list.appendChild(item);
}
contenido.appendChild(list);
}


//----------------INFORMACIÓN DE LAS LIGAS ----------------
export function renderInformationLeague(league, teams, backTarget, favorites = [],isLogged = true)  {

    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = league.name || "Liga";
    contenido.innerHTML = `
        <button class="btn-back" data-back="${backTarget}">Volver</button>
    `;

    // Flag: mejor cogerlo del primer equipo si existe
    const flag =
        teams?.[0]?.flag ||
        league.flag ||
        "";

    const info = document.createElement("div");
    info.classList.add("league-info");

    info.innerHTML = `
        <div class="league-header">
            <img src="${league.logo}" alt="${league.name}" width="60">
            ${flag ? `<img src="${flag}" alt="flag" width="40">` : ""}
        </div>

        <p><strong>Temporada:</strong> ${league.year ?? "No disponible"}</p>
        <p><strong>Equipos:</strong> ${league.total_teams ?? "—"}</p>
        <p><strong>Jornadas:</strong> ${league.total_rounds ?? "—"}</p>
        <p><strong>Jornada actual:</strong> ${league.current_round ?? "—"}</p>
    `;

    contenido.appendChild(info);

    const favLeague = favorites.find(f =>
    f.type === "league" && f.league_id == league.id);

    // -------- BOTÓN FAVORITO --------
    const favLeagueBtn = document.createElement("button");
    favLeagueBtn.classList.add("btn-fav-league");
    favLeagueBtn.dataset.league = league.id;
    if (!isLogged) 
    {
        favLeagueBtn.textContent = "Inicia sesión para guardar favoritos";
        favLeagueBtn.disabled = true;
        favLeagueBtn.style.opacity = "0.6";
        favLeagueBtn.style.cursor = "not-allowed";
    } 
    else if (favLeague) 
    {
        favLeagueBtn.textContent = "Añadido";
        favLeagueBtn.classList.add("fav-added");
        favLeagueBtn.dataset.fav = favLeague.id;
    } 
    else 
    {
        favLeagueBtn.textContent = "Añadir liga a favoritos";
    }
    contenido.appendChild(favLeagueBtn);
    // -------- CLASIFICACIÓN --------
    const allowedLeagues = {
        "1": { from: 2021, to: 2026 },
        "2": { from: 2021, to: 2026 },
        "10": { from: 2023, to: 2026 }
    };

    if (allowedLeagues[league.id] && league.year) {

        const config = allowedLeagues[league.id];
        const box = document.createElement("div");
        box.classList.add("standings-box");

        const select = document.createElement("select");
        select.classList.add("standings-year");

        for (let y = config.to; y >= config.from; y--) {
            const option = document.createElement("option");
            option.value = y;
            option.textContent = y;
            if (String(y) === String(league.year)) option.selected = true;
            select.appendChild(option);
        }

        const btn = document.createElement("button");
        btn.textContent = "Ver clasificación";
        btn.classList.add("btn-standings");
        btn.dataset.league = league.id;

        box.appendChild(select);
        box.appendChild(btn);
        contenido.appendChild(box);
    }

    // -------- EQUIPOS --------
    const h3 = document.createElement("h3");
    h3.textContent = "Equipos";
    contenido.appendChild(h3);
    if (!teams || teams.length === 0) {
        contenido.innerHTML += "<p>No hay equipos disponibles para esta liga.</p>";
        return;
    }

    const list = document.createElement("ul");

    for (const team of teams) {
        const name =
            team.full_name ||
            team.name ||
            team.short_name ||
            "Equipo sin nombre";
        const favTeam = favorites.find(f => f.type === "team" && f.team_id == team.id);
        const btnClass = favTeam
            ? "btn-fav-team fav-added"
            : "btn-fav-team";

        const favAttr = favTeam
            ? `data-fav="${favTeam.id}"`
            : "";
        const item = document.createElement("li");
        item.innerHTML = `
            <img src="${team.shield_big}" width="24">
            <span>${name}</span>
            <button
                type="button"
                class="${btnClass}"
                data-team="${team.id}"
                ${favAttr}
                ${!isLogged ? "disabled" : ""}
            >⭐</button>
        `;
        list.appendChild(item);
    }

    contenido.appendChild(list);
}

//----------------CLASIFICACIÓN ----------------
export function renderStandingLeague(standing) {

    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = "Clasificación";
     contenido.innerHTML = `
        <button class="btn-back" data-back="league-info">Volver</button>
        <table class="standings-table"></table>
    `;

    if (!standing || standing.length === 0) {
        contenido.textContent = "No hay clasificación disponible.";
        return;
    }

    const table = document.createElement("table");
    table.classList.add("standings-table");

    table.innerHTML = `
        <thead>
            <tr>
                <th>#</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>G</th>
                <th>E</th>
                <th>P</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
                <th>Pts</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    let i = 1;
    for (const team of standing) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${i}</td>
            <td>
                <img src="${team.shield}" width="20">
                ${team.team_name}
            </td>
            <td>${team.rounds}</td>
            <td>${team.wins}</td>
            <td>${team.draws}</td>
            <td>${team.losses}</td>
            <td>${team.gf}</td>
            <td>${team.ga}</td>
            <td>${team.avg}</td>
            <td><strong>${team.points}</strong></td>
        `;
        i++;
        tbody.appendChild(row);
    }

    contenido.appendChild(table);
}
//---------------- PARTIDOS - VISTA PRINCIPAL ----------------
/*export function renderMatchesDashboardLive(liveMatches) {

    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = "Partidos";
    contenido.innerHTML = "";

    // ----- BLOQUE EN DIRECTO -----
    const liveBox = document.createElement("div");

    liveBox.innerHTML = `
        <h3>En directo ahora: ${liveMatches.length}</h3>
    `;

    if (liveMatches.length === 0) 
    {
        liveBox.innerHTML += "<p>No hay partidos en directo.</p>";
    } 
    else 
    {
        const ul = document.createElement("ul");

        for (const m of liveMatches) 
        {
            const li = document.createElement("li");
            li.classList.add("match-row");

            li.innerHTML = `
            <img src="${m.local_shield}" alt="${m.local}" class="team-shield">
            <strong>${m.local}</strong>
            <span class="match-info">
                ${m.live_minute || "EN JUEGO"}
            </span>
            <strong>${m.visitor}</strong>
            <img src="${m.visitor_shield}" alt="${m.visitor}" class="team-shield">
            `;
            ul.appendChild(li);
        }
        liveBox.appendChild(ul);
    }

    // ----- CONTROLES FECHA -----
    const controls = document.createElement("div");
    controls.innerHTML = `
        <h3>Ver partidos por fecha</h3>
        <input type="date" id="match-date">
    `;

    contenido.appendChild(liveBox);
    contenido.appendChild(controls);
}*/


//---------------- PARTIDOS POR FECHA ----------------
export function renderMatchesByDate(matches, date) {

    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = date
        ? `Partidos del ${date}`
        : "Partidos de hoy";

    contenido.innerHTML = `
        <div class="matches-controls">
            ${date ? `<button id="btn-back-today">Volver</button>` : ""}
            <label>Ver partidos por fecha:</label>
            <input type="date" id="match-date" value="${date ?? ""}">
        </div>
    `;

    if (!matches || matches.length === 0) {
        contenido.innerHTML += "<p>No hay partidos para este día.</p>";
        return;
    }

    const ul = document.createElement("ul");

    for (const m of matches) {
        const li = document.createElement("li");
        li.classList.add("match-row");

        const hour = m.hour && m.minute
            ? `${m.hour}:${m.minute}`
            : "Por definir";

        const score = m.result && m.status == 1
            ? m.result
            : hour;

        li.innerHTML = `
            <div class="team left">
                <img src="${m.local_shield}" class="team-shield">
                <span>${m.local}</span>
            </div>

            <div class="match-info center">
                ${score}
            </div>

            <div class="team right">
                <span>${m.visitor}</span>
                <img src="${m.visitor_shield}" class="team-shield">
            </div>
            `;

        ul.appendChild(li);
    }

    contenido.appendChild(ul);
}
//----------------FILTRAR ----------------
export function renderTeamsFilterPanel() {

    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");

    titulo.textContent = "Explorar equipos por filtros";

    contenido.innerHTML = `
        <div class="filter-panel">

            <label>Continente</label>
            <select id="filter-continent">
                <option value="">Selecciona un continente</option>
            </select>

            <label>País</label>
            <select id="filter-country" disabled>
                <option value="">Selecciona un país</option>
            </select>

            <label>Competición</label>
            <select id="filter-league" disabled>
                <option value="">Selecciona una liga</option>
            </select>

            <div class="filter-actions">
                <button id="filter-show-teams" disabled>
                    Mostrar equipos
                </button>

                <button id="filter-reset" class="btn-reset">
                    Resetear
                </button>
            </div>
        </div>
        <div id="teams-filter-result"></div>
    `;
}

export function fillFilterContinents(continents) {
    const select = document.getElementById("filter-continent");

    for (const c of continents) {
        const opt = document.createElement("option");
        opt.value = c.code;
        opt.textContent = c.name;
        select.appendChild(opt);
    }
}

export function fillFilterCountries(countries) {

    const select = document.getElementById("filter-country");
    select.innerHTML = `<option value="">Selecciona un país</option>`;

    for (const p of countries) {

        if (p.country === "ES") continue;

        const opt = document.createElement("option");
        opt.value = p.code;
        opt.textContent = p.name;
        select.appendChild(opt);
    }

    select.disabled = false;
}

export function fillFilterLeagues(leagues) {

    const select = document.getElementById("filter-league");
    select.innerHTML = `<option value="">Selecciona una liga</option>`;

    for (const l of leagues) {

        const opt = document.createElement("option");
        opt.value = l.id;
        opt.textContent = `${l.short_name} — ${l.name}`;

        select.appendChild(opt);
    }

    select.disabled = false;
    document.getElementById("filter-show-teams").disabled = false;
}

export function renderTeamsFilteredResult(teams) {

    const div = document.getElementById("teams-filter-result");
    div.innerHTML = "";

    if (!teams || teams.length === 0) {
        div.innerHTML = "<p>No hay equipos para esta liga.</p>";
        return;
    }

    const list = document.createElement("ul");

    for (const t of teams) {
        const name =
        t.full_name?.trim() ||
        t.name ||
        t.short_name ||
        "Equipo sin nombre";
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${t.shield_big}" width="28">
            <span>${name}</span>
        `;

        list.appendChild(li);
    }

    div.appendChild(list);
}

//----------------TEMPORADAS ----------------
export async function renderSeasons_league(seasons_league)
{
    const titulo = document.getElementById("content-title");
    const contenido = document.getElementById("content-body");
    titulo.textContent = "TEMPORADAS DE LA LIGA " + seasons_league.league.name;
    contenido.innerHTML = "";
    const list = document.createElement("ul");
    for(const season of seasons_league.seasons) // <-- aquí
    {
         const item = document.createElement("li");
         item.classList.add("clickable-seasons");
         item.textContent = `${season.year}`; // <-- y aquí
         list.appendChild(item);
    }
    contenido.appendChild(list);
}
//----------------LAS 3 LIGAS----------------
export function renderFeaturedLeagues(leagues) {
    const title = document.getElementById("content-title");
    const body = document.getElementById("content-body");

    title.textContent = "Ligas destacadas";
    body.innerHTML = "";

    const ul = document.createElement("ul");
    ul.classList.add("league-list");

    for (const league of leagues) {
        const li = document.createElement("li");
        li.classList.add("clickable-league");

        li.dataset.league = league.id;
        li.dataset.from = "featured"; // 🔑 clave

        li.innerHTML = `
            <img src="${league.logo}" class="league-logo">
            <strong>${league.name}</strong>
            <span>Temporada ${league.year}</span>
        `;

        ul.appendChild(li);
    }

    body.appendChild(ul);
}



//----------------FUNCION ERROR----------------
export async function showError(mensaje)
{
 document.getElementById("fav-error").textContent = mensaje;
}


