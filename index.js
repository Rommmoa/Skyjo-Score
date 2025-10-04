const tablePlayerRow = document.getElementById("tablePlayerRow");
const inputField = document.getElementById("inputField");
const tableBody = document.getElementById("tableBody");

let playerCount = 0;

function addPlayer() {
    if (inputField.value.trim() !== "") {
        playerCount++;

        tablePlayerRow.innerHTML += `<th id="${playerCount}id">${inputField.value}</th>`;

        // Total-Zelle für diesen Spieler
        const totalRow = document.getElementById("totalRow");
        totalRow.innerHTML += `<td id="total${playerCount}">0</td>`;

        inputField.value = "";
    }
}

let counter = 1;

function newRound() {
    if (playerCount === 0) {
        alert("Bitte erst Spieler hinzufügen!");
        return;
    }


    let rowHtml = `<tr><th>Runde ${counter}</th>`;
    for (let i = 1; i <= playerCount; i++) {
        rowHtml += `<td><input class="player${i}" type="number" placeholder="0" onchange="calculateTotals()"/></td>`;
    }
    rowHtml += `</tr>`;

    tableBody.insertAdjacentHTML("beforeend", rowHtml);
    counter++;
}

function calculateTotals() {
    for (let i = 1; i <= playerCount; i++) {
        const inputs = document.querySelectorAll(`.player${i}`);
        let total = 0;

        inputs.forEach((input) => {
            let value = input.value;
            if (value.startsWith(".")) {
                value = "-" + value.substring(1);
            }
            total += parseFloat(value) || 0;
        });

        // Total-Zelle updaten
        document.getElementById(`total${i}`).textContent = total;
    }
}
