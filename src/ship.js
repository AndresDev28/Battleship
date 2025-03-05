
export class Ship {
  constructor(length) {
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

