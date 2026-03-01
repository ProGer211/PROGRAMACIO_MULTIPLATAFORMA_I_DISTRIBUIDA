from flask import Flask, jsonify, request, render_template, redirect
import copy

app = Flask(__name__)

# --- Tareas iniciales predeterminadas ---
TAREAS_DEFAULT = [
    {"id": 1, "titulo": "Estudiar Flask", "priority": "Alta", "completed": False},
    {"id": 2, "titulo": "Hacer deporte", "priority": "Media", "completed": True},
    {"id": 3, "titulo": "Preparar proyecto", "priority": "Alta", "completed": False},
]

tareas = copy.deepcopy(TAREAS_DEFAULT)
# ---------------- HOME --------------------
@app.route("/")
def home():
    return render_template("index.html", tareas=tareas)

# ---------------- MOSTRAR FORMULARIO EDITAR --------------------
@app.route("/editar/<int:id>", methods=["GET"])
def mostrar_editar(id):
    for t in tareas:
        if t["id"] == id:
            return render_template("edit.html", task=t)
    return "Tarea no encontrada", 404

# ---------------- ACTUALIZAR DESDE FORMULARIO --------------------
@app.route("/update/<int:id>", methods=["POST"])
def actualizar_form(id):
    for t in tareas:
        if t["id"] == id:

            t["titulo"] = request.form["title"]
            t["priority"] = request.form["priority"]
            t["completed"] = "completed" in request.form

            return redirect("/")

    return "No encontrada", 404


# ---------------- API: OBTENER TAREAS --------------------
@app.route("/api/tareas", methods=["GET"])
def obtener_tareas():
    return jsonify(tareas)


@app.route("/api/tareas", methods=["POST"])
def crear_tarea():
    nuevo = request.json

    # --- VALIDACIÓN ---
    if not nuevo.get("titulo") or nuevo["titulo"].strip() == "":
        return jsonify({"error": "El título no puede estar vacío"}), 400

    prioridades_validas = ["Alta", "Media", "Baja"]

    if nuevo.get("priority") not in prioridades_validas:
        return jsonify({"error": "La prioridad debe ser Alta, Media o Baja"}), 400

    if not isinstance(nuevo.get("completed"), bool):
        return jsonify({"error": "El campo 'completed' debe ser true o false"}), 400

    tarea = {
        "id": tareas[-1]["id"] + 1 if tareas else 1,
        "titulo": nuevo["titulo"],
        "priority": nuevo["priority"],
        "completed": nuevo["completed"]
    }

    tareas.append(tarea)
    return jsonify(tarea), 201




# ---------------- API: ELIMINAR TAREA --------------------
@app.route("/api/tareas/<int:id>", methods=["DELETE"])
def eliminar_tarea(id):
    global tareas
    tareas = [t for t in tareas if t["id"] != id]
    return jsonify({"mensaje": "Tarea eliminada"})


@app.route("/api/tareas/<int:id>", methods=["PUT"])
def editar_tarea(id):
    datos = request.json

    prioridades_validas = ["Alta", "Media", "Baja"]

    # Validación de título (si viene en la petición)
    if "titulo" in datos and (not datos["titulo"] or datos["titulo"].strip() == ""):
        return jsonify({"error": "El título no puede estar vacío"}), 400

    if "priority" in datos and datos["priority"] not in prioridades_validas:
        return jsonify({"error": "La prioridad debe ser Alta, Media o Baja"}), 400

    if "completed" in datos and not isinstance(datos["completed"], bool):
        return jsonify({"error": "El campo 'completed' debe ser true o false"}), 400

    for t in tareas:
        if t["id"] == id:
            t["titulo"] = datos.get("titulo", t["titulo"])
            t["priority"] = datos.get("priority", t["priority"])
            t["completed"] = datos.get("completed", t["completed"])
            return jsonify(t)

    return jsonify({"error": "No encontrada"}), 404


# ---------------- RESET A TAREAS INICIALES --------------------
@app.route("/reset", methods=["POST"])
def resetear():
    global tareas
    tareas = copy.deepcopy(TAREAS_DEFAULT)
    return jsonify({"mensaje": "Restablecidas"}), 200




if __name__ == "__main__":
    app.run(debug=True)
