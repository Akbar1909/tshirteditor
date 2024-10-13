import React, { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";
import { RiRectangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineCircle } from "react-icons/md";
import { useTShirtEditor } from "./Context";
import { TShirtAvailableShapeType } from "./TshirtEditor.types";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const ShapeMethodToolbar = () => {
  const { onRemoveMethod, onAddShape, setActiveShapeName } = useTShirtEditor();

  const shapes: { name: TShirtAvailableShapeType; icon: ReactNode }[] = [
    {
      name: "rect",
      icon: <RiRectangleLine size="sm" />,
    },
    {
      name: "circle",
      icon: <MdOutlineCircle size="sm" />,
    },
    {
      name: "button-text",
      icon: null,
    },
  ];

  return (
    <section>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add Shape</h3>
        <button onClick={onRemoveMethod}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>
      <div className="mt-8 grid grid-cols-2">
        {shapes.map(({ name, icon }, i) => {
          return (
            <div role="button" onClick={() => onAddShape(name)} key={i}>
              {name}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShapeMethodToolbar;
