export class Gameboard {
  constructor() {
    this.ships = []; // Ship's coordinates in the gameboard
    //this.successfulHits = [];
    //this.missedAttacks = [];
    this.grid = Array(10).fill(null).map(() => Array(10).fill(null));
    this.attemptedPlacements = [];
  }

  // Methods
  placeShip(ship, coordinates, isVertical) {
    const shipCoords = calculateShipCoords(ship, coordinates, isVertical);
    
    // Validar antes de hacer cualquier modificación al tablero
    this.validateShipPlacement(shipCoords);
    this.validateNoOverlap(shipCoords);

    // Colocación en la grid (Si las validaciones pasan, colocar el barco en la grid)
    for (const coords of shipCoords) {
      const [row, col] = coords;
      // Guarda el objeto con el barco y su estado de 'hit''
      this.grid[row][col] = {ship: ship, hit: false};
    }

    // Registrar la colocación del barco para otras lógicas (allShipsSunk)
    const shipPlacement = {
      ship,
      coordinates, // Coordenada inicial para referencia
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
    // 1. Validación de límites
    if (x < 0 || x > 9 || y < 0 || y > 9) { // Check if coordinates are within valid boundaries (assuming a 10x10 grid)
      throw new Error('Invalid coordinates');
    }

    // 2.  Obtener estado de la celda desde la grid
    const cell = this.grid[x][y];

    // 3. Comprobar si ya fué atacada (miss o hit)
    if (cell === 'miss'|| cell && cell.hit === true) {
      // Ataque repetido
      throw new Error ('Cannot attack the same coordinate twice');
    }

    // 4. Procesar HIT (si hay barco y no esta 'hit')
    if (cell && cell.ship) { // cell existe y tiene una propiedad 'ship'
      // Sabemos que cell.hit es false por el chequeo anterior
      cell.hit = true;
      cell.ship.hit(); // LLamamos el método hit del objeto ship
      console.log("Ship hit!");

      // Comprobar y loguear si se hundió (añadir después si quieres)
      if (cell.ship.isSunk()) {
        console.log("Ship sunk!"); 
      }
      return true;
    }

    // 5. Procesar MISS (si la celda está vacía - null)
    // Si llegamos hasta aqui siginifica que la celda era 'null'y no fue hit ni miss anteriormente
    this.grid[x][y] = 'miss';
    console.log("Attackmissed!");
    
    return false;
  }
  areAllShipsSunk() {
    return this.ships.every(shipPlacement => shipPlacement.ship.isSunk());
  }

  getCellState(coordinates) {
    const [x, y] = coordinates;
    // Validar coordenadas
    if (x < 0 || x > 9 || y < 0 || y > 9) {
      console.error("Invalid coordinates for getCellState");
      return 'invalid'; // o null, o lanzar error
    }
    
    const cell = this.grid[x][y];

    if (cell === 'miss') {
      return 'miss';
    } else if (cell && cell.hit === true) { // El barco ha sido atacado
      return 'hit';
    } else if (cell && cell.ship) { // Hay un barco pero no ha sido atacado
      return 'ship';
    } else {
      return 'empty';
    }
  }

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