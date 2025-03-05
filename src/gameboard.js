
export class Gameboard {
  constructor() {
    this.ships = []; // Ship's coordinates in the gameboard
    this.missedAttacks = [];
    this.grid;
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
  recieveAttack(coordinates) {
    const [x, y] = coordinates; // Destructure the attack coordinate into x and y variables

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