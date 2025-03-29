export class Gameboard {
  constructor() {
    this.ships = []; // Ship's coordinates in the gameboard
    this.missedAttacks = [];
    this.grid = createGrid(10, 10);
    this.attemptedPlacements = [];
  }

  // Methods
  placeShip(ship, coordinates, isVertical) {
    const shipCoords = calculateShipCoords(ship, coordinates, isVertical);
    
    // Validar antes de hacer cualquier modificación al tablero
    this.validateShipPlacement(shipCoords);
    this.validateNoOverlap(shipCoords);

    // Si las validaciones pasan, colocar el barco
    for (const coords of shipCoords) {
      const [row, col] = coords;
      this.grid[row][col] = ship;
    }

    // Registrar la colocación del barco
    const shipPlacement = {
      ship,
      coordinates,
      isVertical,
    };
    this.ships.push(shipPlacement);
    return true;
  }


  validateShipPlacement(shipCoords) {
    for (const coord of shipCoords) {
      const [row, col] = coord;
      if (row < 0 || row > 9 || col < 0 || col > 9) {
        const direction = col > 9 ? 'right' : col < 0 ? 'left' : row > 9 ? 'bottom' : 'top';
        throw new Error(`Ship extends beyond the ${direction} edge of the board`);
      }
    }
  }

  validateNoOverlap(newShipCoords) {
    for (const newCoord of newShipCoords) {
      for (const placedShipPlacement of this.ships) {
        const placedShipCoords = calculateShipCoords(
          placedShipPlacement.ship, 
          placedShipPlacement.coordinates, 
          placedShipPlacement.isVertical
        );
        
        for (const placedShipCoord of placedShipCoords) {
          if (newCoord[0] === placedShipCoord[0] && newCoord[1] === placedShipCoord[1]) {
            throw new Error('Cannot place ship here: overlaps with another ship');
          }
        }
      }
    }
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
          if (x === shipX + i && y === shipY) { // Check if the attack coordinates match any cell of the ship
            ship.hit(); // Update ship's state
            return true; // Return true for any successful hit
          }
        }
      }else { // If the ship is placed horizontally
        for (let i = 0; i < ship.length; i++) {
          if (x === shipX && y === shipY + i) {
            ship.hit(); // Update ship's state
            return true; // Return true for any successful hit
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

export function calculateShipCoords(ship, startCoordinates, vertical) {
  const shipCoords = [];
  const startRow = startCoordinates[0];
  const startCol = startCoordinates[1];
  const shiplength = ship.length;

  if(!vertical) { // Horizontal: incrementa la columna manteniendo la misma fila
    for (let i = 0; i < shiplength; i++) {
      shipCoords.push([startRow, startCol + i]);
    }  
  }else { // Vertical: incrementa la fila manteniendo la misma columna
    for (let i = 0; i < shiplength; i++) {
      shipCoords.push([startRow + i, startCol]);
    }
  }
  return shipCoords;
}