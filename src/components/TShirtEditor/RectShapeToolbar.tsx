import React from "react";
import { IoMdClose } from "react-icons/io";
import { useTShirtEditor } from "./Context";
import Slider from "react-rangeslider";

const RectShapeToolbar = () => {
  const {
    onRemoveMethod,
    setActiveShapeName,
    selectedRectObject,
    handleRectPropChanges,
  } = useTShirtEditor();
  return (
    <section>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add Rect</h3>
        <button onClick={() => setActiveShapeName("idle")}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>
      <div className="[&>div]:flex mt-8 [&>div]:items-center [&>div]:py-3 [&>div]:border-b [&>div]:justify-between flex flex-col">
        <div>
          <span>Bg Color</span>
          <input
            type="color"
            value={selectedRectObject.fill}
            onChange={(e) => handleRectPropChanges("fill", e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-10">
          <span>Border radius</span>
          <div className="slider w-44">
            <Slider
              min={0}
              max={100}
              value={selectedRectObject.rx}
              onChange={(value) => {
                handleRectPropChanges("rx", value);
              }}
            />
          </div>
        </div>
        <div>
          <span>Flip X</span>
          <input
            name="overline"
            type="checkbox"
            checked={selectedRectObject.flipX}
            onChange={(e) => handleRectPropChanges("flipX", e.target.checked)}
          />
        </div>
        <div>
          <span>Flip Y</span>
          <input
            name="overline"
            type="checkbox"
            checked={selectedRectObject.flipY}
            onChange={(e) => handleRectPropChanges("flipY", e.target.checked)}
          />
        </div>
      </div>
    </section>
  );
};

export default RectShapeToolbar;
