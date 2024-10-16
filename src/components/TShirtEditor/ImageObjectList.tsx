import React from "react";
import { useTShirtEditor } from "./Context";
import { IoMdClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import Image from "next/image";
import { FabricImage } from "fabric";

const ImageObjectsList = () => {
  const {
    objects,
    setActiveProperty,
    setActiveObject,
    addImage,
    setSelectedImageObject,
  } = useTShirtEditor();

  return (
    <div>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Images</h3>
      </div>
      <div className="mt-10">
        {objects
          .filter((obj) => obj.type === "image")
          .map((obj: any, i) => (
            <div
              className="border-b py-3 flex items-center justify-between"
              key={i}
            >
              <Image
                width={100}
                height={60}
                src={obj.getSrc(false)}
                alt="image"
              />

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedImageObject(obj);
                    setActiveProperty("image-detail");
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
      </div>
    </div>
  );
};

export default ImageObjectsList;
