export type ToolType = "text" | "line" | "rect";

export type TShirtEditorMethodType = "add-text" | "image" | "about-product";

export type SelectedTextObjectType = {
  text: string;
  textAlign: string;
  textBackgroundColor: string;
  fill: string;
  fontWeight: number;
  fontSize: number;
  linethrough: boolean;
  underline: boolean;
  overline: boolean;
  stroke: string;
  charSpacing: number;
  fontFamily: string;
};
