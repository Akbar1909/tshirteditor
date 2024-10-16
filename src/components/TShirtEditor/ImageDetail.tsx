import React from "react";
import { IoMdClose } from "react-icons/io";
import { useTShirtEditor } from "./Context";

const ImageDetail = () => {
  const { setActiveProperty } = useTShirtEditor();
  return (
    <section>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Image</h3>
        <button onClick={() => setActiveProperty("idle")}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>
    </section>
  );
};

export default ImageDetail;
