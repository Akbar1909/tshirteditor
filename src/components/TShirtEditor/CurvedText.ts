import { FabricObject, cac } from "fabric";

class CurvedText extends FabricObject {
  static type = "curved-text";

  static cacheProperties = fabric.Object.prototype.cacheProperties.concat(
    "diameter",
    "kerning",
    "flipped",
    "fill",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "strokeStyle",
    "strokeWidth"
  );

  constructor(text = "", options = {}) {
    super(options);
    this.text = text;
    this.diameter = options.diameter || 250;
    this.kerning = options.kerning || 0;
    this.flipped = options.flipped || false;
    this.fill = options.fill || "#000";
    this.fontFamily = options.fontFamily || "Times New Roman";
    this.fontSize = options.fontSize || 24;
    this.fontWeight = options.fontWeight || "normal";
    this.fontStyle = options.fontStyle || "";
    this.strokeStyle = options.strokeStyle || null;
    this.strokeWidth = options.strokeWidth || 0;

    this.set("lockUniScaling", true);

    // Draw curved text initially to get width and height.
    const canvas = this.getCircularText();
    this._trimCanvas(canvas);
    this.set("width", canvas.width);
    this.set("height", canvas.height);
  }

  _getFontDeclaration() {
    return [
      this.fontStyle,
      this.fontWeight,
      `${this.fontSize}px`,
      this.fontFamily,
    ].join(" ");
  }

  _trimCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    const pix = { x: [], y: [] };

    const imageData = ctx.getImageData(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (imageData.data[(y * w + x) * 4 + 3] > 0) {
          pix.x.push(x);
          pix.y.push(y);
        }
      }
    }

    pix.x.sort((a, b) => a - b);
    pix.y.sort((a, b) => a - b);

    const newWidth = pix.x[pix.x.length - 1] - pix.x[0];
    const newHeight = pix.y[pix.y.length - 1] - pix.y[0];
    const cut = ctx.getImageData(pix.x[0], pix.y[0], newWidth, newHeight);

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.putImageData(cut, 0, 0);
  }

  getCircularText() {
    let text = this.text;
    const diameter = this.diameter;
    const flipped = this.flipped;
    const kerning = this.kerning;
    const fill = this.fill;
    const inwardFacing = !flipped;
    let startAngle = flipped ? 180 : 0;
    const canvas = fabric.util.createCanvasElement();
    const ctx = canvas.getContext("2d");
    let clockwise = flipped ? 1 : -1;

    startAngle *= Math.PI / 180;

    const d = document.createElement("div");
    d.style.fontFamily = this.fontFamily;
    d.style.whiteSpace = "nowrap";
    d.style.fontSize = `${this.fontSize}px`;
    d.style.fontWeight = this.fontWeight;
    d.style.fontStyle = this.fontStyle;
    d.textContent = text;
    document.body.appendChild(d);
    const textHeight = d.offsetHeight;
    document.body.removeChild(d);

    canvas.width = canvas.height = diameter;
    ctx.font = this._getFontDeclaration();

    if (inwardFacing) {
      text = text.split("").reverse().join("");
    }

    ctx.translate(diameter / 2, diameter / 2);
    startAngle += Math.PI * !inwardFacing;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
      const cw = ctx.measureText(text[i]).width;
      totalWidth += cw + (i < text.length - 1 ? kerning : 0);
    }

    startAngle -= (totalWidth / 2 / (diameter / 2 - textHeight)) * clockwise;

    for (let i = 0; i < text.length; i++) {
      const cw = ctx.measureText(text[i]).width;
      ctx.rotate((cw / 2 / (diameter / 2 - textHeight)) * clockwise);

      if (this.strokeStyle && this.strokeWidth) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeText(
          text[i],
          0,
          (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2)
        );
      }

      ctx.fillStyle = fill;
      ctx.fillText(
        text[i],
        0,
        (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2)
      );

      ctx.rotate(
        ((cw / 2 + kerning) / (diameter / 2 - textHeight)) * clockwise
      );
    }

    return canvas;
  }

  _set(key, value) {
    if (key === "scaleX") {
      this.fontSize *= value;
      this.diameter *= value;
      this.width *= value;
      this.scaleX = 1;
    } else if (key === "scaleY") {
      this.height *= value;
      this.scaleY = 1;
    } else {
      super._set(key, value);
    }
  }

  _render(ctx) {
    const canvas = this.getCircularText();
    this._trimCanvas(canvas);

    this.set("width", canvas.width);
    this.set("height", canvas.height);

    ctx.drawImage(
      canvas,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    this.setCoords();
  }

  toObject(propertiesToInclude = []) {
    return {
      ...super.toObject(propertiesToInclude),
      text: this.text,
      diameter: this.diameter,
      kerning: this.kerning,
      flipped: this.flipped,
      fill: this.fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      strokeStyle: this.strokeStyle,
      strokeWidth: this.strokeWidth,
    };
  }
}

export default CurvedText;
