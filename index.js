import { renderGameboard } from '../src/dom.js';
import { Gameboard } from '../src/gameboard.js';
import { Game } from "../src/game.js";

const gameboarPlayer = document.getElementById('player-board-container');
const gameboarComputer = document.getElementById('computer-board-container');

const gameInstance = new Game();
gameInstance.startGame();

renderGameboard(gameInstance.gameboardPlayer1, gameboarPlayer);
renderGameboard(gameInstance.gameboardPlayer2, gameboarComputer);