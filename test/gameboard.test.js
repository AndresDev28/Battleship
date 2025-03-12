import { Gameboard } from '../src/gameboard.js';
import { Ship } from "../src/ship.js";

describe('gameboard', () => {
  let gameboard;
  let ship;

  beforeEach(() => {
    gameboard = new Gameboard(); 
    ship = new Ship(3);
  });

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
  });

  test('placeShip() places ship correctly in vertical position', () => {
    const shipHor = new Ship(3); // To check more than one ship in this.ships
    gameboard.placeShip(shipHor, [0, 0], false);
    const shipVert = new Ship(2);
    gameboard.placeShip(shipVert, [2, 1], true);

    // Asertions
    // 1. Check if ships.length increments in one
    expect(gameboard.ships).toHaveLength(2); // Horizontal ship plus this one (vertical)

    // 2. Check if the last elemento of this.ships is correct 
    const shipVertPlacement = gameboard.ships[1];

    expect(shipVertPlacement).toBeDefined();
    expect(shipVertPlacement.ship).toBe(shipVert);
    expect(shipVertPlacement.coordinates).toEqual([2, 1]);
    expect(shipVertPlacement.isVertical).toBe(true);
  });

  test('receiveAttack() hits a ship', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, [1, 3], false);
    gameboard.receiveAttack([1, 3]); // Verify is the ship was hit
  });

  test('receiveAttack() record a miss', () => {
    gameboard.receiveAttack([0, 0]); // Checks if the missed attack was recorded
  });

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

})