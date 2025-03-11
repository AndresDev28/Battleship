
import { Gameboard } from '../src/gameboard.js';
export class Player {
  constructor(type) {
    this.gameboard = new Gameboard(); // Initialize gameboard
    this.type = type; // Human or computer
  }

  // Methods
  attack(gameboard, coordinates) {
    gameboard.receiveAttack(coordinates);
  }

  generateRandomCoords(gameboard) { // For computer player
    let x, y; // Initialize x and y
    while (true) {
      x = Math.floor(Math.random() * 10); // Generate random integer between 0 and 9
      y = Math.floor(Math.random() * 10);

      // Check if the coordinates have already been attacked
      if (!gameboard.missedAttacks.some(attack => attack[0] === x && attack[1] === y)) {
        return [x, y]; // Return the valid coordinates
      }
    }
  }
}
