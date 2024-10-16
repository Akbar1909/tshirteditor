import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import TextMethodToolbar from "./TextMethodToolbar";
import AboutProduct from "./AboutProduct";
import ImageMethodToolbar from "./ImageMethodToolbar";
import ShapeMethodToolbar from "./ShapeMethodToolbar";
import { useTShirtEditor } from "./Context";
import RectShapeToolbar from "./RectShapeToolbar";
import FontList from "./FontList";
import TextObjectsList from "./TextObjectsList";
import ImageObjectsList from "./ImageObjectList";
import ImageDetail from "./ImageDetail";

interface ActiveToolPropertiesProps extends ComponentPropsWithoutRef<"div"> {}
const ActiveToolProperties = ({
  className,
  ...computedProps
}: ActiveToolPropertiesProps) => {
  const {
    activeShapeName,
    activeProperty,
    currentMethod: method,
  } = useTShirtEditor();

  const wrap = (children: ReactNode) => (
    <div
      className={twMerge(
        "bg-white overflow-auto  shadow-xl border-r py-3 px-6",
        className
      )}
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
        case "text-object-list":
          return wrap(<TextObjectsList />);
      }
      return wrap(<TextMethodToolbar />);
    case "image-object-list":
      switch (activeProperty) {
        case "image-detail":
          return wrap(<ImageDetail />);
      }
      return wrap(<ImageObjectsList />);
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
