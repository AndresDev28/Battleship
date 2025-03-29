import { Gameboard, calculateShipCoords } from '../src/gameboard.js';

export class Player {
  constructor(type, gameboard = null) {
    this.gameboard = gameboard || new Gameboard(); // Use provided gameboard or create a new one
    this.type = type; // Human or computer
  }

  // Método estático para obtener la longitud del barco según su tipo
  static getShipLength(shipType) {
    switch (shipType) {
      case 'carrier': return 5;
      case 'battleship': return 4;
      case 'destroyer': return 3;
      case 'submarine': return 3;
      case 'patrolBoat': return 2;
      default: throw new Error(`Invalid ship type: ${shipType}`);
    }
  }

  // Methods
  attack(gameboard, coordinates) {
    gameboard.receiveAttack(coordinates);
  }

  getRandomCoordsForBoard(gameboard, shipLength) {
    let attempts = 0;
    const maxAttempts = 50; // Aumentamos el número de intentos

    while (attempts < maxAttempts) {
      const startRow = Math.floor(Math.random() * 10);
      const startCol = Math.floor(Math.random() * 10);
      const isVertical = Math.random() < 0.5;

      const placementCoords = calculateShipCoords({ length: shipLength }, [startRow, startCol], isVertical);
      
      // Verificar si está dentro del tablero
      const isOutOfBounds = placementCoords.some(coord => 
        coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9
      );

      if (!isOutOfBounds) {
        // Si hay gameboard, verificar que no haya sido intentado antes
        if (gameboard && gameboard.attemptedPlacements) {
          const hasBeenAttempted = gameboard.attemptedPlacements.some(attempt =>
            attempt[0] === startRow && attempt[1] === startCol
          );

          if (!hasBeenAttempted) {
            console.log(`Coordenadas válidas encontradas en el intento ${attempts + 1}: [${startRow}, ${startCol}] ${isVertical ? 'vertical' : 'horizontal'}`);
            return { coords: [startRow, startCol], isVertical };
          }
        } else {
          // Si no hay gameboard o no hay attemptedPlacements, solo validamos que esté dentro del tablero
          console.log(`Coordenadas válidas encontradas en el intento ${attempts + 1}: [${startRow}, ${startCol}] ${isVertical ? 'vertical' : 'horizontal'}`);
          return { coords: [startRow, startCol], isVertical };
        }
      }

      attempts++;
      console.log(`Intento ${attempts}/${maxAttempts} fallido, coordenadas: [${startRow}, ${startCol}] ${isVertical ? 'vertical' : 'horizontal'}`);
    }

    throw new Error(`No se encontraron coordenadas válidas después de ${maxAttempts} intentos`);
  }
}

// Check if the coordinates have already been attacked
// if (!gameboard.missedAttacks.some(attack => attack[0] === x && attack[1] === y)) {
//   return [x, y]; // Return the valid coordinates
// }