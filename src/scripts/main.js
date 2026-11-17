'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const boardElement = document.getElementById('board');
const scoreElement = document.querySelector('.game-score');
const statusElement = document.getElementById('status-message');
const startButton = document.getElementById('start-btn');

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
  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    statusElement.className = 'message hidden';
  } else if (currentStatus === 'playing') {
    statusElement.className = 'message hidden';
  } else if (currentStatus === 'win') {
    statusElement.textContent = 'You win! Restart the game?';
    statusElement.className = 'message message-win';
  } else if (currentStatus === 'lose') {
    statusElement.textContent = 'You lose! Restart the game?';
    statusElement.className = 'message message-lose';
  }

  startButton.textContent = currentStatus === 'idle' ? 'Start' : 'Restart';
  startButton.classList.toggle('start', currentStatus === 'idle');
  startButton.classList.toggle('restart', currentStatus !== 'idle');
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
