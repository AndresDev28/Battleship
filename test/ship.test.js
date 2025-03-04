/** Ship Properties: 
 * length: number
 * hits: number
 *  sunk: bool
 * 
 * Methods: 
 * hit()
 * isSunk(): true or false (hit >= length)
  */

// Let's define the Ship's methods tests:

import { Ship } from "../src/ship.js";

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3); // Creates a ship with length 3 for every test
  });

  test('Ship has correct length', () => {
    expect(ship.length).toBe(3);
  });

  test('hit() increments hits', () => {
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test('isSunk() returns false when is not sunk', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('isSunk() returns true when sunk', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

});