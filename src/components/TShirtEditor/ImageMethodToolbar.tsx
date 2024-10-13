import React, { ChangeEvent } from "react";
import { IoMdClose } from "react-icons/io";
import { useTShirtEditor } from "./Context";

const ImageMethodToolbar = () => {
  const { onRemoveMethod, addImage } = useTShirtEditor();
  return (
    <section>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add Image</h3>
        <button onClick={onRemoveMethod}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>
      <div className="mt-8">
        <input
          type="file"
          onChange={(e: any) => {
            if (e.target.files?.length > 0) {
              addImage(e.target.files[0]);
            }
          }}
        />
      </div>
    </section>
  );
};

export default ImageMethodToolbar;
