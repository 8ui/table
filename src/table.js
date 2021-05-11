import { create, getCoords, getSideByCoords } from './documentUtils';
import { Resize } from "./resize";
import { SelectLine, CSS as CSSSelectLine } from "./selectLine";
import './styles/table.scss';

export const CSS = {
  table: 'tc-table',
  inputField: 'tc-table__inp',
  cell: 'tc-table__cell',
  container: 'tc-table__container',
  wrapper: 'tc-table__wrap',
  area: 'tc-table__area',
  addColumn: 'tc-table__add_column',
  addRow: 'tc-table__add_row',
  addColumnButton: 'tc-table__add_column_button',
  addRowButton: 'tc-table__add_row_button',
};

/**
 * Generates and manages _table contents.
 */
export class Table {
  /**
   * Creates
   *
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor(readOnly) {
    this.readOnly = readOnly;
    this._numberOfColumns = 0;
    this._numberOfRows = 0;
    this._element = this._createTableWrapper();
    this._table = this._element.querySelector('table');
    this.totalColumns = 0;
    this.totalRows = 0;
    this.resize = new Resize(this._table);
    this.selectLine = new SelectLine(this);

    if (!this.readOnly) {
      this._hangEvents();
    }
  }
  
  refresh = () => {
    this.totalColumns = this._table.rows[0].children.length
    this.totalRows = this._table.rows.length
    this.reCalcCoords();
    this.addButtons();
    this.columnSizeReCalc();
  }
  
  reCalcCoords() {
    const cols = this._table.querySelectorAll(`.${CSS.addColumn}`)
    for (let i = 0; i < cols.length; i += 1) {
      cols[i].setAttribute('data-x', String(i));
    }
    const rows = this._table.querySelectorAll(`.${CSS.addRow}`)
    for (let i = 0; i < rows.length; i += 1) {
      rows[i].setAttribute('data-y', String(i));
    }
  }
  
  columnSizeReCalc() {
    const cols = this._table.rows[0].children;
    for (let i = 0; i < cols.length; i += 1) {
      cols[i].style.width = `${100 / cols.length}%`;
    }
  }
  
  fillButtons = (cell, x, y) => {
    // column
    if (y === 0) {
      this.createAddButton(cell, [ CSS.addColumn ], { x, y });
      if (x !== 0) {
        this.resize.createElem(cell);
      }
    }
  
    // select line button
    if (x === 0 || y === 0) {
      this.selectLine.createElem(cell, Number(x === 0));
      if (x === 0 && y === 0) {
        this.selectLine.createElem(cell);
      }
    }
  
    // row
    if (x === 0) {
      this.createAddButton(cell, [ CSS.addRow ], { x, y });
    }
  
    const endColumn = this.totalColumns === x + 1 && y === 0;
    if (endColumn) {
      this.createAddButton(cell, [CSS.addColumn, `${CSS.addColumn}_end`], { x: x + 1, y });
    }
    const endRow = this.totalRows === y + 1 && x === 0;
    if (endRow) {
      this.createAddButton(cell, [CSS.addRow, `${CSS.addRow}_end`], { x, y: y + 1 });
    }
  }
  
  addButtons = () => {
    for (let i = 0; i < this._table.rows.length; i += 1) {
      const row = this._table.rows[i];
  
      for (let r = 0; r < row.children.length; r += 1) {
        const cell = row.children[r];
        this.fillButtons(cell, r, i)
      }
    }
  }
  
  removeButtons = (direction = 0) => {
    const arr = [
      [CSS.addColumn, CSSSelectLine.selectLineCol],
      [CSS.addRow, CSSSelectLine.selectLineRow]
    ]
    arr[direction].forEach((className) => {
      const elem1 = this._table.querySelectorAll(`.${className}`)
      for (let i = 0; i < elem1.length; i += 1) {
        elem1[i].remove();
      }
    })
  }

  /**
   * Add column in table on index place
   *
   * @param {number} index - number in the array of columns, where new column to insert,-1 if insert at the end
   */
  addColumn(index = -1, totalColumns) {
    this._numberOfColumns++;
    this.totalColumns = totalColumns;
    /** Add cell in each row */
    const rows = this._table.rows;
  
    if (index === 0) {
      this.removeButtons(1);
    }

    for (let i = 0; i < rows.length; i++) {
      const cell = rows[i].insertCell(index);
      this._fillCell(cell);
    }
    this.columnSizeReCalc();
    this.addButtons()
    this.reCalcCoords();
  };

  /**
   * Add row in table on index place
   *
   * @param {number} index - number in the array of columns, where new column to insert,-1 if insert at the end
   * @returns {HTMLElement} row
   */
  addRow(index = -1, totalRows) {
    this.totalRows = totalRows;
    this._numberOfRows++;
    const row = this._table.insertRow(index);

    if (index === 0) {
      this.removeButtons(0);
    }
    
    this._fillRow(row, index);
    this.addButtons()
    this.reCalcCoords();
    return row;
  };

  /**
   * get html element of table
   *
   * @returns {HTMLElement}
   */
  get htmlElement() {
    return this._element;
  }

  /**
   * get real table tag
   *
   * @returns {HTMLElement}
   */
  get body() {
    return this._table;
  }

  /**
   * returns selected/editable cell
   *
   * @returns {HTMLElement}
   */
  get selectedCell() {
    return this._selectedCell;
  }

  /**
   * @private
   * @returns {HTMLElement} tbody - where rows will be
   */
  _createTableWrapper() {
    return create('div', [ CSS.container ], null, [
      create('div', [ CSS.wrapper ], null, [ create('table', [ CSS.table ]) ]),
      create('div', [ CSS.addRowButton ]),
      create('div', [ CSS.addColumnButton ]),
    ]);
  }

  /**
   * @private
   * @returns {HTMLElement} - the area
   */
  _createContentEditableArea() {
    return create('div', [ CSS.inputField ], { contenteditable: !this.readOnly });
  }

  /**
   * @private
   * @returns {HTMLElement} - the create col/row
   */
  createAddButton(cell, classNames, coords) {
    if (!cell.querySelector(`.${classNames.join('.')}`)) {
      const plusButton = create('div');
      const line = create('div', classNames, { 'data-x': coords.x, 'data-y': coords.y }, [
        plusButton,
        create('div')
      ]);
  
      plusButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const e = new CustomEvent('click', {'bubbles': true});
    
        line.dispatchEvent(e);
      });
  
      cell.appendChild(line);
    }
  }

  /**
   * @private
   * @param {HTMLElement} cell - empty cell
   */
  _fillCell(cell) {
    cell.classList.add(CSS.cell);
    const content = this._createContentEditableArea();

    cell.appendChild(create('div', [ CSS.area ], null, [ content ]));
  }

  /**
   * @private
   * @param row = the empty row
   */
  _fillRow(row) {
    for (let i = 0; i < this._numberOfColumns; i++) {
      const cell = row.insertCell();

      this._fillCell(cell);
    }
  }

  /**
   * @private
   */
  _hangEvents() {
    this._table.addEventListener('focus', (event) => {
      this._focusEditField(event);
    }, true);

    this._table.addEventListener('blur', (event) => {
      this._blurEditField(event);
    }, true);

    this._table.addEventListener('keydown', (event) => {
      this._pressedEnterInEditField(event);
    });

    this._table.addEventListener('click', (event) => {
      this._clickedOnCell(event);
    });

    this._table.addEventListener('mouseover', (event) => {
      this._mouseEnterInDetectArea(event);
      event.stopPropagation();
    }, true);
  }

  /**
   * @private
   * @param {FocusEvent} event
   */
  _focusEditField(event) {
    if (!event.target.classList.contains(CSS.inputField)) {
      return;
    }
    this._selectedCell = event.target.closest('.' + CSS.cell);
  }

  /**
   * @private
   * @param {FocusEvent} event
   */
  _blurEditField(event) {
    if (!event.target.classList.contains(CSS.inputField)) {
      return;
    }
    this._selectedCell = null;
  }

  /**
   * @private
   * @param {KeyboardEvent} event
   */
  _pressedEnterInEditField(event) {
    if (!event.target.classList.contains(CSS.inputField)) {
      return;
    }
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    }
  }

  /**
   * @private
   * @param {MouseEvent} event
   */
  _clickedOnCell(event) {
    if (!event.target.classList.contains(CSS.cell)) {
      return;
    }
    const content = event.target.querySelector('.' + CSS.inputField);

    content.focus();
  }

  /**
   * @private
   * @param {MouseEvent} event
   */
  _mouseEnterInDetectArea(event) {
    if (!event.target.classList.contains(CSS.area)) {
      return;
    }

    const coordsCell = getCoords(event.target.closest('TD'));
    const side = getSideByCoords(coordsCell, event.pageX, event.pageY);

    event.target.dispatchEvent(new CustomEvent('mouseInActivatingArea', {
      detail: {
        side: side
      },
      bubbles: true
    }));
  }
}
