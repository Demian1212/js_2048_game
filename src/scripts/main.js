'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const boardElement = document.getElementById('board');
const scoreElement = document.querySelector('.game-score');
const startButton = document.getElementById('start-btn');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  boardElement.innerHTML = '';

  for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const value = state[rowIndex][colIndex];
      const cell = document.createElement('div');

      cell.classList.add('field-cell');

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }

      boardElement.append(cell);
    }
  }
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateStatus() {
  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  startButton.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';

  startButton.classList.toggle('start', gameStatus === 'idle');
  startButton.classList.toggle('restart', gameStatus !== 'idle');
}

function startGame() {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  scoreElement.textContent = '';

  renderBoard();
  updateStatus();
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (keyEvent) => {
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (!moves[keyEvent.key]) {
    return;
  }

  keyEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  moves[keyEvent.key]();

  renderBoard();
  updateScore();
  updateStatus();
});

renderBoard();
updateStatus();
