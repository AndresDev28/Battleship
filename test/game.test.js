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
    test('nextTurn() switches turns betweens players', () => {
      // Assert initial turn (Player 1)
      expect(gameInstance.currentPlayer).toBe(gameInstance.player1); // Verify initial currentPlayer is Player 1

      // Act & Assert - Turn 1: Switch to Player 2
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
      const receiveAttackSpy = jest.spyOn(opponentGameboard, 'receiveAttack');
      // Define attack coordinates for player1
      const attackCoords = [5, 5];

      gameInstance.player1.attack(opponentGameboard, attackCoords);
      // Assert (Verification):
      // 1. Verify that the receiveAttack() method of the opponent's gameboard was called.
      expect(receiveAttackSpy).toHaveBeenCalled();
      // 2. Verify that receiveAttack() was called with the correct attack coordinates.
      expect(receiveAttackSpy).toHaveBeenCalledWith(attackCoords);
    });
  })
})