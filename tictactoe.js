const BOARD = [
        Array.from({ length: 3 }, (x, i) => x),
        Array.from({ length: 3 }, (x, i) => x),
        Array.from({ length: 3 }, (x, i) => x),
];

const CHOICES = ["X", "O"];
let PLAYER = null;
let COMPUTER = null;
let GAMEOVER = false;
let WINNER = null;

game()

async function game() {
        console.log("Welcome To Tic Tac Toe")
        console.log("==========================")

        let choice = await Ask('Please Choose a Letter X or O \n X is 0 \n 0 is 1\n input: ');
        handleChoice(choice);
        if (GAMEOVER) {
                return
        }
        console.log('You chose ${PLAYER}')
        console.log('Computer chose ${COMPUTER}')
        printBoard();
        console.log("==========================")
        gameLogic();
}

function handleChoice(choice) {
        choice = Number(choice);
        if (choice > 1 || typeof choice != 'number') {
                console.log("Bad input. Game over due to technicality.")
                GAMEOVER = true;
        }
        PLAYER = CHOICES[choice]

        if (choice > 0) {
                choice--;
        } else {
                choice++;
        }
        COMPUTER = CHOICES[choice]
}

async function gameLogic() {
        if (GAMEOVER) {
                gameOverMessage();
                return;
        }
        await playerTurn();

        if (GAMEOVER) {
                gameOverMessage();
                return;
        }

        computerTurn();

        await gameLogic();
}

function updateBoard(choice, row, column) {
        BOARD[row][column] = choice;
        printBoard();
}

function isValidMove(chosenRow, chosenColumn) {
        let valid = false;
        if (BOARD[chosenRow][chosenColumn] !== 'X' && BOARD[chosenRow][chosenColumn] !== 'X' && BOARD[chosenRow][chosenColumn] !== 'O') {
                valid = true;
        }
        return valid
}

function checkThreeInARow() {
        const threeInARow = {
                "row0column0": null,
                "row0column1": null,
                "row0column2": null,
                "row1column0": null,
                "row1column1": null,
                "row1column2": null,
                "row2column0": null,
                "row2column1": null,
                "row2column2": null,
        };
        for (let row in BOARD) {
                for (let column in BOARD[row]) {
                        if (BOARD[row][column] === 'X') {
                                threeInARow["row" + row + "column" + column] = 0;
                        } else if (BOARD[row][column] === 'O') {
                                threeInARow["row" + row + "column" + column] = 1;
                        }
                }
        }

        if (threeInARow["row0column0"] === threeInARow["row0column1"] && threeInARow["row0column1"] === threeInARow["row0column2"] && threeInARow["row0column0"] !== null) {
                WINNER = threeInARow["row0column0"];
                GAMEOVER = true;
        } else if (threeInARow["row1column0"] === threeInARow["row1column1"] && threeInARow["row1column1"] === threeInARow["row1column2"] && threeInARow["row1column0"] !== null) {
                WINNER = threeInARow["row1column0"];
                GAMEOVER = true;
        } else if (threeInARow["row2column0"] === threeInARow["row2column1"] && threeInARow["row2column1"] === threeInARow["row2column2"] && threeInARow["row2column0"] !== null) {
                WINNER = threeInARow["row2column0"];
                GAMEOVER = true;
        } else if (threeInARow["row0column0"] === threeInARow["row1column0"] && threeInARow["row1column0"] === threeInARow["row2column0"] && threeInARow["row2column0"] !== null) {
                WINNER = threeInARow["row2column0"];
                GAMEOVER = true;
        } else if (threeInARow["row0column1"] === threeInARow["row1column1"] && threeInARow["row1column1"] === threeInARow["row2column1"] && threeInARow["row2column1"] !== null) {
                WINNER = threeInARow["row2column1"];
                GAMEOVER = true;
        } else if (threeInARow["row0column2"] === threeInARow["row1column2"] && threeInARow["row1column2"] === threeInARow["row2column2"] && threeInARow["row2column2"] !== null) {
                WINNER = threeInARow["row2column2"];
                GAMEOVER = true;
        } else if (threeInARow["row0column0"] === threeInARow["row1column1"] && threeInARow["row1column1"] === threeInARow["row2column2"] && threeInARow["row2column2"] !== null) {
                WINNER = threeInARow["row0column0"];
                GAMEOVER = true;
        } else if (threeInARow["row0column2"] === threeInARow["row1column1"] && threeInARow["row1column1"] === threeInARow["row2column0"] && threeInARow["row2column0"] !== null) {
                WINNER = threeInARow["row0column2"];
                GAMEOVER = true;
        } else if (checkIfBoardIsFull()) {
                WINNER = null;
                GAMEOVER = true;
        }
}

function checkIfBoardIsFull() {
        let count = 0;
        const full = 9;
        let gameOver = false;
        for (let row in BOARD) {
                for (let column in BOARD) {
                        if (BOARD[row][column] === 'X' || BOARD[row][column] === 'O') {
                                count++;
                        }
                }
        }
        if (count === full) {
                gameOver = true;
        }
        return gameOver
}

async function playerTurn(badMove) {
        checkThreeInARow();
        if (GAMEOVER) {
                return;
        }
        if (badMove) {
                console.log("Bad Move. Try again.")
                badMove = false
        }
        let row = await Ask(`Please Choose A Row (0,1,2) to Place ${PLAYER}: `);
        row = Number(row)
        if (row !== 0 && row !== 1 && row !== 2) {
                badMove = true;
                await playerTurn(badMove);
        }
        let column = await Ask(`Please Choose a Column (0,1,2) to Place ${PLAYER}: `);
        column = Number(column)
        if (column !== 0 && column !== 1 && column !== 2) {
                badMove = true;
                await playerTurn(badMove);
        }
        if (isValidMove(row, column)) {
                updateBoard(PLAYER, row, column);
        } else {
                badMove = true;
                await playerTurn(badMove);
        }
}

function computerTurn() {
        checkThreeInARow();
        if (GAMEOVER) {
                return;
        }
        const row = Math.floor(Math.random() * 3);
        const column = Math.floor(Math.random() * 3);
        if (isValidMove(row, column)) {
                updateBoard(COMPUTER, row, column);
        } else {
                computerTurn();
        }
}

function gameOverMessage() {
        console.log("\n\n")
        console.log("Game Over!")
        if (WINNER === null) {
                console.log(`There was a Tie`)
                return
        }
        const whoWon = CHOICES[WINNER]
        if (PLAYER === whoWon) {
                console.log(`Congratulations ${PLAYER}! You Won!!!`)
        } else {
                console.log(`Dang ${PLAYER}... You Lost :(...Better luck next time!`)
        }
}

function printBoard() {
        rowCount = 0
        let row1 = "";
        let row2 = "";
        let row3 = "";
        for (let row in BOARD) {
                colCount = 0
                for (let column in BOARD[row]) {
                        let value = BOARD[row][column] ? BOARD[row][column] : ' ';
                        if (row == 0 && column == 0) {
                                row1 += `${value}|`;
                        } else if (row == 0 && column == 1) {
                                row1 += `${value}|`;
                        } else if (row == 0 && column == 2) {
                                row1 += `${value}`;
                        } else if (row == 1 && column == 0) {
                                row2 += `${value}|`;
                        } else if (row == 1 && column == 1) {
                                row2 += `${value}|`;
                        } else if (row == 1 && column == 2) {
                                row2 += `${value}`;
                        } else if (row == 2 && column == 0) {
                                row3 += `${value}|`;
                        } else if (row == 2 && column == 1) {
                                row3 += `${value}|`;
                        } else if (row == 2 && column == 2) {
                                row3 += `${value}`;
                        }
                        colCount++;
                }
                rowCount++;
        }
        console.log(row1);
        console.log(row2);
        console.log(row3);
        console.log("==========================\n")
}

function Ask(query) {
        const readline = require("readline").createInterface({
                input: process.stdin,
                output: process.stdout
        });

        return new Promise(resolve => readline.question(query, ans => {
                readline.close();
                resolve(ans);
        }))
}
