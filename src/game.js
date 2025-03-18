import { Player } from './player.js';
import { Gameboard } from "./gameboard.js";

export class Game {
  constructor() {
    this.player1 = null;
    this.player2 = null;
    this.gameboardPlayer1 = null;
    this.gameboardPlayer2 = null;
    this.currentPlayer = null; // To keep track of current player
  }

  startGame() {
    // 1. Create gameboards for both players
    this.gameboardPlayer1 = new Gameboard();
    this.gameboardPlayer2 = new Gameboard();

    // 2. Create players, associating them with their gameboards
    this.player1 = new Player("Human", this.gameboardPlayer1);
    this.player2 = new Player("ai", this.gameboardPlayer2);

    // 3. (Optional - Ship placement - we'll add this later) ...

    // 4. Set the initial turn (Player 1 start by default)
    this.currentPlayer = this.player1;
  }

  nextTurn() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }
}