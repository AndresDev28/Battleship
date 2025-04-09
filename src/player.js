import { Gameboard, calculateShipCoords } from "../src/gameboard.js";

export class Player {
  constructor(type, gameboard = null) {
    this.gameboard = gameboard || new Gameboard(); // Use provided gameboard or create a new one
    this.type = type; // Human or computer
    this.hitsMade = 0;
    this.missesMade = 0;
  }

  // Método estático para obtener la longitud del barco según su tipo
  static getShipLength(shipType) {
    switch (shipType) {
      case "carrier":
        return 5;
      case "battleship":
        return 4;
      case "destroyer":
        return 3;
      case "submarine":
        return 3;
      case "patrolBoat":
        return 2;
      default:
        throw new Error(`Invalid ship type: ${shipType}`);
    }
  }

  // Methods
  attack(gameboard, coordinates) {
    gameboard.receiveAttack(coordinates);
  }

  getRandomCoordsForBoard(gameboard, shipLength) {
    let attempts = 0;
    const maxAttempts = 50; // Número de intentos

    while (attempts < maxAttempts) {
      const startRow = Math.floor(Math.random() * 10);
      const startCol = Math.floor(Math.random() * 10);
      const isVertical = Math.random() < 0.5;

      const placementCoords = calculateShipCoords(
        { length: shipLength },
        [startRow, startCol],
        isVertical,
      );

      // Verificar si está dentro del tablero
      const isOutOfBounds = placementCoords.some(
        (coord) => coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9,
      );

      if (!isOutOfBounds) {
        // Si hay gameboard, verificar que no haya sido intentado antes
        if (gameboard && gameboard.attemptedPlacements) {
          const hasBeenAttempted = gameboard.attemptedPlacements.some(
            (attempt) => attempt[0] === startRow && attempt[1] === startCol,
          );

          if (!hasBeenAttempted) {
            console.log(
              `Coordenadas válidas encontradas en el intento ${attempts + 1}: [${startRow}, ${startCol}] ${isVertical ? "vertical" : "horizontal"}`,
            );
            return { coords: [startRow, startCol], isVertical };
          }
        } else {
          // Si no hay gameboard o no hay attemptedPlacements, solo validamos que esté dentro del tablero
          console.log(
            `Coordenadas válidas encontradas en el intento ${attempts + 1}: [${startRow}, ${startCol}] ${isVertical ? "vertical" : "horizontal"}`,
          );
          return { coords: [startRow, startCol], isVertical };
        }
      }

      attempts++;
      console.log(
        `Intento ${attempts}/${maxAttempts} fallido, coordenadas: [${startRow}, ${startCol}] ${isVertical ? "vertical" : "horizontal"}`,
      );
    }

    throw new Error(
      `No se encontraron coordenadas válidas después de ${maxAttempts} intentos`,
    );
  }

  generateRandomAttack(opponentGameboard) {
    // Para atacar a Jugador humano
    let attempts = 0;
    const maxAttempts = 100;
    const attackedCoords = new Set(); // Para no repetir intentos en la misma llamada

    while (attempts < maxAttempts) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const coordKey = `${x},${y}`; // Clace única para el getShipLength

      if (attackedCoords.has(coordKey)) {
        continue; // Ya hemos intentado esta coordenada en este turno, probamos otra
      }
      attackedCoords.add(coordKey); // MArcamos como intentada en este turno

      // Comprobamos el estado del tablero oponente
      const cellState = opponentGameboard.getCellState([x, y]);

      // Es válidad si está 'empty' o es 'ship'(aún sin impactar)
      if (cellState === "empty" || cellState === "ship") {
        console.log(`Computer AI chose valid attack: [${x}, ${y}]`);
        return [x, y]; // Devuleve las coordenadas válidas
      }

      attempts++;
    }

    // si no encontramos celdas válidas después de muchos intentos devolvemos un mensaje de Error
    throw new Error(
      "Computer AI failed to find a valid coordinate to attack after many attempts.",
    );
  }
}