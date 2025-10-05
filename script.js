// DOM-Elemente holen - diese Variablen zeigen auf HTML-Elemente die wir später manipulieren
const tablePlayerRow = document.getElementById("tablePlayerRow"); // Die Zeile wo Spielernamen stehen
const inputField = document.getElementById("inputField"); // Das Textfeld für Spielernamen
const tableBody = document.getElementById("tableBody"); // Der Body der Tabelle wo Runden reinkommen

// Globale Variable um zu tracken wie viele Spieler hinzugefügt wurden
// Startet bei 0, wird bei jedem addPlayer() erhöht
let playerCount = 0;

// Counter für Rundennummer - startet bei 1 und wird bei jeder neuen Runde erhöht
let counter = 1;

let saveTimeout;
let roundData = [];

// Struktur:
// rundenDaten = [
//   [10, 15, 20],   // Runde 1: Punkte für Spieler 1, 2, 3
//   [5, -5, 12]     // Runde 2
// ]

let playerArray = [];

function createPlayerInDOM(name, id) {
  tablePlayerRow.innerHTML += `<th id="${id}id">${name}</th>`;
  const totalRow = document.getElementById("totalRow");
  totalRow.innerHTML += `<td id="total${id}">0</td>`;
}

// Funktion die ausgeführt wird wenn "Hinzufügen"-Button geklickt wird
function addPlayer() {
  if (inputField.value.trim() !== "") {
    playerCount++;
    playerArray.push(inputField.value);

    createPlayerInDOM(inputField.value, playerCount); // Nutze Hilfsfunktion

    inputField.value = "";

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveGame, 500);
  }
}

function createRoundInDOM(roundNumber, values) {
  let rowHtml = `<tr><th>Runde ${roundNumber}</th>`;

  for (let i = 1; i <= playerCount; i++) {
    const value = values[i - 1] || ""; // Wert aus Array holen, oder leer falls nicht vorhanden
    rowHtml += `<td><input class="player${i}" type="number" placeholder="0" value="${value}" onchange="calculateTotals()"/></td>`;
  }
  rowHtml += `</tr>`;

  tableBody.insertAdjacentHTML("beforeend", rowHtml);
}

// Funktion die ausgeführt wird wenn "Neue Runde"-Button geklickt wird
function newRound() {
  if (playerCount === 0) {
    alert("Bitte erst Spieler hinzufügen!");
    return;
  }

  const emptyValues = new Array(playerCount).fill(""); // Leeres Array für neue Runde
  createRoundInDOM(counter, emptyValues);

  counter++;
  saveGame();
}

// Funktion die Total-Punkte für jeden Spieler berechnet
// Wird automatisch aufgerufen wenn User einen Wert in ein Input-Feld eingibt (via onchange)
function calculateTotals() {
  // Für jeden Spieler...
  for (let i = 1; i <= playerCount; i++) {
    // Alle Input-Felder dieses Spielers finden (über class="player1", "player2" etc.)
    const inputs = document.querySelectorAll(`.player${i}`);
    let total = 0; // Total für diesen Spieler

    // Durch alle Inputs dieses Spielers gehen
    inputs.forEach((input) => {
      let value = input.value; // Wert aus Input-Feld holen

      // SPEZIAL: Punkt-Konvention für negative Zahlen
      // Wenn User ".5" eingibt, wird daraus "-5"
      // Grund: Handy-Tastatur bei type="number" hat kein Minus-Zeichen
      if (value.startsWith(".")) {
        value = "-" + value.substring(1); // ".5" → "-5"
      }

      // String zu Number konvertieren und zu total addieren
      // parseFloat() für Dezimalzahlen, || 0 falls Input leer ist
      total += parseFloat(value) || 0;
    });

    // Total-Zelle für diesen Spieler updaten mit berechneter Summe
    document.getElementById(`total${i}`).textContent = total;
  }

  // Debounce: Nach 500ms ohne weiteren Input → speichern
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveGame();
  }, 500);
}

function saveGame() {
  // Leerer Array für Spieler
  let playerNames = [];

  // alles <th> aus der spieler reihe finden außer "Spieler"
  const headers = tablePlayerRow.querySelectorAll("th");

  //durch jedes <th> gehen und Text rausholen
  headers.forEach((th, index) => {
    if (index > 0) {
      playerNames.push(th.textContent);
    }
  });

  // Array in den localStorage speichern
  localStorage.setItem("playerNames", JSON.stringify(playerNames));

  // Runden Daten speichern
  let roundData = [];
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    let roundPoints = [];
    const inputs = row.querySelectorAll("input");
    inputs.forEach((input) => {
      roundPoints.push(input.value);
    });
    roundData.push(roundPoints);
  });

  localStorage.setItem("rounds", JSON.stringify(roundData));
  localStorage.setItem("playerCount", playerCount);
  localStorage.setItem("counter", counter);
}

function loadGame() {
  const savedPlayers = localStorage.getItem("playerNames");

  if (!savedPlayers) {
    return; // Keine Daten → nichts zu laden
  }

  // Daten laden
  playerArray = JSON.parse(savedPlayers);
  const roundData = JSON.parse(localStorage.getItem("rounds"));
  playerCount = parseInt(localStorage.getItem("playerCount"));
  counter = parseInt(localStorage.getItem("counter"));

  // TODO: DOM aufbauen
  playerArray.forEach((name, index) => {
    createPlayerInDOM(name, index + 1);
  });

  // Runden aufbauen - DAS FEHLT BEI DIR
  roundData.forEach((runde, index) => {
    createRoundInDOM(index + 1, runde);
  });

  calculateTotals(); // Totals neu berechnen
}

function reset() {
  localStorage.clear();

  playerCount = 0;
  counter = 1;
  playerArray = [];
  roundData = [];

  tablePlayerRow.innerHTML = "";
  tableBody.innerHTML = "";
  document.getElementById("totalRow").innerHTML = "";

  location.reload();
}

// Beim Seitenstart aufrufen
window.addEventListener("DOMContentLoaded", loadGame);
