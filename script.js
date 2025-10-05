// DOM-Elemente holen - diese Variablen zeigen auf HTML-Elemente die wir später manipulieren
const tablePlayerRow = document.getElementById("tablePlayerRow"); // Die Zeile wo Spielernamen stehen
const inputField = document.getElementById("inputField"); // Das Textfeld für Spielernamen
const tableBody = document.getElementById("tableBody"); // Der Body der Tabelle wo Runden reinkommen

// Globale Variable um zu tracken wie viele Spieler hinzugefügt wurden
// Startet bei 0, wird bei jedem addPlayer() erhöht
let playerCount = 0;

function createPlayerInDOM(name, id) {
  tablePlayerRow.innerHTML += `<th id="${id}id">${name}</th>`;
  const totalRow = document.getElementById("totalRow");
  totalRow.innerHTML += `<td id="total${id}">0</td>`;
}

// Funktion die ausgeführt wird wenn "Hinzufügen"-Button geklickt wird
function addPlayer() {
  if (inputField.value.trim() !== "") {
    playerCount++;
    spielerArray.push(inputField.value);

    createPlayerInDOM(inputField.value, playerCount); // Nutze Hilfsfunktion

    inputField.value = "";

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveGame, 500);
  }
}

// Counter für Rundennummer - startet bei 1 und wird bei jeder neuen Runde erhöht
let counter = 1;

let saveTimeout;
let rundenDaten = [];

// Struktur:
// rundenDaten = [
//   [10, 15, 20],   // Runde 1: Punkte für Spieler 1, 2, 3
//   [5, -5, 12]     // Runde 2
// ]

// Funktion die ausgeführt wird wenn "Neue Runde"-Button geklickt wird
function newRound() {
  // Check ob überhaupt Spieler existieren
  if (playerCount === 0) {
    alert("Bitte erst Spieler hinzufügen!");
    return; // Funktion beenden wenn keine Spieler
  }

  // HTML für neue Runde zusammenbauen
  // Startet mit <tr> und Rundennummer
  let rowHtml = `<tr><th>Runde ${counter}</th>`;

  // Für jeden Spieler ein Input-Feld erstellen
  // Loop startet bei 1 weil playerCount bei 1 startet
  for (let i = 1; i <= playerCount; i++) {
    // Jedes Input bekommt class="player1", "player2" etc. - damit wir später alle Inputs eines Spielers finden können
    // type="number" zeigt Zahlen-Tastatur auf Handy
    // onchange ruft calculateTotals() auf sobald User einen Wert eingibt
    rowHtml += `<td><input class="player${i}" type="number" placeholder="0" onchange="calculateTotals()"/></td>`;
  }
  rowHtml += `</tr>`;

  // Neue Zeile zur Tabelle hinzufügen
  // insertAdjacentHTML statt innerHTML += damit bestehende Input-Werte nicht verloren gehen
  tableBody.insertAdjacentHTML("beforeend", rowHtml);

  // Rundencounter erhöhen für nächste Runde
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
  localStorage.setItem("spieler", JSON.stringify(playerNames));

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
  const savedPlayers = localStorage.getItem("player");

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
}

// Beim Seitenstart aufrufen
window.addEventListener("DOMContentLoaded", loadGame);
