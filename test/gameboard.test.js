import { Gameboard, calculateShipCoords } from '../src/gameboard.js';
import { Ship } from "../src/ship.js";

describe('gameboard', () => {
  let gameboard;
  let ship;

  beforeEach(() => {
    gameboard = new Gameboard(); 
    ship = new Ship(3);
  });

  describe('placeShip', () => {
    test('placeShip() places ship correctly in horizontal position', () => {
      const ship = new Ship(3); // Create a ship with length of 3 to testing
      gameboard.placeShip(ship, [0, 0], false); // Check if the ship is placed correctly in horizontal position
  
      // Asertions
      // 1. Check if ships.length increments in one
      expect(gameboard.ships).toHaveLength(1);
  
      // 2. Check if the last elemento of this.ships is correct 
      const lastShipPlacement = gameboard.ships[0]; // last and unique element of this.ships
  
      expect(lastShipPlacement).toBeDefined(); // Make sure it exists
      expect(lastShipPlacement.ship).toBe(ship); // Verify that the 'ship' property is the same 'ship' object we placed
      expect(lastShipPlacement.coordinates).toEqual([0, 0]); // Verify that the coordinates are [0, 0]
      expect(lastShipPlacement.isVertical).toBe(false); // Verify that vertical position is false (horizontal)
  
      const shipCoords = calculateShipCoords(ship, [0, 0], false);
  
      for (const coord of shipCoords) {
        const [row, col] = coord;
        expect(gameboard.grid[row][col]).toBe(ship); // Verify that the cell contains the 'ship' object.
      }
  
      // Verify that the cells around the ship (and the rest of the board) remain empty (null).
      expect(gameboard.grid[0][3]).toBe(null);
      expect(gameboard.grid[1][0]).toBe(null);
    });

    test('placeShip() places ship correctly in vertical position', () => {
      const shipHor = new Ship(3); // To check more than one ship in this.ships
      gameboard.placeShip(shipHor, [0, 0], false);
      const shipVert = new Ship(2);
      gameboard.placeShip(shipVert, [2, 1], true);
  
      // Asertions
      // 1. Check if ships.length increments in one
      expect(gameboard.ships).toHaveLength(2); // Horizontal ship plus this one (vertical)
  
      // 2. Check if the last element of this.ships is correct 
      const shipVertPlacement = gameboard.ships[1];
  
      expect(shipVertPlacement).toBeDefined();
      expect(shipVertPlacement.ship).toBe(shipVert);
      expect(shipVertPlacement.coordinates).toEqual([2, 1]);
      expect(shipVertPlacement.isVertical).toBe(true);
  
      const shipCoords = calculateShipCoords(shipVert, [2, 1], true);
  
      for (const coord of shipCoords) {
        const [row, col] = coord;
        expect(gameboard.grid[row][col]).toBe(shipVert);
      }
  
      // Verify that the cells around the ship (and the rest of the board) remain empty (null).
      expect(gameboard.grid[3][0]).toBe(null);
      expect(gameboard.grid[4][1]).toBe(null);
      expect(gameboard.grid[3][2]).toBe(null);
      expect(gameboard.grid[2][2]).toBe(null);
    });

    test('placeShip() throws error if ship placement is out of bounds (horizontal)', () => {
      expect(() => {
        gameboard.placeShip(ship, [8, 8], false); 
      }).toThrow(Error);
    });
  
    test('placeShip() throws error if ship placement is out of bounds (vertical)', () => {
      expect(()=> {
        gameboard.placeShip(ship, [8, 0], true); // Vertical
      }).toThrow(Error);
    });
  
    test('placeShip() throws error if ship placement overlaps with another ship (horizontal-horizontal', () => {
      const ship1 = new Ship(3);
      gameboard.placeShip(ship1, [2, 2], false);
  
      const ship2 = new Ship(2);
      expect(() => {
        gameboard.placeShip(ship2, [2, 3], false);
      }).toThrow(Error);
    });
  
    test('placeShip() throws error if ship placement overlaps with another ship (vertical-vertical)', () => {
      const ship1 = new Ship(4);
      gameboard.placeShip(ship1, [3, 3], true);
  
      const ship2 = new Ship(3);
      expect(() => {
        gameboard.placeShip(ship2, [2, 3], true);
      }).toThrow(Error);
    });
  
    test('placeShip() throws error if ship placement overlaps with another ship (vertical-horizontal)', () => {
      const shipVert = new Ship(3);
      gameboard.placeShip(shipVert, [7, 3], true);
  
      const shipHor = new Ship(3);
      expect(() => {
        gameboard.placeShip(shipHor, [8, 2], false);
      }).toThrow(Error);
    });
  
    test('placeShip() throws error if ship placement overlaps with another ship (horizontal-vertical)', () => {
      const shipHor = new Ship(3);
      gameboard.placeShip(shipHor, [7, 3], false);
  
      const shipVert = new Ship(3);
      expect(() => {
        gameboard.placeShip(shipVert, [6, 4], true);
      }).toThrow(Error);
    });
  });

  describe('receiveAttack()', () => {
    test('receiveAttack() hits a ship', () => {
      const ship = new Ship(3);
      gameboard.placeShip(ship, [1, 3], false);
      const isHit = gameboard.receiveAttack([1, 3]); // Verify is the ship was hit
      
      expect(isHit).toBe(true);
      expect(ship.hits).toEqual(1);
    });
  
    test('receiveAttack() record a miss', () => {
      const isHit = gameboard.receiveAttack([0, 0]);

      expect(isHit).toBe(false); // Verify that the attack missed
      expect(gameboard.missedAttacks).toContainEqual([0, 0]);
    });

    test('receiveAttack() sink a ship', () => {
      const ship = new Ship(2);
      gameboard.placeShip(ship, [3, 3], false); 
      gameboard.receiveAttack([3, 3]); // First hit, shoul not sink ship
      const isSunkAfterFirstHit = ship.isSunk();
      const isHitAndSunk = gameboard.receiveAttack([3, 4]);
      expect(isHitAndSunk).toBe(true);
      expect(isSunkAfterFirstHit).toBe(false);
    });

    test('receiveAttack() throws error on repeated attack to the same cell', () => {
      gameboard.receiveAttack([4, 4]);
      expect(() => {
        gameboard.receiveAttack([4, 4]).toThrow(Error);
      });
    });

    test('receiveAttack() throws error when attacks is out of bounds', () => {
      gameboard.receiveAttack[-1, 0];
      expect(() => {
        gameboard.receiveAttack([-1, 0]).toThrow(Error);
      });
      gameboard.receiveAttack[0, -1];
      expect(() => {
        gameboard.receiveAttack([0, -1]).toThrow(Error);
      });
      gameboard.receiveAttack[10, 9];
      expect(() => {
        gameboard.receiveAttack([10, 9]).toThrow(Error);
      });
      gameboard.receiveAttack[9, 10];
      expect(() => {
        gameboard.receiveAttack([9, 10]).toThrow(Error);
      });
    });

  });

  describe('areAllShipsSunk()', () => {
    test('areAllShipsSunk() returns false when not all ships are sunk', () => {
      const ship1 = new Ship(3);
      const ship2 = new Ship(2);
      gameboard.placeShip(ship1, [0, 0], false);
      gameboard.placeShip(ship2, [2, 3], true);
      expect(gameboard.areAllShipsSunk()).toBe(false);
    });
  
    test('areAllShipsSunk() returns true when all ships are sunk', () => {
      const ship1 = new Ship(3);
      const ship2 = new Ship(2);
      gameboard.placeShip(ship1, [0, 0], false);
      gameboard.placeShip(ship2, [2, 3], true);
      ship1.hit(); ship1.hit(); ship1.hit(); // Sink ship1
      ship2.hit(); ship2.hit(); // Sink ship2
      expect(gameboard.areAllShipsSunk()).toBe(true);
    });
  });

})