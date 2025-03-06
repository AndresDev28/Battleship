
export class Gameboard {
  constructor() {
    this.ships = []; // Ship's coordinates in the gameboard
    this.missedAttacks = [];
    this.grid = createGrid(10, 10);
  }

  // Methods
  placeShip(ship, coordinates, isVertical) {
    const shipPlacement = { // Creates an object that contains all parameters to place the ship in the gameboard
      ship: ship,
      coordinates: coordinates,
      isVertical: isVertical,
    };

    this.ships.push(shipPlacement);
  }
  receiveAttack(coordinates) {
    const [x, y] = coordinates; // Destructure the attack coordinate into x and y variables
    if (x < 0 || x > 9 || y < 0 || y > 9) { // Check if coordinates are within valid boundaries (assuming a 10x10 grid)
      throw new Error('Invalid coordinates');
    }

    if (this.missedAttacks.some(attack => attack[0] === x && attack[1] === y)) {
      throw new Error ('Cannot attack the same coordinate twice');
    }

    for (const shipPlacement of this.ships) { // Iterate over each ship placed on the board
      const {ship, coordinates: shipCoords, isVertical} = shipPlacement; // Destructure properties of the  shipPlacement object
      const [shipX, shipY] = shipCoords; // Destructure the ship coordinates into shipX and shipY variables

      if (isVertical) { // if the ship is placed vertically
        for (let i = 0; i < ship.length; i++) { // Iterate over the lenght of the ship
          if (x === shipX && y === shipY + i) { // Check if the attack coordinates match any cell of the ship
            ship.hit();
            return true; // Indicates that the ship has been hit
          }
        }
      }else { // If the ship is placed horizontally
        for (let i = 0; i < ship.length; i++) {
          if (x === shipX + i && y === shipY) {
            ship.hit();
            return true;
          }
        }
      }
    }

    this.missedAttacks.push(coordinates); // If the loop finishes without finding a ship, record the missed attack
    return false; // No ship has been hit
  }
  areAllShipsSunk() {
    return this.ships.every(shipPlacement => shipPlacement.ship.isSunk());
  }

}

function createGrid(rows, columns) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(columns).fill(null);
  }
  return grid;
}