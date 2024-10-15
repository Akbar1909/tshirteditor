import { Textbox, util } from "fabric";
class CurvedTextbox extends Textbox {
  constructor(text, options = {}) {
    options = {
      left: options.left || 0,
      top: options.top || 0,
      diameter: options.diameter || 250, // Diameter for the curve
      fill: options.fill || "#000",
      fontSize: options.fontSize || 24,
      fontFamily: options.fontFamily || "Times New Roman",
      ...options,
    };

    super(text, options);

    this.diameter = options.diameter; // Set diameter for curved text
    this.set("lockUniScaling", true);
    this.set("originX", "center");
    this.set("originY", "center");
  }

  _render(ctx) {
    const canvas = this.getCircularText();
    ctx.drawImage(
      canvas,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    this.setCoords(); // Update object coordinates
  }

  getCircularText() {
    const { text, diameter, fill, fontSize } = this;
    const canvas = util.createCanvasElement();
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = diameter;
    canvas.height = diameter;

    ctx.font = this._getFontDeclaration();
    ctx.fillStyle = fill;

    // Calculate radius and text properties
    const radius = diameter / 2;
    const textHeight = fontSize; // Approximate height based on font size
    const totalAngle = (Math.PI * text.length) / (diameter / 2); // Total angle for all characters

    // Move to the center of the canvas
    ctx.translate(radius, radius);

    // Draw each character along the curve
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const angle = (totalAngle / text.length) * i - totalAngle / 2; // Adjusted angle for centering

      // Calculate position for each character
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle) + textHeight / 2; // Adjust y for centering

      // Set the rotation for the character
      ctx.save(); // Save the current state
      ctx.translate(x, y); // Move to the character position
      ctx.rotate(angle + Math.PI / 2); // Rotate to align the character

      ctx.fillText(char, 0, 0); // Draw character at the new origin
      ctx.restore(); // Restore the state
    }

    return canvas;
  }

  _getFontDeclaration() {
    return [
      this.fontWeight || "normal",
      `${this.fontSize}px`,
      this.fontFamily || "Arial",
    ].join(" ");
  }
}

export default CurvedTextbox;
