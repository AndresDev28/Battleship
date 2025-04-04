import { renderGameboard, updateCellVisual } from '../src/dom.js';
import { Gameboard, calculateShipCoords } from '../src/gameboard.js';
import { Game } from "../src/game.js";
import { Ship } from '../src/ship.js';
import { Player } from '../src/player.js';

const playerBoard = document.getElementById('playerBoard');
const computerBoard = document.getElementById('computerBoard');
const newGameButton = document.getElementById('newGameButton');
const fleetButton = document.getElementById('fleetButton');
const fleetSelection = document.getElementById('fleetSelection');
const shipOptions = document.querySelectorAll('.ship-option');
const shipPlacementModal = document.getElementById('shipPlacementModal');
const closeModalBtn = document.getElementById('closeModalButton');
const modalShipNameSpan = document.getElementById('modalShipName');
const placeShipModalBtn = document.getElementById('placeShipButtonModal');
let currentShipType = null; // Variable global para guardar el barco que se está colocando desde el modal (inicialmente null)
const coordErrorSpan = document.getElementById('coordinateError');
let shipPlacedCount = 0;
const gameStatusDisplay = document.getElementById('gameStatusContainer');
const gameInfo = document.getElementById('gameInfo');



const gameInstance = new Game();
window.gameInstance = gameInstance;
gameInstance.startGame();
const computerPlayer = gameInstance.player2;
const humanPlayer = gameInstance.player1;
export const gameboardComputer = gameInstance.gameboardPlayer2;

function validateCoordinateInput(coordinate) {
  if (!coordinate) {
    return {isValid: false, errorMessage: "Coordinate connot be empty"};
  }

  const parts = coordinate.split(',').map(part => part.trim()); // Dividir por coma y quitar espacion en blanco

  if (parts.length !== 2) {
    return { isValid: false, errorMessage: "Invalid format. Please use format 'x,y' (e.g. 5,5)" };
  }

  const yStr = parts[0];
  const xStr = parts[1];

  const y = parseInt(yStr); // convertir la parte y a número
  const x = parseInt(xStr); // convertir la parte x a número

  // Verificar si x & y son números

  if (isNaN(x) || isNaN(y)) {
    return { isValid: false, errorMessage: "Invalid coordinates. X and Y must be numbers"};
  }

  if (x < 0 || x > 9 || y < 0 || y > 9) {
    return {isValid: false, errorMessage: "Coordinates out of range. X and Y must be between 0 and 9"};
  }

  return {isValid: true, errorMessage: ""}; // Coordenadas válidas
}

function parseCoordinateInput(coordinate) {
  const parts = coordinate.split(',').map(part => part.trim()); // Dividir por coma y quitar espacios
  const yStr = parts[0];
  const xStr = parts[1];
  const x = parseInt(xStr); // Convertir X a número
  const y = parseInt(yStr); // Convertir Y a número

  return [y, x]; // ¡DEVOLVER [fila, columna] = [Y, X]!  (En arrays 2D, el primer índice es la fila, el segundo es la columna)
}

// Event listener to the "New Game" button
newGameButton.addEventListener('click', () => {
  console.log("Mostrando tablero de jugador...");
  playerBoard.classList.remove('hidden');
  fleetButton.classList.remove('hidden');
  newGameButton.classList.add('hidden');
});
// Event listener to the "Choose your Fleet" button
fleetButton.addEventListener('click', () => {
  console.log("Mostrando flota de jugador a colocar...")
  fleetButton.classList.add('hidden');
  fleetSelection.classList.remove('hidden');
});

shipOptions.forEach(shipOption => {
  shipOption.addEventListener('click', (e) => {
    const shipType = shipOption.dataset.shipType;
    modalShipNameSpan.textContent = shipType.charAt(0).toUpperCase() + shipType.slice(1);
    coordErrorSpan.classList.add('hidden'); // Ocultar mensaje de error al abrir el modal
    document.getElementById('coordinateInput').value = ''; // Limpiar el input
    shipPlacementModal.classList.remove('hidden');
    currentShipType = shipType;
  });
});

export function getModalShipValue() {
  const coordinateInput = document.getElementById('coordinateInput');
  const orientationVertical = document.getElementById('orientationVertical').checked;
  const validationResult = validateCoordinateInput(coordinateInput.value);

  if (validationResult.isValid) {
    coordErrorSpan.classList.add('hidden');
    const coords = parseCoordinateInput(coordinateInput.value);
    console.log('Parsed coordinates: ', coords);
    
    const shipLength = Player.getShipLength(currentShipType);
    const shipToPlace = new Ship(shipLength);
    console.log('Orientation (vertical):', orientationVertical);

    try {
      const placementResult = gameInstance.gameboardPlayer1.placeShip(shipToPlace, coords, orientationVertical);

      if (placementResult) {
        console.log(`${currentShipType} placed successfully!`, gameInstance.gameboardPlayer1.ships);
        const placedShipCoords = calculateShipCoords(shipToPlace, coords, orientationVertical);
        const shipPlacedToRemove = document.getElementById(`ship-option-${currentShipType}`);
        shipPlacedToRemove.remove();

        placedShipCoords.forEach(coord => {
          const [row, col] = coord;
          const cellElement = gameInstance.gameboardPlayer1.cellElements[row][col];
          updateCellVisual(cellElement, 'ship');
        });

        // Ocultar el modal y limpiar el input después de una colocación exitosa y quitar el barco colocado de la lista
        shipPlacedCount++;
        shipPlacementModal.classList.add('hidden');
        coordinateInput.value = '';
        coordErrorSpan.classList.add('hidden');
        startGameAfterFleetPlaced();
      }
    } catch (error) {
      console.error('Ship placement error:', error.message);
      coordErrorSpan.textContent = error.message;
      coordErrorSpan.classList.remove('hidden');
    }
  } else {
    coordErrorSpan.textContent = validationResult.errorMessage;
    coordErrorSpan.classList.remove('hidden');
  }
}

// Close ship placement modal
closeModalBtn.addEventListener('click', () => {
  shipPlacementModal.classList.add('hidden');
  coordErrorSpan.classList.add('hidden'); // Ocultar mensaje de error al cerrar el modal
  document.getElementById('coordinateInput').value = ''; // Limpiar el input
});

// Obtener los valores del barco a colocar
placeShipModalBtn.addEventListener('click', () => {
  getModalShipValue();
});

// Añadir listener para ocultar mensaje de error cuando el input cambie
document.getElementById('coordinateInput').addEventListener('input', () => {
  const validationResult = validateCoordinateInput(document.getElementById('coordinateInput').value);
  if (validationResult.isValid) {
    coordErrorSpan.classList.add('hidden');
  }
});

function startGameAfterFleetPlaced() {
  if (shipPlacedCount === 5) {
    console.log("Player start to attack!");
    fleetButton.classList.add('hidden')
    const fleetSelection = document.getElementById('fleetSelection');
    fleetSelection.remove();
    gameStatusDisplay.classList.remove('hidden');
    gameStatusDisplay.textContent = "Your Turn to Attack!";
    gameInfo.style.display = 'block';
    computerBoard.classList.remove('hidden');
    computerPlaceShips(gameboardComputer);
  }
}

function computerPlaceShips(gameboardComputer) {
  const shipTypesToPlace = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrolBoat'];
  const computerPlayer = gameInstance.player2;

  shipTypesToPlace.forEach(shipType => {
    let shipPlaced = false;
    while(!shipPlaced) {
      try {
        const shipLength = Player.getShipLength(shipType);
        const placement = computerPlayer.getRandomCoordsForBoard(gameboardComputer, shipLength);
        const ship = new Ship(shipLength);
        
        console.log(`Intentando colocar ${shipType} en [${placement.coords[0]}, ${placement.coords[1]}] ${placement.isVertical ? 'vertical' : 'horizontal'}`);
        
        const placementResult = gameboardComputer.placeShip(ship, placement.coords, placement.isVertical);

        if (placementResult === true) {
          shipPlaced = true;
          console.log(`Computer placed ${shipType} at [${placement.coords[0]}, ${placement.coords[1]}] ${placement.isVertical ? 'vertically' : 'horizontally'}`);
        }
      } catch (error) {
        console.error(`Computer AI placement failed for ${shipType}:`, error.message);
      }
    }
  });

  console.log(`Computer placed fleet successfully!`);
}

function handlePlayerAttack(row, col) {
  console.log(`handlePlayerAttack: Attacking [${row}, ${col}] on computerBoard`);
  const numericRow = parseInt(row);
  const numericCol = parseInt(col);

  // 1. Comprobar si es turno del jugador
  // 2. Llamar a computerPlayer.gameboard.receiveAttack([row, col]);
  // 3. Comprobar si el ataque fue válido (no repetido)
  const attackResult = gameboardComputer.receiveAttack([numericRow, numericCol]); // Vemos que devuelve reciceAttack (true/false)
  console.log('Attack result: ', attackResult);
  console.log(`handlePlayerAttack: Calling renderGameboard for computerBoard UPDATE`);
  // 4. Actualizar la UI (renderBoard de nuevo para el ordenador)
  renderGameboard(gameboardComputer, computerBoard, handlePlayerAttack) // Llamamos a handleAttack dentro de ella misma para que siga siendo clicable
  
    
    // 5. Mostrar mensaje de hit/miss/sunk (en tu nuevo game-info)
    // 6. Comprobar si el juego terminó
    // 7. Si no, cambiar turno e iniciar el ataque del ordenador
}

renderGameboard(gameInstance.gameboardPlayer1, playerBoard);
renderGameboard(gameboardComputer, computerBoard, handlePlayerAttack);