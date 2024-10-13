import React from "react";
import { useTShirtEditor } from "./Context";
import { IoMdClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

const TextObjectsList = () => {
  const { objects, setActiveProperty, setActiveObject } = useTShirtEditor();

  return (
    <div>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Texts</h3>
        <button onClick={() => setActiveProperty("closed")}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>
      <div className="mt-10">
        {objects.map((obj, i) => (
          <div
            className="border-b py-3 flex items-center justify-between"
            key={i}
          >
            {obj.get("text")}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveObject(obj);
                  setActiveProperty("closed");
                }}
              >
                <FaRegEdit fontSize={16} />
              </button>
              <button>
                <FaRegTrashAlt fontSize={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextObjectsList;
