import React from "react";
import { IoMdClose } from "react-icons/io";
import { useTShirtEditor } from "./Context";
import Image from "next/image";

const ImageDetail = () => {
  const { setActiveProperty, selectedImageObject } = useTShirtEditor();
  return (
    <section>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Image</h3>
        <button onClick={() => setActiveProperty("idle")}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>

      <div className="mt-10">
        {selectedImageObject?.getSrc?.() && (
          <Image
            src={selectedImageObject.getSrc?.()}
            alt="Test"
            width={200}
            height={100}
          />
        )}
      </div>
    </section>
  );
};

export default ImageDetail;
