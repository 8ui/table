import { create } from "./documentUtils";
import imageUploadIcon from "./img/image-upload.svg?raw";
import imageDeleteIcon from "./img/image-delete.svg?raw";
import "./styles/image-upload.scss";

const IMAGE_UPLOAD_URL = "/upload_image";

export const CSS = {
  imageUploadButton: "tc-table__image_upload_button",
  imageUploadButtonVisible: "tc-table__image_upload_button_visible",
  image: "tc-table__image",
  wrapper: "tc-table__wrapper_image",
  buttonDelete: "tc-table__wrapper_image_button",
};

export class ImageUpload {
  constructor(table) {
    this.buttonText = "Добавить изображение";
    this.table = table;
    this.visible = false;
    this.cell = null;
    this.Button = null;
  }

  /**
   * @private
   * @returns {HTMLElement} - the create col/row
   */
  createElem = (wrapper) => {
    if (!wrapper.querySelector(`.${CSS.imageUploadButton}`)) {
      const fileInput = create("input", [], { type: "file" });
      const button = create("span");
      button.innerHTML = imageUploadIcon;

      this.Button = create(
        "label",
        [CSS.imageUploadButton],
        { title: this.buttonText },
        [fileInput, button]
      );
      fileInput.addEventListener("change", this.onChange);

      wrapper.appendChild(this.Button);
      return this.Button;
    }
  };

  onToggle = (visible) => {
    this.visible = visible;
    if (visible) {
      this.Button.classList.add(CSS.imageUploadButtonVisible);
      if (visible && this.table._selectedCell) {
        this.cell = this.table._selectedCell;
        this.Button.style.top = `${
          this.cell.offsetTop + this.cell.offsetHeight
        }px`;
        this.Button.style.left = `${this.cell.offsetLeft}px`;
      }
    } else {
      setTimeout(() => {
        if (!this.table._selectedCell) {
          this.Button.classList.remove(CSS.imageUploadButtonVisible);
        }
      }, 200);
    }
  };

  createImage = (cell, src) => {
    const [elem] = cell.children[0].children;
    const image = create("img", [CSS.image], { src });
    if (this.table.readOnly) {
      elem.replaceWith(image);
    } else {
      const X = create("div");
      X.innerHTML = imageDeleteIcon;
      const button = create("div", [CSS.buttonDelete], null, [X]);
      const wrapper = create("div", [CSS.wrapper], null, [image, button]);

      button.addEventListener("click", this.removeImage);
      elem.replaceWith(wrapper);
    }
  };

  removeImage = (event) => {
    const wrapper = event.target.closest(`.${CSS.wrapper}`);
    wrapper.replaceWith(this.table._createContentEditableArea());
  };

  onChange = async (e) => {
    this.image = e.target.files[0];
    const { url } = await this.onUploadImage();
    if (url) {
      this.createImage(this.cell, url);
    }
  };

  onUploadImage = async () => {
    const fd = new FormData();
    fd.append("upfile", this.image);

    const r = await fetch(IMAGE_UPLOAD_URL, {
      method: "POST",
      body: fd,
    }).then((r) => r.json());

    return r;
  };
}
