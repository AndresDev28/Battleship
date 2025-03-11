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

  test('Ship starts with 0 hits', () => {
    expect(ship.hits).toBe(0);
  });

  test('Ship has correct length - length 3', () => {
    expect(ship.length).toBe(3);
  });

  test('Ship has correct length - length 1', () => {
    const shipLength1 = new Ship(1);
    expect(shipLength1.length).toBe(1);
  })

  test('Ship has correct length - length 5', () => {
    const shipLength5 = new Ship(5);
    expect(shipLength5.length).toBe(5);
  })

  test('hit() increments hits', () => {
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test('isSunk() returns false when is not sunk', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('isSunk() returns true when ship is sunk (hits = lenght)', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('isSunk() remains true after hits exceed ship length', () => {
    ship.hit();
    ship.hit();
    ship.hit(); // ship is sunk here and hit count = 3
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
    expect(ship.hits).toBe(5);
  });

  test('Ship constructor throws an error for length 0', () => {
    expect(() => {
      new Ship(0);
    }).toThrow(Error);
  });

  test('Ship constructor throws an error for length -1', () => {
    expect(() => {
      new Ship(-1);
    }).toThrow(Error);
  });

});