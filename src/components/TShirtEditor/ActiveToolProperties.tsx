import { useSearchParams } from "next/navigation";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { TShirtEditorMethodType } from "./TshirtEditor.types";
import TextMethodToolbar from "./TextMethodToolbar";
import AboutProduct from "./AboutProduct";
import ImageMethodToolbar from "./ImageMethodToolbar";

interface ActiveToolPropertiesProps extends ComponentPropsWithoutRef<"div"> {}
const ActiveToolProperties = ({
  className,
  ...computedProps
}: ActiveToolPropertiesProps) => {
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
      return wrap(<TextMethodToolbar />);
    case "image":
      return wrap(<ImageMethodToolbar />);
    default:
      return wrap(<AboutProduct />);
  }
};

export default ActiveToolProperties;
