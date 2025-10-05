// DOM-Elemente holen - diese Variablen zeigen auf HTML-Elemente die wir später manipulieren
const tablePlayerRow = document.getElementById("tablePlayerRow"); // Die Zeile wo Spielernamen stehen
const inputField = document.getElementById("inputField"); // Das Textfeld für Spielernamen
const tableBody = document.getElementById("tableBody"); // Der Body der Tabelle wo Runden reinkommen

// Globale Variable um zu tracken wie viele Spieler hinzugefügt wurden
// Startet bei 0, wird bei jedem addPlayer() erhöht
let playerCount = 0;

// Funktion die ausgeführt wird wenn "Hinzufügen"-Button geklickt wird
function addPlayer() {
  // Check ob Input nicht leer ist (trim() entfernt Leerzeichen am Anfang/Ende)
  if (inputField.value.trim() !== "") {
    // Spielerzahl erhöhen (IDs starten bei 1, nicht 0)
    playerCount++;

    // Neue Spalte zur Header-Zeile hinzufügen mit Spielername
    // ID format: "1id", "2id", "3id" etc.
    tablePlayerRow.innerHTML += `<th id="${playerCount}id">${inputField.value}</th>`;

    // Total-Zeile im Footer holen und neue Zelle für diesen Spieler hinzufügen
    const totalRow = document.getElementById("totalRow");
    // Jede Total-Zelle hat ID "total1", "total2", etc. - startet mit 0 Punkten
    totalRow.innerHTML += `<td id="total${playerCount}">0</td>`;

    // Input-Feld leeren nach Hinzufügen
    inputField.value = "";
  }
}

// Counter für Rundennummer - startet bei 1 und wird bei jeder neuen Runde erhöht
let counter = 1;

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
}
