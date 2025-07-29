// 🟫 Define snakes and ladders
const snakeLadders = {
  38: 20,
  45: 7,
  51: 10,
  65: 54,
  91: 73,
  97: 61,
  5: 58,
  14: 49,
  42: 60,
  53: 72,
  64: 83,
  75: 94,
};

// 🟪 Elements
const btns = document.getElementsByName("noOfPlayers");
const playerInputsDiv = document.getElementById("playerInputs");
const table = document.getElementById("bgImg");
const colors = ["red", "green", "blue", "yellow"];
let players = [];
let currentPlayerIndex = 0;
let id = 1;

// 🟩 Generate 10x10 board in snake pattern
(() => {
  let cellId = 100;
  for (let row = 1; row <= 10; row++) {
    const tr = document.createElement("tr");
    if (row % 2 !== 0) {
      for (let col = 0; col < 10; col++) {
        const td = document.createElement("td");
        td.id = "td" + cellId--;
        tr.appendChild(td);
      }
    } else {
      let start = cellId - 9;
      for (let col = 0; col < 10; col++) {
        const td = document.createElement("td");
        td.id = "td" + start++;
        tr.appendChild(td);
      }
      cellId -= 10;
    }
    table.appendChild(tr);
  }
})();

// 🟦 Player selection buttons
btns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const numPlayers = parseInt(this.value);
    btns.forEach((b) => b.classList.toggle("active", b === this));
    playerInputsDiv.innerHTML = "";
    for (let i = 1; i <= numPlayers; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "player form-control-lg mt-2";
      input.placeholder = `Player ${i}`;
      playerInputsDiv.appendChild(input);
      playerInputsDiv.appendChild(document.createElement("br"));
    }
  });
});

// 🟥 Start Game button
function startGame() {
  players = [];
  currentPlayerIndex = 0;
  const txtplayers = playerInputsDiv.getElementsByClassName("player");

  for (let i = 0; i < txtplayers.length; i++) {
    const name = txtplayers[i].value || `Player ${i + 1}`;
    const color = colors[i];
    players.push(new Player(name, color));
  }

  document.getElementById("loading").style.display = "block";
  setTimeout(() => start(), 500);
}

// 🟨 Player object
function Player(name, color) {
  this.id = id++;
  this.name = name;
  this.position = 1;
  this.color = color;
}

// 🟦 Start the game board
function start() {
  table.style.display = "table";
  document.getElementById("rules").style.display = "none";
  document.getElementById("start").style.display = "none";
  document.getElementById("loading").style.display = "none";

  players.forEach((p) => move(p));

  document.getElementById("dice").innerHTML = `
    <p class="text-info text-center">Roll the dice</p>
    <div class="d-flex m-2">
      <img id="diceRoll" src="assets/dice1.png" alt="Dice" />
    </div>
    <p class="ani1" id="turnDisplay">${players[currentPlayerIndex].name}'s turn</p>
  `;

  renderLeaderboard(players);
  document.getElementById("diceRoll").addEventListener("click", rollDice);
}

// 🎲 Dice roll and movement logic
function rollDice() {
  const diceRoll = document.getElementById("diceRoll");
  const currentPlayer = players[currentPlayerIndex];
  const rand = Math.floor(Math.random() * 6) + 1;
  diceRoll.style.transition = "transform 0.5s ease, background-color 0.5s ease";

  // Phase 1: Shrink and rotate (start roll)
  diceRoll.style.transform = "scale(0.7) rotateY(90deg)";
  diceRoll.style.backgroundColor = "gray";

  // Phase 2: Expand and update dice face (end roll)
  setTimeout(() => {
    diceRoll.src = `assets/dice${rand}.png`; // Update dice face mid-animation
    diceRoll.style.transform = "scale(1) rotateY(360deg)";
    diceRoll.style.backgroundColor = "white";
  }, 500);

  let steps = 0;
  const interval = setInterval(() => {
    if (steps < rand && currentPlayer.position < 100) {
      currentPlayer.position++;
      move(currentPlayer);
      steps++;
    } else {
      clearInterval(interval);

      const msgBox = document.getElementById("msg");

      // 🪜 or 🐍
      if (snakeLadders[currentPlayer.position]) {
        const oldPos = currentPlayer.position;
        currentPlayer.position = snakeLadders[oldPos];
        move(currentPlayer);

        const msg =
          oldPos < currentPlayer.position ? "🪜 Ladder!" : "🐍 Snake!";
        msgBox.textContent = `${msg} ➜ ${currentPlayer.name} moved from ${oldPos} to ${currentPlayer.position}.`;
        msgBox.classList.add(
          "ani1",
          msg.includes("Ladder") ? "text-success" : "text-danger"
        );

        setTimeout(() => {
          msgBox.textContent = "";
          msgBox.classList.remove("ani1", "text-success", "text-danger");
        }, 3000);
      }

      // 🏁 Check for winner
      if (checkWin(currentPlayer)) return;

      if (rand !== 6) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      }

      document.getElementById("turnDisplay").textContent =
        players[currentPlayerIndex].name + "'s turn";
      document.getElementById("turnDisplay").style.color =
        players[currentPlayerIndex].color;

      renderLeaderboard(players);
    }
  }, 300);
}

// 🟩 Move player's pawn on board
function move(player) {
  // Remove old pawn
  document.querySelectorAll("td").forEach((td) => {
    td.querySelectorAll("span").forEach((span) => {
      if (span.title === player.name) span.remove();
    });
  });

  // Add new pawn
  const td = document.getElementById("td" + player.position);
  const pawn = document.createElement("span");
  pawn.className = `pawn ${player.color} p0`;
  pawn.title = player.name;
  let tblPawns = table.querySelectorAll("span");
  // console.log(table.querySelectorAll("span"));
  if (
    players[currentPlayerIndex] &&
    player.name === players[currentPlayerIndex].name
  ) {
    tblPawns.forEach((span) => {
      span.classList.remove("ani2");
    });
    pawn.classList.add("ani2");
    setTimeout(() => {
      pawn.classList.remove("ani2");
    }, 1000);
  }

  td.appendChild(pawn);
  const allPawns = td.querySelectorAll("span");

  if (allPawns.length !== 1) {
    allPawns.forEach((span, i) => {
      span.classList.add("p" + (i + 1));
      span.classList.remove("p0");
    });
  }
}

// 🏆 Check if player won
function checkWin(player) {
  if (player.position >= 100) {
    const msgBox = document.getElementById("msg");
    msgBox.textContent = `🏆 ${player.name} wins the game! 🥇`;
    msgBox.classList.add("ani1", "text-warning");

    setTimeout(() => {
      msgBox.textContent = "";
      msgBox.classList.remove("ani1", "text-warning");
      location.reload(); // Restart game
    }, 10000);

    return true;
  }
  return false;
}

// 🟧 Leaderboard rendering
function renderLeaderboard(players) {
  const leaderboardDiv = document.getElementById("leaderBoard");
  leaderboardDiv.innerHTML = "";

  const sorted = [...players].sort((a, b) => b.position - a.position);
  const table = document.createElement("table");
  table.className = "table table-bordered table-striped text-center";
  table.style.width = "80%";

  let tr = document.createElement("tr");
  tr.innerHTML = `<th colspan="5">Leader Board</th>`;
  table.appendChild(tr);

  const headers = ["Pawn", "#", "Player ID", "Player Name", "Position"];
  tr = document.createElement("tr");
  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    tr.appendChild(th);
  });
  table.appendChild(tr);

  sorted.forEach((player, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="lPawn" style="background-color:${
        player.color
      }"></span></td>
      <td>${index + 1}</td>
      <td>${player.id}</td>
      <td>${player.name}</td>
      <td>${player.position}</td>
    `;
    table.appendChild(row);
  });

  leaderboardDiv.appendChild(table);
}
