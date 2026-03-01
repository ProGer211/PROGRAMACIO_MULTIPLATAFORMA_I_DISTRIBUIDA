// ------------ CARGAR TAREAS ------------
async function cargarTareas() {
    const res = await fetch("/api/tareas");
    const tareas = await res.json();

    const lista = document.getElementById("lista-tareas");
    lista.innerHTML = "";

    tareas.forEach(t => {
        const li = document.createElement("li");
        li.className = "task-item";

        li.innerHTML = `
            <strong>${t.titulo}</strong><br>
            Prioridad: ${t.priority}<br>
            Estado: ${t.completed ? "✔️ Completa" : "❌ Pendiente"}
            <div>
                <button class="edit" onclick="editarTarea(${t.id})">Editar</button>
                <button class="delete" onclick="borrarTarea(${t.id})">Eliminar</button>
            </div>
        `;

        lista.appendChild(li);
    });
}

// ------------ CREAR TAREA ------------
async function crearTarea() {
    const titulo = document.getElementById("nuevoTitulo").value;
    const priority = document.getElementById("nuevaPriority").value;
    const completed = document.getElementById("nuevoCompleted").checked;

    await fetch("/api/tareas", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ titulo, priority, completed })
    });

    cargarTareas();
}

// ------------ BORRAR TAREA ------------
async function borrarTarea(id) {
    await fetch(`/api/tareas/${id}`, { method: "DELETE" });
    cargarTareas();
}

// ------------ EDITAR TAREA ------------
function editarTarea(id) {
    window.location.href = `/editar/${id}`;
}
// ------------ RESET ------------
document.getElementById("resetBtn").onclick = async () => {
    await fetch("/reset", { method: "POST" });
    cargarTareas();
};

cargarTareas();
