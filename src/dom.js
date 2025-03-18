export function renderGameboard(gameboard, container) {
  // 1. Create table element
  const table = document.createElement('table');
  table.classList.add('gameboard');

  // 2. Iterate over the rows of the gameboard.grid
  for (let row = 0; row < gameboard.grid.length; row ++) {
    const tableRow = document.createElement('tr'); // Create a row (<tr>) for each row in the grid.
    
    // 3. Iterate over the columns for each row in the gameboard.grid
    for (let col = 0; col < gameboard.grid[row].length; col ++) {
      const tableCell = document.createElement('td'); // Create a cell for each cell in the grid
      tableCell.classList.add('gameboard-cell');
      tableRow.appendChild(tableCell);
    }

    table.appendChild(tableRow);
  }

  container.appendChild(table);
  console.log('Hola mundo');
}