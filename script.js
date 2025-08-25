// Gameboard Module
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""]; // 1D array

  const getBoard = () => board;
  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };
  const reset = () => { board = ["", "", "", "", "", "", "", "", ""]; };

  return { getBoard, setCell, reset };
})();

// Player Factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game Controller Module
const GameController = (() => {
  let player1, player2, activePlayer;
  let gameOver = false;

  const start = (name1 = "Alice", name2 = "Bob") => {
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    activePlayer = player1;
    gameOver = false;
    Gameboard.reset();
  };

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (index) => {
    if (gameOver || !Gameboard.setCell(index, activePlayer.marker)) return null;

    if (checkWinner()) {
      gameOver = true;
      return `${activePlayer.name} wins!`;
    }
    if (Gameboard.getBoard().every(cell => cell !== "")) {
      gameOver = true;
      return "It's a tie!";
    }

    switchTurn();
    return `${activePlayer.name}'s turn`;
  };

  const checkWinner = () => {
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winCombos.some(combo =>
      combo.every(i => Gameboard.getBoard()[i] === activePlayer.marker)
    );
  };

  return { start, playRound, getActivePlayer };
})();

// Display Controller Module
const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const message = document.querySelector("#message");
  const restartBtn = document.querySelector("#restart");

  // Handle clicks on cells
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      const status = GameController.playRound(index);
      render(status);
    });
  });

  // Handle restart button
  restartBtn.addEventListener("click", () => {
    GameController.start();
    render(`${GameController.getActivePlayer().name}'s turn`);
  });

  const render = (status) => {
    Gameboard.getBoard().forEach((mark, i) => {
      cells[i].textContent = mark;
    });
    if (status) {
      message.textContent = status;
    }
  };

  // Initialize
  GameController.start();
  render(`${GameController.getActivePlayer().name}'s turn`);

  return { render };
})();
