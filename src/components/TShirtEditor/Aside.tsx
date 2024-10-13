import React, { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { CiText } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { PiTShirtThin } from "react-icons/pi";
import { PiTShirtLight } from "react-icons/pi";

import { TShirtEditorMethodType } from "./TshirtEditor.types";
import { useTShirtEditor } from "./Context";

interface AsideProps extends ComponentPropsWithoutRef<"aside"> {}

const Aside = ({ className, ...computedProps }: AsideProps) => {
  const { onHandleMethod, currentMethod: method } = useTShirtEditor();

  const handleMethod = (method: TShirtEditorMethodType) => {
    onHandleMethod({ name: method });
  };

  return (
    <aside className={twMerge("border-l pt-20", className)} {...computedProps}>
      <div
        role="button"
        onClick={() => handleMethod("about-product")}
        className={twMerge(
          "flex px-2 py-3 group rounded-xl flex-col gap-2 items-center cursor-pointer hover:bg-blue-300  transition-all duration-200",
          method === "about-product" && "bg-blue-400 text-white"
        )}
      >
        <PiTShirtLight
          fontSize={30}
          className="group-hover:text-white font-bold"
          fontFamily="bold"
        />
        <span className="text-xs font-bold group-hover:text-white">
          Product
        </span>
      </div>
      <div
        role="button"
        onClick={() => handleMethod("add-text")}
        className={twMerge(
          "flex px-2 py-3 group rounded-xl flex-col gap-2 items-center cursor-pointer hover:bg-blue-300  transition-all duration-200",
          method === "add-text" && "bg-blue-400 text-white"
        )}
      >
        <CiText
          fontSize={30}
          className="group-hover:text-white font-bold"
          fontFamily="bold"
        />
        <span className="text-xs font-bold group-hover:text-white">
          Add text
        </span>
      </div>
      <div
        role="button"
        onClick={() => handleMethod("image")}
        className={twMerge(
          "flex px-2 py-3 group rounded-xl flex-col gap-2 items-center cursor-pointer hover:bg-blue-300  transition-all duration-200",
          method === "image" && "bg-blue-400 text-white"
        )}
      >
        <CiImageOn
          fontSize={30}
          className="group-hover:text-white font-bold"
          fontFamily="bold"
        />
        <span className="text-xs font-bold group-hover:text-white">Image</span>
      </div>
      {/* <div
        role="button"
        onClick={() => handleMethod("shape")}
        className={twMerge(
          "flex px-2 py-3 group rounded-xl flex-col gap-2 items-center cursor-pointer hover:bg-blue-300  transition-all duration-200",
          method === "shape" && "bg-blue-200 text-white"
        )}
      >
        <IoShapesOutline
          fontSize={30}
          className="group-hover:text-white font-bold"
          fontFamily="bold"
        />
        <span className="text-xs font-bold group-hover:text-white">Shape</span>
      </div> */}
    </aside>
  );
};

export default Aside;
