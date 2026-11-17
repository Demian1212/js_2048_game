export class Game {
  constructor(initialState = null) {
    this.board = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.hasWon = false;

    this.#addRandomTile();
    this.#addRandomTile();
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.hasWon = false;

    this.#addRandomTile();
    this.#addRandomTile();
  }

  #addRandomTile() {
    const emptyCells = [];

    for (let emptyRow = 0; emptyRow < 4; emptyRow++) {
      for (let emptyCol = 0; emptyCol < 4; emptyCol++) {
        if (this.board[emptyRow][emptyCol] === 0) {
          emptyCells.push([emptyRow, emptyCol]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [selectedRow, selectedCol] = emptyCells[randomIndex];

    this.board[selectedRow][selectedCol] = Math.random() < 0.9 ? 2 : 4;
  }

  #slideLeft(line) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];
    let points = 0;

    for (let index = 0; index < numbers.length; index++) {
      if (numbers[index] === numbers[index + 1]) {
        const merged = numbers[index] * 2;

        result.push(merged);
        points += merged;
        index++;
      } else {
        result.push(numbers[index]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { row: result, points };
  }

  #move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);
    const oldBoardCopy = this.board.map((boardRow) => [...boardRow]);
    let points = 0;

    for (let index = 0; index < 4; index++) {
      let line;

      if (direction === 'left' || direction === 'right') {
        line = [...oldBoardCopy[index]];
      } else {
        line = oldBoardCopy.map((boardRow) => boardRow[index]);
      }

      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      const result = this.#slideLeft(line);

      if (direction === 'right' || direction === 'down') {
        result.row.reverse();
      }

      points += result.points;

      for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
        if (direction === 'left' || direction === 'right') {
          this.board[index][cellIndex] = result.row[cellIndex];
        } else {
          this.board[cellIndex][index] = result.row[cellIndex];
        }
      }
    }

    if (JSON.stringify(this.board) === oldBoard) {
      return;
    }

    this.score += points;

    if (!this.hasWon) {
      for (const boardRow of this.board) {
        if (boardRow.includes(2048)) {
          this.status = 'win';
          this.hasWon = true;
          break;
        }
      }
    }

    this.#addRandomTile();

    if (this.status !== 'win' && this.#checkGameOver()) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    this.#move('left');
  }

  moveRight() {
    this.#move('right');
  }

  moveUp() {
    this.#move('up');
  }

  moveDown() {
    this.#move('down');
  }

  #checkGameOver() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          return false;
        }

        if (
          colIndex < 3 &&
          this.board[rowIndex][colIndex] === this.board[rowIndex][colIndex + 1]
        ) {
          return false;
        }

        if (
          rowIndex < 3 &&
          this.board[rowIndex][colIndex] === this.board[rowIndex + 1][colIndex]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
