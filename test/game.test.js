import { Gameboard } from "../src/gameboard.js";
import { Player } from "../src/player.js";
import { Game } from "../src/game.js";

describe('Game', () => {
  let gameInstance;

  beforeEach (() => {
    gameInstance = new Game();
    gameInstance.startGame();
  });

  describe('Game - Start new game', () => {
    test('Game() initializes the players and gameboards, and sets currentPlayer to player1', () => {
      // Assert (Verification)
      expect(gameInstance.player1).toBeInstanceOf(Player);
      expect(gameInstance.player2).toBeInstanceOf(Player);
      expect(gameInstance.gameboardPlayer1).toBeInstanceOf(Gameboard);
      expect(gameInstance.gameboardPlayer2).toBeInstanceOf(Gameboard);
  
      expect(gameInstance.player1.gameboard).toBe(gameInstance.gameboardPlayer1);
      expect(gameInstance.player2.gameboard).toBe(gameInstance.gameboardPlayer2);
  
    });
  });
  
  describe('Game - Turns flow', () => {
    test('game flow switches turns after player attacks', () => {
      // Assert initial turn (Player 1)
      expect(gameInstance.currentPlayer).toBe(gameInstance.player1); // Verify initial currentPlayer is Player 1

      // Act & Assert - Turn 1: Player 1 attacks, witch to Player 2
      gameInstance.nextTurn();
      expect(gameInstance.currentPlayer).toBe(gameInstance.player2);
      // Act & Assert - Turn 2: Switch back to Player 1
      gameInstance.nextTurn();
      expect(gameInstance.currentPlayer).toBe(gameInstance.player1);
      // Act & Assert - Turn 3: Switch back to Player 2
      gameInstance.nextTurn();
      expect(gameInstance.currentPlayer).toBe(gameInstance.player2);
      // Act & Assert - Turn 4: Switch back to Player 1
      gameInstance.nextTurn();
      expect(gameInstance.currentPlayer).toBe(gameInstance.player1);
    });
  });

  describe('Game - Basic game mechanics', () => {
    test('player1 (human) can attack player2 (ai)', () => {
      // Get the gameboard of Player 2 (AI) from gameInstance
      const opponentGameboard = gameInstance.gameboardPlayer2;
      // Create a Jest mock function for receiveAttack()
      const receiveAttackSpyP2 = jest.spyOn(opponentGameboard, 'receiveAttack');
      // Define attack coordinates for player1
      const attackCoordsP1 = [5, 5];

      gameInstance.player1.attack(opponentGameboard, attackCoordsP1);
      // Assert (Verification):
      // 1. Verify that the receiveAttack() method of the opponent's gameboard was called.
      expect(receiveAttackSpyP2).toHaveBeenCalled();
      // 2. Verify that receiveAttack() was called with the correct attack coordinates.
      expect(receiveAttackSpyP2).toHaveBeenCalledWith(attackCoordsP1);
    });

    test('player2 (ai) can attack player1 (human)', () => {
      const opponentGameboard = gameInstance.gameboardPlayer1;
      const receiveAttackSpyP1 = jest.spyOn(opponentGameboard, 'receiveAttack');
      const attackCoordsP2 = [1, 1];

      gameInstance.player2.attack(opponentGameboard, attackCoordsP2);
      expect(receiveAttackSpyP1).toHaveBeenCalled();
      expect(receiveAttackSpyP1).toHaveBeenCalledWith(attackCoordsP2);
    });
  });

  /** Test to verify later */
  // describe('Game - Turns flow', () => {
    //   test('game flow switches turns after player attacks', () => {
    //     // Arrange (Preparation) - Ya está en beforeEach, no necesitamos repetir aquí
    
    //     // Assert initial turn (Player 1)
    //     expect(gameInstance.currentPlayer).toBe(gameInstance.player1);
    
    //     // Act & Assert - Turn 1: Player 1 attacks, switch to Player 2
    //     const attackCoordsP1 = [0, 0]; // Coordenadas de ataque arbitrarias para Player 1
    //     const receiveAttackSpyP2 = jest.spyOn(gameInstance.gameboardPlayer2, 'receiveAttack'); // Spy para verificar ataque (opcional, pero buena práctica)
    //     gameInstance.player1.attack(gameInstance.player2, attackCoordsP1); // Player 1 ataca a Player 2
    //     expect(receiveAttackSpyP2).toHaveBeenCalledWith(attackCoordsP1); // Verificamos que el ataque se realizó (opcional)
    //     expect(gameInstance.currentPlayer).toBe(gameInstance.player2); // Verificamos cambio de turno a Player 2
    
    //     // Act & Assert - Turn 2: Player 2 attacks, switch back to Player 1
    //     const attackCoordsP2 = [1, 1]; // Coordenadas de ataque arbitrarias para Player 2
    //     const receiveAttackSpyP1 = jest.spyOn(gameInstance.gameboardPlayer1, 'receiveAttack'); // Spy para verificar ataque (opcional, buena práctica)
    //     gameInstance.player2.attack(gameInstance.player1, attackCoordsP2); // Player 2 ataca a Player 1
    //     expect(receiveAttackSpyP1).toHaveBeenCalledWith(attackCoordsP2); // Verificamos que el ataque se realizó (opcional)
    //     expect(gameInstance.currentPlayer).toBe(gameInstance.player1); // Verificamos cambio de turno de vuelta a Player 1
    
    //     // Podemos seguir añadiendo más turnos si quieres probar más ciclos...
    //   });
    // });
})