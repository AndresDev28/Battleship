import { Player } from "../src/player.js";
import { Gameboard } from "../src/gameboard.js";
export function setupGame() {
  // Create Gameboard instances for both players
  const gameboard1 = new Gameboard();
  const gameboard2 = new Gameboard();

  // Create Player instances, associating each player whit their Gameboard
  const player1 = new Player("human", gameboard1);
  const player2 = new Player("ai", gameboard2);

  // (Opcional por ahora) - Colocar barcos en los tableros (puedes añadir lógica de colocación aquí más adelante)
    // ... (Lógica para colocar barcos - aleatoria o predefinida - la añadiremos después) ...

  // Return the created game objects (so the test can access them and make assertions)

  return {player1, player2, gameboard1, gameboard2};
}