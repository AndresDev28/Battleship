import { getModalShipValue } from '../index.js';
// Crear elemento para mostrar coordenadas (mouseover)
const coordsDisplay = document.createElement('div');
coordsDisplay.classList.add('coords-display');
coordsDisplay.style.position = 'fixed';
coordsDisplay.style.display = 'none';
coordsDisplay.style.zIndex = '1000';
coordsDisplay.style.pointerEvents = 'none';
document.body.appendChild(coordsDisplay);

export function renderGameboard(gameboard, container, clickCellCallback) {
    console.log(`--- Rendering board for: ${container.id} ---`); // <-- NUEVO
    console.log(`Clearing container ${container.id}`); // <-- NUEVO
    container.innerHTML = ''; 
    console.log(`Container ${container.id} cleared`); // <-- NUEVO


  const table = document.createElement('table');
  table.classList.add('gameboard');


  // Array 2D para guardar las referencias a las celdas <td>
  const cellElements = [];

  // *** Crear fila de encabezado de columnas ***
  const headerRow = document.createElement('tr');
  headerRow.classList.add('header-row');
  const emptyHeaderCell = document.createElement('th'); // Celda vacía en la esquina superior izquierda
  headerRow.appendChild(emptyHeaderCell); // Añadir celda vacía
  for (let colIndex = 0; colIndex < gameboard.grid[0].length; colIndex++) { // Iterar sobre las columnas
    const headerCell = document.createElement('th'); // Celda de encabezado (<th>)
    headerCell.textContent = colIndex; // From 0 to 9
    headerRow.appendChild(headerCell); // Añadir celda de encabezado de columna
  }
  table.appendChild(headerRow); // Añadir fila de encabezado a la tabla
  // *** Fila de encabezado de columnas ***


  for (let rowIndex = 0; rowIndex < gameboard.grid.length; rowIndex++) { // Iterar sobre las filas
    const tableRow = document.createElement('tr');

    // *** Crear celda de encabezado de fila (número de fila) ***
    const rowHeaderCell = document.createElement('th'); // Celda de encabezado de fila (<th>)
    rowHeaderCell.classList.add('row-header');
    rowHeaderCell.textContent = rowIndex; // From 0 to 9
    tableRow.appendChild(rowHeaderCell); // Añadir celda de encabezado de fila

    const rowCellElements = []; // Array para guardar las celdas de la fila actual
    // *** Celda de encabezado de fila ***


    for (let colIndex = 0; colIndex < gameboard.grid[rowIndex].length; colIndex++) { // Iterar sobre las columnas
        const tableCell = document.createElement('td');
        tableCell.classList.add('gameboard-cell');
        tableCell.dataset.row = rowIndex; // Guardar el índice de fila como data attribute
        tableCell.dataset.col = colIndex; // Guardar el índice de columna como data attribute

        // Otener estado Real
        const cellState = gameboard.getCellState([rowIndex, colIndex]);

        // Ocultar barcos enemigos no impactados
        let stateToDisplay = cellState;
        if (container.id === 'computerBoard' && cellState === 'ship') {
          stateToDisplay = 'empty';
        }

        // Aplicar estilo visual usando la función helper
        console.log('Estado a mostrar:', stateToDisplay);
        updateCellVisual(tableCell, stateToDisplay);

        // Agregar contenido visual extra
        tableCell.textContent = '';
        if (stateToDisplay === 'hit') {
          tableCell.textContent = '💥';
        } else if (stateToDisplay === 'miss') {
          tableCell.textContent = '⚪';
        }

        // Agregar listeners (hover y clicks condicional)
        if (container.id === 'computerBoard') {
          tableCell.addEventListener('mouseover', (e) => {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;

            //1. Actualizar contenido
            coordsDisplay.textContent = `[${row}, ${col}]`;
            //2. Posicionar
            coordsDisplay.style.left = `${e.clientX + 15}px`;
            coordsDisplay.style.top = `${e.clientY + 15}px`;
            //3. Mostrar
            coordsDisplay.style.display = 'block';
          });

          tableCell.addEventListener('mouseout', (e) => {
            coordsDisplay.style.display = 'none';
          });
        }

        if (cellState === 'empty' || cellState === 'ship') { // Solo atacable si la celda est;a vacía o hay un barco
          tableCell.addEventListener('click', (e) => {
            const row = e.target.dataset.row; 
            const col = e.target.dataset.col;

            if (typeof clickCellCallback === 'function') { // Llamar a callback si existe
              clickCellCallback(row, col); // Pasa las coordenadas
            }
          });
          // Resetear cursor por si antes era 'not-allowed'
          tableCell.style.cursor = 'pointer';
        } else {
          tableCell.style.cursor = 'not-allowed';
        }

        
        tableCell.addEventListener('dragover', (event) => {
          event.preventDefault();
        });

        tableCell.addEventListener('drop', (event) => {
            event.preventDefault();
            console.log('Drop event triggered on cell:', rowIndex, colIndex); // Usar rowIndex y colIndex
        });

        tableRow.appendChild(tableCell);
        rowCellElements.push(tableCell); // Añadir referencia de celda al array de celdas de la fila
    }
    table.appendChild(tableRow);
    cellElements.push(rowCellElements); // Añadir array de celdas de la fila al array principal de celdas
  }
  gameboard.cellElements = cellElements; // Guardamos el array de celdas en el objeto gameboard

  container.appendChild(table);
  console.log(`Appended table to ${container.id}`); // <-- NUEVO
}

export function updateCellVisual(cellElement, cellState) {
  cellElement.classList.remove('ship-cell', 'hit-cell', 'miss-cell'); // Remover clases de estados anteriores

  switch (cellState) {
    case 'ship':
      cellElement.classList.add('ship-cell');
      break;
    case 'hit':
      cellElement.classList.add('hit-cell');
      break;
    case 'miss':
      cellElement.classList.add('miss-cell');
      break;
    case 'empty':
      default:
        break;
  }
}