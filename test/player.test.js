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
  });

  describe('generateRandomCoords', () => {
    test('generateRandomCoords() generate coordinates inside of boundaries of the gameboard', () => {
      const player = new Player('ai');
      const opponentGameboard = new Gameboard;
      const [x, y] = player.generateRandomCoords(opponentGameboard);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(9);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(9);
    });

    test('generateRandomCoords() do not generate coordinates that have already been attacked', () => {
      const player = new Player('ai');
      const opponentGameboard = new Gameboard;
      // Simulate some attacks on the gameboard
      opponentGameboard.receiveAttack([2, 3]);
      opponentGameboard.receiveAttack([5, 8]);
      // Generate random coordinates
      const [x, y] = player.generateRandomCoords(opponentGameboard);
      // Check if the generated coordinates are not in the missedAttacks array
      expect(opponentGameboard.missedAttacks).not.toContainEqual([x, y]);
    });

    test('generateRandomCoords() generates different coordinates each time it is called', () => {
      const player = new Player('ai');
      const opponentGameboard = new Gameboard();
      
      // Generate multiple sets of coordinates
      const coordinates = [];
      for (let i = 0; i < 10; i++) {
        const coords = player.generateRandomCoords(opponentGameboard);
        coordinates.push(coords);
        
        // Simulate an attack with these coordinates to avoid getting them again
        // (since the method avoids already attacked coordinates)
        opponentGameboard.receiveAttack(coords);
      }
      
      // Check that all coordinates are unique
      // We'll compare each pair of coordinates
      for (let i = 0; i < coordinates.length; i++) {
        for (let j = i + 1; j < coordinates.length; j++) {
          const [x1, y1] = coordinates[i];
          const [x2, y2] = coordinates[j];
          
          // Expect that at least one of the coordinates is different
          expect(x1 === x2 && y1 === y2).toBe(false);
        }
      }
    });
  });

})