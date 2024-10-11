import React, { ComponentPropsWithoutRef } from "react";

const CANVAS_ID = "t-shirt_editor";

interface CanvasProps extends ComponentPropsWithoutRef<"canvas"> {}

const Canvas = (props: CanvasProps) => {
  return <canvas id={CANVAS_ID} {...props} />;
};

export default Canvas;
