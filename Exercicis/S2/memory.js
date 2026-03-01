let primera_carta = null;
let segunda_carta = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let totalPairs = 0;
let timerInterval = null;
let seconds = 0;

function initial_cards(n) {
  return new Array(n)
    .fill(0)
    .map((_, i) => Math.floor(i / 2 + 1))
    .sort(() => Math.random() - 0.5);
}

$(document).ready(function () {
  $("#start").on("click", startGame);
});

function startGame() {
  clearInterval(timerInterval);
  seconds = 0;
  moves = 0;
  matches = 0;
  $("#timer").text(0);
  $("#moves").text(0);

  const totalCartas = parseInt($("#difficulty").val());
  totalPairs = totalCartas / 2;
  const cards = initial_cards(totalCartas);
  const $tablero = $("#tablero");
  $tablero.empty();

  const $table = $("<table>").css({ width: "100%", height: "100%" });
  let index = 0;

 
  const cols = 4;
  const rows = totalCartas / cols;

  for (let row = 0; row < rows; row++) {
    const $tr = $("<tr>");
    for (let col = 0; col < cols; col++) {
      const $img = $("<img>")
        .attr({
          src: `figure${cards[index]}.svg`,
          alt: `figure${cards[index]}`,
        })
        .addClass("hidden")
        .css({ width: "100%", height: "100%" })
        .on("click", function () {
          show_me($(this));
        });

      const $td = $("<td>").append($img);
      $tr.append($td);
      index++;
    }
    $table.append($tr);
  }

  $tablero.append($table);

  startTimer();
}

function show_me($card) {
  if (lockBoard || $card.is(primera_carta)) return;

  $card.removeClass("hidden");

  if (!primera_carta) {
    primera_carta = $card;
    return;
  }

  segunda_carta = $card;
  lockBoard = true;
  moves++;
  $("#moves").text(moves);

  const coincideixen = primera_carta.attr("alt") === segunda_carta.attr("alt");

  if (coincideixen) {
    matches++;
    primera_carta = null;
    segunda_carta = null;
    lockBoard = false;

    if (matches === totalPairs) {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`¡Has ganado! Tiempo: ${seconds}s | Movimientos: ${moves}`);
      }, 300);
    }
  } else {
    setTimeout(() => {
      primera_carta.addClass("hidden");
      segunda_carta.addClass("hidden");
      primera_carta = null;
      segunda_carta = null;
      lockBoard = false;
    }, 1000);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    $("#timer").text(seconds);
  }, 1000);
}
