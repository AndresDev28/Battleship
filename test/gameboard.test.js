
import { Gameboard } from '../src/gameboard.js';
import { Ship } from "../src/ship.js";

describe('gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard(); 
  });

  test('placeShip() places ship correctly in horizontal position', () => {
    const ship = new Ship(3); // Create a ship with length of 3 to testing
    gameboard.placeShip(ship, [0, 0], false); // Check if the ship is placed correctly in horizontal position
  });

  test('placeShip() places ship correctly in vertical position', () => {
    const ship = new Ship(2);
    gameboard.placeShip(ship, [2, 1], true);
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
})