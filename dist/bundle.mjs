var S = Object.defineProperty;
var R = (o, t, e) => t in o ? S(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var l = (o, t, e) => R(o, typeof t != "symbol" ? t + "" : t, e);
function w(o) {
  return o != null;
}
function r(o, t = null, e = null, i = null) {
  const s = document.createElement(o);
  if (w(t))
    for (let n = 0; n < t.length; n++)
      w(t[n]) && s.classList.add(t[n]);
  if (w(e))
    for (let n in e)
      s.setAttribute(n, e[n]);
  if (w(i))
    for (let n = 0; n < i.length; n++)
      w(i[n]) && s.appendChild(i[n]);
  return s;
}
function A(o) {
  const t = o.getBoundingClientRect();
  return {
    y1: Math.floor(t.top + window.pageYOffset),
    x1: Math.floor(t.left + window.pageXOffset),
    x2: Math.floor(t.right + window.pageXOffset),
    y2: Math.floor(t.bottom + window.pageYOffset)
  };
}
function I(o, t, e) {
  let i;
  return t - o.x1 >= -1 && t - o.x1 <= 11 && (i = "left"), o.x2 - t >= -1 && o.x2 - t <= 11 && (i = "right"), e - o.y1 >= -1 && e - o.y1 <= 11 && (i = "top"), o.y2 - e >= -1 && o.y2 - e <= 11 && (i = "bottom"), i;
}
const L = {
  resizedColumn: "tc-table__resize_column"
};
class x {
  constructor(t) {
    l(this, "getIndex", (t) => {
      const e = this.table.body.querySelectorAll(`.${L.resizedColumn}`);
      for (let i = 0; i < e.length; i += 1)
        if (e[i] === t.target)
          return i;
      return -1;
    });
    l(this, "onDragStart", (t) => {
      const e = this.getIndex(t);
      this.startX = t.pageX, this.active = t.target, this.activeIndex = e, this.width = this.table.body.offsetWidth;
      const [i, s] = this.getWidthCols();
      this.widthFirst = i, this.widthSecond = s, document.body.style.cursor = "col-resize", t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation();
    });
    l(this, "onDrag", (t) => {
      this.active && this.move(t.pageX - this.startX);
    });
    l(this, "onDragEnd", () => {
      this.active = null, document.body.style.cursor = "auto";
    });
    l(this, "move", (t) => {
      const [e, i] = this.getCols();
      let s = (this.widthFirst / this.width + t / this.width) * 100, n = (this.widthSecond / this.width - t / this.width) * 100;
      s >= 5 && n >= 5 && (e.style.width = `${s}%`, i.style.width = `${n}%`);
    });
    l(this, "getCols", () => {
      const t = this.table.colgroup.children, e = t[this.activeIndex], i = t[this.activeIndex + 1];
      return [e, i];
    });
    l(this, "parseWidth", (t) => Number.parseFloat(t.style.width) / 100 * this.width);
    l(this, "getWidthCols", () => {
      const [t, e] = this.getCols();
      return [this.parseWidth(t), this.parseWidth(e)];
    });
    this.table = t, this.init(), this.active = null, this.activeIndex = 0, this.startX = 0, this.x = 0;
  }
  init() {
    document.addEventListener("mousemove", this.onDrag, !1), document.addEventListener("mouseup", this.onDragEnd, !1);
  }
  createElem(t) {
    if (!t.querySelector(`.${L.resizedColumn}`)) {
      const e = r("div", [L.resizedColumn]);
      e.addEventListener("mousedown", this.onDragStart, !1), t.appendChild(e);
    }
  }
}
const u = {
  selectLineCol: "tc-table__select_line_col",
  selectLineRow: "tc-table__select_line_row",
  trRemove: "tc-table__tr_remove",
  tdRemove: "tc-table__td_remove"
};
class V {
  constructor(t) {
    l(this, "getDirection", (t) => t.target.classList.contains(u.selectLineCol) ? 0 : 1);
    l(this, "onMouseEnter", (t) => {
      if (this.getDirection(t) === 0) {
        const e = this.getIndex(t);
        for (let i = 0; i < this.table.body.rows.length; i += 1)
          this.table.body.rows[i].children[e] && this.table.body.rows[i].children[e].classList.add(u.tdRemove);
      } else
        t.target.closest("tr").classList.add(u.trRemove);
    });
    l(this, "onMouseLeave", (t) => {
      t.target && (this.getDirection(t) === 0 ? this.table.body.querySelectorAll(`.${u.tdRemove}`).forEach((i) => {
        i.classList.remove(u.tdRemove);
      }) : t.target.closest("tr").classList.remove(u.trRemove));
    });
    l(this, "getIndex", (t) => {
      const e = this.table.body.querySelectorAll(`.${t.target.className}`);
      for (let i = 0; i < e.length; i += 1)
        if (e[i] === t.target)
          return i;
      return -1;
    });
    l(this, "onClick", (t) => {
      const e = this.getIndex(t);
      this.getDirection(t) === 0 ? this.table.removeColumn(e) : this.table.removeRow(e);
    });
    this.table = t;
  }
  createElem(t, e = 0) {
    const i = e === 0 ? u.selectLineCol : u.selectLineRow;
    if (!t.querySelector(`.${i}`)) {
      const s = r("div", [i]);
      s.addEventListener("click", this.onClick, !1), s.addEventListener("mouseenter", this.onMouseEnter, !1), s.addEventListener("mouseleave", this.onMouseLeave, !1), t.appendChild(s);
    }
  }
}
const y = {
  addColumn: "tc-table__add_column",
  addRow: "tc-table__add_row"
};
class H {
  constructor(t) {
    /**
     * @private
     * @returns {HTMLElement} - the create col/row
     */
    l(this, "createElem", (t, e = 0) => {
      const i = [y.addColumn, y.addRow][e];
      if (!t.querySelector(`.${i}`)) {
        const s = r("div");
        s.addEventListener("click", this.onClick);
        const n = r("div", [i], null, [
          s,
          r("div")
        ]);
        return t.appendChild(n), n;
      }
    });
    l(this, "getDirection", (t) => t.classList.contains(y.addColumn) ? 0 : 1);
    l(this, "getIndex", (t) => {
      const e = this.table.body.querySelectorAll(`.${t.className}`);
      for (let i = 0; i < e.length; i += 1)
        if (e[i] === t)
          return i;
      return -1;
    });
    l(this, "onClick", (t) => {
      const e = t.target.parentNode, i = this.getDirection(e), s = this.getIndex(e);
      i === 0 ? this.table.addColumn(s) : this.table.addRow(s);
    });
    this.table = t;
  }
}
const O = `export default "data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M19%205V19H5V5H19ZM19%203H5C3.9%203%203%203.9%203%205V19C3%2020.1%203.9%2021%205%2021H19C20.1%2021%2021%2020.1%2021%2019V5C21%203.9%2020.1%203%2019%203ZM14.14%2011.86L11.14%2015.73L9%2013.14L6%2017H18L14.14%2011.86Z'%20/%3e%3c/svg%3e"`, z = `export default "data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M19%205V16.17L21%2018.17V5C21%203.9%2020.1%203%2019%203H5.83L7.83%205H19ZM2.81%202.81L1.39%204.22L3%205.83V19C3%2020.1%203.9%2021%205%2021H18.17L19.78%2022.61L21.19%2021.2L2.81%202.81ZM5%2019V7.83L12.07%2014.9L11.25%2016L9%2013L6%2017H14.17L16.17%2019H5Z'/%3e%3c/svg%3e"`, M = "/upload_image", g = {
  imageUploadButton: "tc-table__image_upload_button",
  imageUploadButtonVisible: "tc-table__image_upload_button_visible",
  image: "tc-table__image",
  wrapper: "tc-table__wrapper_image",
  buttonDelete: "tc-table__wrapper_image_button"
};
class D {
  constructor(t) {
    /**
     * @private
     * @returns {HTMLElement} - the create col/row
     */
    l(this, "createElem", (t) => {
      if (!t.querySelector(`.${g.imageUploadButton}`)) {
        const e = r("input", [], { type: "file" }), i = r("span");
        return i.innerHTML = O, this.Button = r(
          "label",
          [g.imageUploadButton],
          { title: this.buttonText },
          [e, i]
        ), e.addEventListener("change", this.onChange), t.appendChild(this.Button), this.Button;
      }
    });
    l(this, "onToggle", (t) => {
      this.visible = t, t ? (this.Button.classList.add(g.imageUploadButtonVisible), t && this.table._selectedCell && (this.cell = this.table._selectedCell, this.Button.style.top = `${this.cell.offsetTop + this.cell.offsetHeight}px`, this.Button.style.left = `${this.cell.offsetLeft}px`)) : setTimeout(() => {
        this.table._selectedCell || this.Button.classList.remove(g.imageUploadButtonVisible);
      }, 200);
    });
    l(this, "createImage", (t, e) => {
      const [i] = t.children[0].children, s = r("img", [g.image], { src: e });
      if (this.table.readOnly)
        i.replaceWith(s);
      else {
        const n = r("div");
        n.innerHTML = z;
        const m = r("div", [g.buttonDelete], null, [n]), d = r("div", [g.wrapper], null, [s, m]);
        m.addEventListener("click", this.removeImage), i.replaceWith(d);
      }
    });
    l(this, "removeImage", (t) => {
      t.target.closest(`.${g.wrapper}`).replaceWith(this.table._createContentEditableArea());
    });
    l(this, "onChange", async (t) => {
      this.image = t.target.files[0];
      const { url: e } = await this.onUploadImage();
      e && this.createImage(this.cell, e);
    });
    l(this, "onUploadImage", async () => {
      const t = new FormData();
      return t.append("upfile", this.image), await fetch(M, {
        method: "POST",
        body: t
      }).then((i) => i.json());
    });
    this.buttonText = "Добавить изображение", this.table = t, this.visible = !1, this.cell = null, this.Button = null;
  }
}
const a = {
  table: "tc-table",
  inputField: "tc-table__inp",
  cell: "tc-table__cell",
  container: "tc-table__container",
  containerReadOnly: "tc-table__container_readonly",
  wrapper: "tc-table__wrap",
  area: "tc-table__area",
  addColumn: "tc-table__add_column",
  addRow: "tc-table__add_row",
  addColumnButton: "tc-table__add_column_button",
  addRowButton: "tc-table__add_row_button"
};
let T = class {
  /**
   * Creates
   *
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor(t) {
    l(this, "fillButtons", (t, e, i) => {
      i === 0 && (this.createLine.createElem(t), e !== 0 && this.resize.createElem(t)), (e === 0 || i === 0) && (this.selectLine.createElem(t, +(e === 0)), e === 0 && i === 0 && this.selectLine.createElem(t)), e === 0 && this.createLine.createElem(t, 1);
    });
    l(this, "updateButtons", () => {
      for (let t = 0; t < this._table.rows.length; t += 1) {
        const e = this._table.rows[t];
        for (let i = 0; i < e.children.length; i += 1) {
          const s = e.children[i];
          this.fillButtons(s, i, t);
        }
      }
    });
    l(this, "removeButtons", (t = 0) => {
      [
        [a.addColumn, u.selectLineCol],
        [a.addRow, u.selectLineRow]
      ][t].forEach((i) => {
        const s = this._table.querySelectorAll(`.${i}`);
        for (let n = 0; n < s.length; n += 1)
          s[n].remove();
      });
    });
    this.readOnly = t, this._numberOfColumns = 0, this._numberOfRows = 0, this.resize = new x(this), this.selectLine = new V(this), this.createLine = new H(this), this.imageUpload = new D(this), this._element = this._createTableWrapper(), this._table = this._element.querySelector("table"), this.colgroup = this._table.querySelector("colgroup"), this.readOnly || this._hangEvents();
  }
  columnSizeReCalc() {
    const t = this.colgroup.children;
    for (let e = 0; e < t.length; e += 1)
      t[e].style.width = `${100 / t.length}%`;
  }
  insertCol(t) {
    this.colgroup.insertBefore(r("col", [], { span: 1 }), this.colgroup.children[t]);
  }
  removeCol(t) {
    this.body.querySelector("colgroup").children[t].remove();
  }
  /**
   * Add column in table on index place
   *
   * @param {number} index - number in the array of columns, where new column to insert,-1 if insert at the end
   */
  addColumn(t = -1) {
    this._numberOfColumns++;
    const e = this._table.rows;
    t === 0 && this.removeButtons(1), this.insertCol(t);
    for (let i = 0; i < e.length; i++) {
      const s = e[i].insertCell(t);
      this._fillCell(s);
    }
    this.readOnly || (this.columnSizeReCalc(), this.updateButtons());
  }
  removeColumn(t) {
    this._numberOfColumns--;
    for (let e = 0; e < this._table.rows.length; e += 1)
      this._table.rows[e].deleteCell(t);
    this.readOnly || (this.removeCol(t), this.columnSizeReCalc(), this.updateButtons());
  }
  /**
   * Add row in table on index place
   *
   * @param {number} index - number in the array of columns, where new column to insert,-1 if insert at the end
   * @returns {HTMLElement} row
   */
  addRow(t = -1) {
    this._numberOfRows++;
    const e = this._table.insertRow(t);
    return t === 0 && this.removeButtons(0), this._fillRow(e, t), this.updateButtons(), e;
  }
  removeRow(t) {
    this._numberOfRows--, this._table.rows[t].remove(), this.updateButtons();
  }
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
  get withBorder() {
  }
  /**
   * @private
   * @returns {HTMLElement} tbody - where rows will be
   */
  _createTableWrapper() {
    const t = this.readOnly ? a.containerReadOnly : a.container, e = r("div", [t], null, [
      r("div", [a.wrapper], null, [
        r("table", [a.table], null, [
          r("colgroup"),
          r("tbody")
        ])
      ])
    ]);
    if (!this.readOnly) {
      const i = r("div", [a.addRowButton]), s = r("div", [a.addColumnButton]);
      i.addEventListener(
        "click",
        () => this.addColumn(this._numberOfColumns),
        !0
      ), s.addEventListener(
        "click",
        () => this.addRow(this._numberOfRows),
        !0
      ), e.appendChild(i), e.appendChild(s);
    }
    return e;
  }
  /**
   * @private
   * @returns {HTMLElement} - the area
   */
  _createContentEditableArea() {
    return r("div", [a.inputField], { contenteditable: !this.readOnly });
  }
  /**
   * @private
   * @param {HTMLElement} cell - empty cell
   */
  _fillCell(t) {
    t.classList.add(a.cell);
    const e = this._createContentEditableArea();
    t.appendChild(r("div", [a.area], null, [e]));
  }
  /**
   * @private
   * @param row = the empty row
   */
  _fillRow(t) {
    for (let e = 0; e < this._numberOfColumns; e++) {
      const i = t.insertCell();
      this._fillCell(i);
    }
  }
  /**
   * @private
   */
  _hangEvents() {
    this._table.addEventListener("focus", (t) => {
      this._focusEditField(t);
    }, !0), this._table.addEventListener("blur", (t) => {
      this._blurEditField(t);
    }, !0), this._table.addEventListener("keydown", (t) => {
      this._pressedEnterInEditField(t);
    }), this._table.addEventListener("click", (t) => {
      this._clickedOnCell(t);
    }), this._table.addEventListener("mouseover", (t) => {
      this._mouseEnterInDetectArea(t), t.stopPropagation();
    }, !0);
  }
  /**
   * @private
   * @param {FocusEvent} event
   */
  _focusEditField(t) {
    t.target.classList.contains(a.inputField) && (this._selectedCell = t.target.closest("." + a.cell), this.imageUpload.onToggle(!0));
  }
  /**
   * @private
   * @param {FocusEvent} event
   */
  _blurEditField(t) {
    t.target.classList.contains(a.inputField) && (this._selectedCell = null, this.imageUpload.onToggle(!1));
  }
  /**
   * @private
   * @param {KeyboardEvent} event
   */
  _pressedEnterInEditField(t) {
    t.target.classList.contains(a.inputField) && t.keyCode === 13 && !t.shiftKey && t.preventDefault();
  }
  /**
   * @private
   * @param {MouseEvent} event
   */
  _clickedOnCell(t) {
    if (t.target.classList.contains(g.buttonDelete) === !1) {
      if (!t.target.classList.contains(a.cell))
        return;
      t.target.querySelector("." + a.inputField).focus();
    }
  }
  /**
   * @private
   * @param {MouseEvent} event
   */
  _mouseEnterInDetectArea(t) {
    if (!t.target.classList.contains(a.area))
      return;
    const e = A(t.target.closest("TD")), i = I(e, t.pageX, t.pageY);
    t.target.dispatchEvent(new CustomEvent("mouseInActivatingArea", {
      detail: {
        side: i
      },
      bubbles: !0
    }));
  }
};
class k {
  /**
   * Creates
   * @param {TableData} data - previously saved data for insert in table
   * @param {object} config - configuration of table
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor(t, e, i, s) {
    this.readOnly = s, this._CSS = {
      editor: "tc-editor",
      inputField: "tc-table__inp",
      withBorder: "tc-table__with_border"
    };
    try {
      this._table = new T(s);
      const n = this._resizeTable(t, e);
      this._fillTable(t, n);
    } catch (n) {
      console.log(n);
    }
    this._container = r("div", [this._CSS.editor, i.styles.block], null, [this._table.htmlElement]), this._table.imageUpload.createElem(this._container), this._hoveredCell = null, this._hoveredCellSide = null, this.readOnly || this._hangEvents();
  }
  /**
   * returns html element of TableConstructor;
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._container;
  }
  /**
   * @private
   *
   *  Fill table data passed to the constructor
   * @param {TableData} data - data for insert in table
   * @param {{rows: number, cols: number}} size - contains number of rows and cols
   */
  _fillTable(t, e) {
    if (t.content !== void 0)
      for (let i = 0; i < e.rows && i < t.content.length; i++)
        for (let s = 0; s < e.cols && s < t.content[i].length; s++) {
          const n = t.content[i][s], m = this._table.body.rows[i].cells[s];
          if (typeof n == "string") {
            const d = m.querySelector("." + this._CSS.inputField);
            d.innerHTML = n;
          } else (n == null ? void 0 : n.type) === "image" && this._table.imageUpload.createImage(m, n.src);
        }
  }
  /**
   * @private
   *
   * resize to match config or transmitted data
   * @param {TableData} data - data for inserting to the table
   * @param {object} config - configuration of table
   * @param {number|string} config.rows - number of rows in configuration
   * @param {number|string} config.cols - number of cols in configuration
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  _resizeTable(t, e) {
    const i = Array.isArray(t.content), s = i ? t.content.length : !1, n = i ? t.content.length : void 0, m = s ? t.content[0].length : void 0, d = Number.parseInt(e.rows), p = Number.parseInt(e.cols), b = !isNaN(d) && d > 0 ? d : void 0, v = !isNaN(p) && p > 0 ? p : void 0, { settings: h } = t, C = 3, c = 2, _ = n || b || C, E = m || v || c;
    for (let f = 0; f < _; f++)
      this._table.addRow(f);
    for (let f = 0; f < E; f++)
      this._table.addColumn(f);
    return h && h.sizes && h.sizes.forEach((f, B) => {
      this._table.colgroup.children[B] && (this._table.colgroup.children[B].style.width = `${f * 100}%`);
    }), this._table.htmlElement.classList.toggle(
      this._CSS.withBorder,
      (h == null ? void 0 : h.withBorder) === void 0 ? !0 : h == null ? void 0 : h.withBorder
    ), {
      rows: _,
      cols: E
    };
  }
  /**
   * @private
   *
   * hang necessary events
   */
  _hangEvents() {
    this._container.addEventListener("keydown", (t) => {
      this._containerKeydown(t);
    });
  }
  /**
   * @private
   *
   * detects button presses when editing a table's content
   * @param {KeyboardEvent} event
   */
  _containerKeydown(t) {
    t.keyCode === 13 && this._containerEnterPressed(t);
  }
  /**
   * @private
   *
   * Check if the addition is initiated by the container and which side
   * @returns {number} - -1 for left or top; 0 for bottom or right; 1 if not container
   */
  _getHoveredSideOfContainer() {
    return this._hoveredCell === this._container ? this._isBottomOrRight() ? 0 : -1 : 1;
  }
  /**
   * @private
   *
   * check if hovered cell side is bottom or right. (lefter in array of cells or rows than hovered cell)
   * @returns {boolean}
   */
  _isBottomOrRight() {
    return this._hoveredCellSide === "bottom" || this._hoveredCellSide === "right";
  }
  /**
   * @private
   *
   * if "cntrl + Eneter" is pressed then create new line under current and focus it
   * @param {KeyboardEvent} event
   */
  _containerEnterPressed(t) {
    if (!(this._table.selectedCell !== null && !t.shiftKey))
      return;
    const e = this._table.selectedCell.closest("TR");
    let i = this._getHoveredSideOfContainer();
    i === 1 && (i = e.sectionRowIndex + 1), this._table.addRow(i).cells[0].click();
  }
}
const $ = `export default "data:image/svg+xml,%3csvg%20width='18'%20height='14'%3e%3cpath%20d='M2.833%208v1.95a1.7%201.7%200%200%200%201.7%201.7h3.45V8h-5.15zm0-2h5.15V2.35h-3.45a1.7%201.7%200%200%200-1.7%201.7V6zm12.3%202h-5.15v3.65h3.45a1.7%201.7%200%200%200%201.7-1.7V8zm0-2V4.05a1.7%201.7%200%200%200-1.7-1.7h-3.45V6h5.15zM4.533.1h8.9a3.95%203.95%200%200%201%203.95%203.95v5.9a3.95%203.95%200%200%201-3.95%203.95h-8.9a3.95%203.95%200%200%201-3.95-3.95v-5.9A3.95%203.95%200%200%201%204.533.1z'/%3e%3c/svg%3e"`, F = `export default "data:image/svg+xml,%3csvg%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M0%202V8V10V16V18H2H8H10H16H18V16V10V8V2V0H16H10H8H2H0V2ZM8%202L2%202V8H8L8%202ZM8%2010H2V16H8L8%2010ZM10%2016V10H16V16H10ZM10%208V2L16%202V8H10Z'/%3e%3c/svg%3e"`;
class U {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {TableData} data — previously saved data
   * @param {object} config - user config for Tool
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data: t, config: e, api: i, readOnly: s }) {
    l(this, "toggleBorder", () => {
      this.borderActive = !this.borderActive, this.toggleBorderButton.classList.toggle(
        this._CSS.settingsButtonActive,
        this.borderActive
      ), this._tableConstructor._table._element.classList.toggle(
        this._tableConstructor._CSS.withBorder,
        this.borderActive
      );
    });
    var n;
    this.api = i, this.readOnly = s, this._tableConstructor = new k(t, e, i, s), this._CSS = {
      input: "tc-table__inp",
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive
    }, this.borderActive = (n = t.settings) == null ? void 0 : n.withBorder;
  }
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Allow to press Enter inside the CodeTool textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return !0;
  }
  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      br: !0,
      mark: !0
    };
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: $,
      title: "Table"
    };
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    return this._tableConstructor.htmlElement;
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLElement} toolsContent - Tool HTML element
   *
   * @returns {TableData} - saved data
   */
  save(t) {
    const e = t.querySelector("table"), i = [], s = e.rows, n = [], m = e.offsetWidth;
    for (let d = 0; d < s.length; d++) {
      const p = s[d], b = Array.from(p.cells), v = b.map(
        (c) => c.querySelector("." + this._CSS.input)
      ), h = b.map(
        (c) => c.querySelector("." + g.image)
      ), C = b.map((c, _) => {
        if (v[_]) return { type: "input", text: v[_].innerHTML };
        if (h[_])
          return { type: "image", src: h[_].getAttribute("src") };
      });
      d === 0 && b.forEach((c) => {
        n.push(c.offsetWidth / m);
      }), i.push(
        C.map((c, _) => {
          if (c)
            switch (c.type) {
              case "input":
                return c.text;
              case "image":
                return c;
            }
          return "";
        })
      );
    }
    return {
      settings: {
        sizes: n,
        withBorder: this.borderActive === void 0 ? !0 : this.borderActive
      },
      content: i
    };
  }
  /**
   * @private
   * @param {HTMLElement} input - input field
   * @returns {boolean}
   */
  _isEmpty(t) {
    return !t.textContent.trim();
  }
  /**
   * Create Block's settings block
   *
   * @returns {HTMLElement}
   */
  renderSettings() {
    const t = document.createElement("DIV"), e = document.createElement("SPAN");
    return e.classList.add(this._CSS.settingsButton), this.borderActive && e.classList.add(this._CSS.settingsButtonActive), e.innerHTML = F, e.dataset.active = this.borderActive, e.addEventListener("click", () => {
      this.toggleBorder();
    }), t.appendChild(e), this.toggleBorderButton = e, t;
  }
}
export {
  U as default
};
//# sourceMappingURL=bundle.mjs.map
