import { Player } from "../src/player.js";
import { Gameboard } from "../src/gameboard.js";

describe('Player', () => {
  let humanPlayer, aiPlayer, opponentGameboard;

  beforeEach(() => {
    humanPlayer = new Player("human");
    aiPlayer = new Player("ai");
    opponentGameboard = new Gameboard();
  });
  
  describe('create player', () => {
    test('creates human player correctly', () => {
      const player = new Player("human");
      expect(player.type).toBe("human");
      expect(player.gameboard).toBeInstanceOf(Gameboard);
    });
  
    test('creates ai player correctly', () => {
      const player = new Player("ai");
      expect(player.type).toBe("ai");
      expect(player.gameboard).toBeInstanceOf(Gameboard);
    });
  });

  describe('attack player', () => {
    test('attack() calls receiveAttack() on opponent gameboard', () => {
      const player = new Player('human');
      const opponentGameboard = new Gameboard();
      // Create a Jest mock function for receiveAttack()
      const receiveAttackMock = jest.spyOn(opponentGameboard, 'receiveAttack'); 
      // Call the attack method
      player.attack(opponentGameboard, [0, 0]); 
      // Check if the mock function was called with the correct arguments
      expect(receiveAttackMock).toHaveBeenCalledWith([0, 0]);
    });

    test('attack() attacks different coordinates', () => {
      const opponentGameboard = new Gameboard();
      const receiveAttackMock = jest.spyOn(opponentGameboard, 'receiveAttack');
      new Player('human').attack(opponentGameboard, [7, 5]);
      new Player('human').attack(opponentGameboard, [4, 2]);
      new Player('human').attack(opponentGameboard, [9, 9]);
      expect(receiveAttackMock).toHaveBeenCalledWith([7, 5]);
      expect(receiveAttackMock).toHaveBeenCalledWith([4, 2]);
      expect(receiveAttackMock).toHaveBeenCalledWith([9, 9]);
    });

    test('attack() throws an error for out-of-bounds coordinates', () => {
      const player = new Player('human');
      const opponentGameboard = new Gameboard();
      // Use a Jest matcher to check for the error
      expect(() => player.attack(opponentGameboard, [10, 0])).toThrow('Invalid coordinates');
      expect(() => player.attack(opponentGameboard, [0, 10])).toThrow('Invalid coordinates');
      expect(() => player.attack(opponentGameboard, [-1, 0])).toThrow('Invalid coordinates');
      expect(() => player.attack(opponentGameboard, [0, -1])).toThrow('Invalid coordinates');
    });    

    test('attack() throws an error when attacks the same coordinates twice', () => {
      const opponentGameboard = new Gameboard();
      new Player('human').attack(opponentGameboard, [7, 5]);
      // Check if calling attack() with the same coordinates again throws an error
      expect(() => new Player('human').attack(opponentGameboard, [7, 5])).toThrow(Error);
    });

    test('attack() should call receiveAttack on the opponent gameboard', () => {
      const player = new Player('human');
      const opponentGameboard = new Gameboard();
      const coordinates = [0, 0];

      player.attack(opponentGameboard, coordinates);
      expect(opponentGameboard.missedAttacks).toContainEqual(coordinates);
    });
  });

  describe('getRandomCoordsForBoard', () => {
    test('getRandomCoordsForBoard() generate coordinates inside of boundaries of the gameboard', () => {
      const player = new Player('ai');
      const opponentGameboard = new Gameboard();
      const result = player.getRandomCoordsForBoard(opponentGameboard, 5);
      
      // Verificar que el resultado tiene el formato correcto
      expect(result).toHaveProperty('coords');
      expect(result).toHaveProperty('isVertical');
      
      // Verificar que las coordenadas están dentro de los límites
      const [x, y] = result.coords;
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(9);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(9);
      
      // Verificar que isVertical es un booleano
      expect(typeof result.isVertical).toBe('boolean');
    });

    test('getRandomCoordsForBoard() do not generate coordinates that have already been attacked', () => {
      const player = new Player('ai');
      const opponentGameboard = new Gameboard();
      
      // Simular algunos ataques previos
      opponentGameboard.receiveAttack([0, 0]);
      opponentGameboard.receiveAttack([5, 5]);
      opponentGameboard.receiveAttack([5, 8]);
      
      // Generar coordenadas aleatorias
      const result = player.getRandomCoordsForBoard(opponentGameboard, 5);
      const [x, y] = result.coords;
      
      // Verificar que las coordenadas generadas no están en missedAttacks
      expect(opponentGameboard.missedAttacks).not.toContainEqual([x, y]);
    });

    test('getRandomCoordsForBoard() generates different coordinates each time it is called', () => {
      const player = new Player('ai');
      const opponentGameboard = new Gameboard();
      const results = new Set();

      // Generar múltiples coordenadas y verificar que son diferentes
      for (let i = 0; i < 10; i++) {
        const result = player.getRandomCoordsForBoard(opponentGameboard, 5);
        const coordString = JSON.stringify(result.coords); // Convertir coordenadas a string para comparar
        results.add(coordString);
      }

      // Debería haber más de una coordenada única generada
      expect(results.size).toBeGreaterThan(1);
    });
  });

})