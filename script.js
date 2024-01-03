function GameBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const getCell = (i, j) => board[i][j];

    const printBoard = () => {
        for (let i = 0; i < 3; i++) {
            let str = `[${i}] |`;
            for (let j = 0; j < 3; j++) {
                str += board[i][j].getValue() + "|";
            }
            console.log(str);
        }
    }

    const printRow = (index) => {
        let str = "|";
        for (let i = 0; i < 3; i++) {
            str += board[index][i].getValue() + "|";
        }
        console.log(str);
    }

    return { getBoard, getCell, printBoard, printRow };
}

function Cell() {
    let value = 0;

    const addToken = (playerToken) => {
        value = playerToken;
    }

    const getValue = () => value;

    const getToken = () => {
        if (value == 1) {
            return "X";
        } else if (value == 2) {
            return "O";
        } else {
            return "";
        }
    }

    return { addToken, getValue, getToken };
}

function GameController(p1 = "Player One", p2 = "Player Two") {
    // intialize players, play round, end game

    // initialize board
    let board = GameBoard();

    // initialize players
    const players = [
        {
            name: p1,
            token: 1
        },
        {
            name: p2,
            token: 2
        }
    ];

    // Game starts with p1
    let activePlayer = players[0]

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const getBoard = () => {
        return board.getBoard();
    }

    const playRound = (column, row, gameEnd) => {
        console.log(`${activePlayer.name} placing token...`);
        if (!gameEnd) {
            placeToken(column, row);
            printNewRound();
        }
    }

    const placeToken = (column, row) => {
        if(board.getCell(column, row).getValue() == 0) {
            board.getCell(column, row).addToken(activePlayer.token);
            switchPlayerTurn();
        } else {
            console.log("Invalid placement: Cell already occupied!")
        }
    }

    // returns game end status. If there is a winner, output is either 1 or 2
    // if it is a tie, return 3
    const checkGameEnd = () => {
        let result = checkGameWin();
        let tie = checkGameTie();
        if (result) {
            return result;
        } else if (tie) {
            return tie;
        } else {
            return 0;
        }
    }

    const checkGameWin = () => {
        // check rows
        for (let i = 0; i < 3; i++) {
            let result = checkRow(board.getBoard()[i]);
            if (result) {
                return result;
            }
        }

        //check columns
        for (let i = 0; i < 3; i++) {
            let result = checkCol(i);
            if (result) {
                return result;
            }
        }
        return 0;
    }

    const checkRow = (row) => {
        let current;
        let prev = row[0].getValue();
        for (let i = 0; i < 3; i++) {
            current = row[i].getValue();
            if (current != prev) {
                return 0;
            }
        }
        return prev;
    }

    const checkCol = (col) => {
        // note: the syntax is board[row][col]
        let array = [];
        for (let i = 0; i < 3; i ++) {
            array.push(board.getBoard()[i][col]);
        }
        return checkRow(array);
    }

    // checks if the board has any empty spaces. If there are empty spaces, return 0
    // If there are no empty spaces, return 3
    const checkGameTie = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board.getCell(i, j).getValue() == 0) {
                    return 0;
                }
            }
        }
        return 3;
    }

    const getWinner = () => {
        return activePlayer == players[0] ? players[1] : players[0];
    }

    const promptRow = () => {
        let row;
        do {
            row = prompt(`${activePlayer.name}: Please select row (between 0 and 2)`);
        } while (!(row < 3 && row >= 0));
        return row;
    }

    const promptCol = () => {
        let col;
        do {
            col = prompt(`${activePlayer.name}: Please select col (between 0 and 2)`);
        } while (!(col < 3 && col >= 0));
        return col;
    }

    const endGame = () => {
        board = GameBoard();
    }

    return {
        board,
        getActivePlayer,
        getBoard,
        printNewRound,
        playRound,
        checkGameEnd,
        getWinner,
        endGame
    }
}

const ScreenController = (function() {

    const listCells = document.querySelectorAll(".cell");

    const updatePlayerDisplay = (player) => {
        const playerDisplay = document.querySelector(".player-display");
        playerDisplay.textContent = player.name + "'s turn";
    }

    const updateEndGame = (gameEnd) => {
        const playerDisplay = document.querySelector(".player-display");
        if (gameEnd == 3) {
            playerDisplay.textContent = "It's a tie! Game over! Play again?";
        } else if (gameEnd == 2) {
            playerDisplay.textContent = "Player Two won! Game over! Play again?";
        } else if (gameEnd == 1) {
            playerDisplay.textContent = "Player One won! Game over! Play again?";
        }
    }

    const updateBoard = (board) => {
        board.printBoard();
        // i = row, j = col
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                listCells[i + (3 * j)].textContent = board.getCell(j, i).getToken();
            }
        }
    }

    const startBtn = document.querySelector(".start-game");
    startBtn.addEventListener("click", () => {
        let game = GameController();
        console.log("Game start");
        game.printNewRound();
        updatePlayerDisplay(game.getActivePlayer(), game.checkGameEnd());
        updateBoard(game.board);
        
        // adds event handler to board
        listCells.forEach((element) => {
            element.addEventListener("click", () => {
                // checks if game has ended, if game has ended, do not play round
                if (!game.checkGameEnd()) {
                    game.playRound(+element.dataset.row, +element.dataset.col);
                    updateBoard(game.board);
                }

                // after playRound, if game has now ended, display end game message
                // otherwise, display which player's turn it is
                if (game.checkGameEnd()) {
                    updateEndGame(game.checkGameEnd());
                } else {
                    updatePlayerDisplay(game.getActivePlayer());
                }
            });
        })
    })
})();


/*
to do:
- Screen should show each player's name and if they're X or O
- Player-Display should use each player's name
- allow player to input and change names
- keep track of number of wins for each player
- reset player scores
- styling
*/