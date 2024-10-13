import { useSearchParams } from "next/navigation";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { TShirtEditorMethodType } from "./TshirtEditor.types";
import TextMethodToolbar from "./TextMethodToolbar";
import AboutProduct from "./AboutProduct";
import ImageMethodToolbar from "./ImageMethodToolbar";
import ShapeMethodToolbar from "./ShapeMethodToolbar";
import { useTShirtEditor } from "./Context";
import RectShapeToolbar from "./RectShapeToolbar";
import FontList from "./FontList";

interface ActiveToolPropertiesProps extends ComponentPropsWithoutRef<"div"> {}
const ActiveToolProperties = ({
  className,
  ...computedProps
}: ActiveToolPropertiesProps) => {
  const { activeShapeName, activeProperty } = useTShirtEditor();
  const searchParams = useSearchParams();
  const method = (searchParams.get("method") ||
    "about-product") as TShirtEditorMethodType;

  const wrap = (children: ReactNode) => (
    <div
      className={twMerge("bg-white shadow-xl border-r py-3 px-3", className)}
      {...computedProps}
    >
      {children}
    </div>
  );

  switch (method) {
    case "add-text":
      switch (activeProperty) {
        case "font-list":
          return wrap(<FontList />);
      }
      return wrap(<TextMethodToolbar />);
    case "image":
      return wrap(<ImageMethodToolbar />);
    case "shape":
      switch (activeShapeName) {
        case "rect":
          return wrap(<RectShapeToolbar />);
      }
      return wrap(<ShapeMethodToolbar />);
    default:
      return wrap(<AboutProduct />);
  }
};

export default ActiveToolProperties;
