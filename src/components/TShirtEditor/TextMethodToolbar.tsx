import { IoMdClose } from "react-icons/io";
import { BlockPicker, ChromePicker } from "react-color";
import { useTShirtEditor } from "./Context";
import { ChangeEvent, FormEvent, useState } from "react";
import { useFloating } from "@floating-ui/react";
import Slider from "react-rangeslider";
// To include the default styles
import "react-rangeslider/lib/index.css";
import { twMerge } from "tailwind-merge";
import { FaAlignLeft } from "react-icons/fa";
import { FaAlignRight } from "react-icons/fa";
import { FaAlignCenter } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa";

const TextMethodToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    onRemoveMethod,
    selectedTextObject,
    onHandleTextChange,
    setActiveProperty,
  } = useTShirtEditor();

  const { refs, floatingStyles } = useFloating({
    onOpenChange: setIsOpen,
    open: isOpen,
    placement: "bottom-end",
    strategy: "fixed",
    // transform: false,
  });

  return (
    <section>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add New Text</h3>
        <button onClick={() => setActiveProperty("text-object-list")}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>

      <div className="mt-8">
        <textarea
          className="w-full border h-24 px-2"
          name=""
          id=""
          value={selectedTextObject.text}
          onChange={(e) => onHandleTextChange("text", e.target.value)}
        />
      </div>

      <div className="[&>div]:flex [&>div]:items-center [&>div]:py-3 [&>div]:border-b [&>div]:justify-between flex flex-col">
        <div>
          <button
            className={twMerge(
              "p-2 rounded-md hover:bg-blue-200",
              selectedTextObject.textAlign === "left" &&
                "bg-blue-400 text-white",
              "transition-all duration-150 ease-in-out"
            )}
            onClick={() => onHandleTextChange("textAlign", "left")}
          >
            <FaAlignLeft fontSize={24} />
          </button>
          <button
            className={twMerge(
              "p-2 rounded-md hover:bg-blue-200",
              selectedTextObject.textAlign === "center" &&
                "bg-blue-400 text-white",
              "transition-all duration-150 ease-in-out"
            )}
            onClick={() => onHandleTextChange("textAlign", "center")}
          >
            <FaAlignCenter fontSize={24} />
          </button>
          <button
            className={twMerge(
              "p-2 rounded-md hover:bg-blue-200",
              selectedTextObject.textAlign === "right" &&
                "bg-blue-400 text-white",
              "transition-all duration-150 ease-in-out"
            )}
            onClick={() => onHandleTextChange("textAlign", "right")}
          >
            <FaAlignRight fontSize={24} />
          </button>
          <button
            className={twMerge(
              "p-2 rounded-md hover:bg-blue-200",
              selectedTextObject.textAlign === "justify" &&
                "bg-blue-400 text-white",
              "transition-all duration-150 ease-in-out"
            )}
            onClick={() => onHandleTextChange("textAlign", "justify")}
          >
            <FaAlignJustify fontSize={24} />
          </button>
        </div>

        <div>
          <span>Transparent</span>
          <input
            name="transparent"
            type="checkbox"
            checked={selectedTextObject.fill === "transparent"}
            onChange={(e) =>
              onHandleTextChange(
                "fill",
                e.target.checked ? "transparent" : selectedTextObject.prevFill
              )
            }
          />
        </div>

        <div>
          <span>Font Family</span>
          <button
            className="cursor-pointer"
            ref={refs.setReference}
            onClick={() => {
              setActiveProperty("font-list");
            }}
          >
            {selectedTextObject.fontFamily || "-"}
          </button>
        </div>
        <div>
          <span>Color</span>
          <input
            type="color"
            value={selectedTextObject.fill}
            onChange={(e) => onHandleTextChange("fill", e.target.value)}
          />
        </div>
        <div>
          <span>Outline</span>
          <input
            type="color"
            value={selectedTextObject.stroke}
            onChange={(e) => onHandleTextChange("stroke", e.target.value)}
          />
        </div>
        <div>
          <span>Stroke width</span>
          <div className="slider w-44">
            <Slider
              min={0}
              max={100}
              value={selectedTextObject.strokeWidth}
              onChange={(value) => onHandleTextChange("strokeWidth", value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-10">
          <span>Size</span>
          <div className="slider w-44">
            <Slider
              min={0}
              max={100}
              value={selectedTextObject.fontSize}
              onChange={(value) => onHandleTextChange("fontSize", value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-10">
          <span>Opacity</span>
          <div className="slider w-44">
            <Slider
              min={0}
              max={1}
              step={0.001}
              value={selectedTextObject.opacity}
              onChange={(value) => onHandleTextChange("opacity", value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-10">
          <span>Spacing</span>
          <div className="slider w-44">
            <Slider
              min={0}
              max={1000}
              value={selectedTextObject.charSpacing}
              onChange={(value: number) =>
                onHandleTextChange("charSpacing", value)
              }
            />
          </div>
        </div>
        <div>
          <span>Underline</span>
          <input
            name="underline"
            type="checkbox"
            checked={selectedTextObject.underline}
            onChange={(e) => onHandleTextChange("underline", e.target.checked)}
          />
        </div>
        <div>
          <span>Overline</span>
          <input
            name="overline"
            type="checkbox"
            checked={selectedTextObject.overline}
            onChange={(e) => onHandleTextChange("overline", e.target.checked)}
          />
        </div>
        <div>
          <span>Line through</span>
          <input
            name="linethrough"
            type="checkbox"
            checked={selectedTextObject.linethrough}
            onChange={(e) =>
              onHandleTextChange("linethrough", e.target.checked)
            }
          />
        </div>
      </div>
    </section>
  );
};

export default TextMethodToolbar;
