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

    const getPlayerName = (index) => {
        return players[index].name;
    }
    
    const changePlayerName = (index, name) => {
        players[index].name = name;
    }

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

        // check diagonals
        let diagLeft = checkDiagLeft();
        if (diagLeft) {
            return diagLeft;
        }

        let diagRight = checkDiagRight();
        if (diagRight) {
            return diagRight;
        }

        // if no win
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

    const checkDiagRight = () => {
        // top left to bottom right
        let current;
        let prev = board.getBoard()[0][0].getValue();
        for (let i = 0; i < 3; i++) {
            current = board.getBoard()[i][i].getValue();
            if (current != prev) {
                return 0;
            }
        }
        return prev;
    }
    
    const checkDiagLeft = () => {
        // top right to bottom left
        prev = board.getBoard()[0][2].getValue();
        for (let i = 0; i < 3; i++) {
            current = board.getBoard()[0 + i][2 - i].getValue();
            if (current != prev) {
                return 0;
            }
        }
        return prev;
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
        players,
        getActivePlayer,
        getBoard,
        getPlayerName,
        changePlayerName,
        printNewRound,
        playRound,
        checkGameEnd,
        getWinner,
        endGame
    }
}

const ScreenController = (function() {

    // initialize scores
    let scores = [0, 0];

    let game = GameController();

    const listCells = document.querySelectorAll(".cell");

    const updatePlayerDisplay = () => {
        const playerDisplay = document.querySelector(".player-display");
        playerDisplay.textContent = game.getActivePlayer().name + "'s turn";
    }

    const updateEndGame = (gameEnd) => {
        const playerDisplay = document.querySelector(".player-display");
        const playerScores = document.querySelectorAll(".score");
        if (gameEnd == 3) {
            playerDisplay.textContent = "It's a tie! Game over! Play again?";
        } else if (gameEnd == 2 || gameEnd == 1) {
            playerDisplay.textContent = `${game.getPlayerName(gameEnd - 1)} won! Game over! Play again?`;
            playerScores[gameEnd - 1].textContent = +playerScores[gameEnd - 1].textContent + 1;
        }
    }

    const updateBoard = () => {
        game.board.printBoard();
        // i = row, j = col
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                listCells[i + (3 * j)].textContent = game.board.getCell(j, i).getToken();
            }
        }
    }

    const startBtn = document.querySelector(".start-game");
    startBtn.addEventListener("click", () => {
        game = GameController();
        console.log("Game start");
        game.printNewRound();
        updatePlayerDisplay();
        updateBoard();
    })

    // adds event handler to board
    listCells.forEach((element) => {
        element.addEventListener("click", () => {
            // checks if game has ended, if game has ended, do not play round
            if (!game.checkGameEnd()) {
                game.playRound(+element.dataset.row, +element.dataset.col);
                updateBoard();
            }

            // after playRound, if game has now ended, display end game message
            // otherwise, display which player's turn it is
            if (game.checkGameEnd()) {
                updateEndGame(game.checkGameEnd());
            } else {
                updatePlayerDisplay();
            }
        });
    })

    const updatePlayerInfo = () => {
        const playerNameElements = document.querySelectorAll(".player-name");
        playerNameElements.forEach((element, index) => {
            element.textContent = game.getPlayerName(index);
        })
    }

    // Change Name buttons
    const listChangeNameBtns = document.querySelectorAll(".change-name");
    listChangeNameBtns.forEach((element, index) => {
        element.addEventListener("click", () => {
            const newName = prompt(`Enter Player One's name:`);
            // console.log(newName);
            game.changePlayerName(index, newName);
            updatePlayerInfo();
            updatePlayerDisplay();
        })
    })

    // reset-scores button
    const resetBtn = document.querySelector(".reset-scores");
    resetBtn.addEventListener("click", () => {
        const playerScores = document.querySelectorAll(".score");
        playerScores.forEach((element) => {
            element.textContent = "0";
        })
        game = GameController();
        updatePlayerDisplay();
        updateBoard();
    })
})();


/*
to do:
- styling
- diagonal win conditions
*/