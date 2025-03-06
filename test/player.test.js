import { Player } from "../src/player.js";
import { Gameboard } from "../src/gameboard.js";

describe('Player', () => {
  let humanPlayer, computerPlayer, opponentGameboard;

  beforeEach(() => {
    humanPlayer = new Player("human");
    computerPlayer = new Player("computer");
    opponentGameboard = new Gameboard();
  });
  describe('create player', () => {
    test('creates human player correctly', () => {
      const player = new Player("human");
      expect(player.type).toBe("human");
      expect(player.gameboard).toBeInstanceOf(Gameboard);
    });
  
    test('creates computer player correctly', () => {
      const player = new Player("computer");
      expect(player.type).toBe("computer");
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
    test('generateRandomcoords() generate coordinates inside of boundaries of the gameboard', () => {
      const player = new Player('computer');
      const opponentGameboard = new Gameboard;
      const [x, y] = player.generateRandomCoords(opponentGameboard);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(9);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(9);
    });
  });

})