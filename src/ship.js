
export class Ship {
  constructor(length) {
    if (length <= 0) {
      throw new Error(`Ship's length must be grather than 0`);
    }
    this.length = length;
    this.hits = 0;
    this.sunk = false;

  }

  // Methods
  hit() {
    this.hits++;
    if (this.hits >= this.length) {
      return true;
    }
  }

  isSunk() {
    // if (this.hits >= this.length) {
    //   return true;
    // }else {
    //   return false;
    // }
    
    // Shortess version
    return this.hits >= this.length;
  }
}