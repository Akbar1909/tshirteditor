import { IoMdClose } from "react-icons/io";
import { BlockPicker, ChromePicker } from "react-color";
import { useTShirtEditor } from "./Context";
import { ChangeEvent, FormEvent, useState } from "react";
import { useFloating } from "@floating-ui/react";
import Slider from "react-rangeslider";
// To include the default styles
import "react-rangeslider/lib/index.css";
import { twMerge } from "tailwind-merge";

const TextMethodToolbar = () => {
  const [toggler, setToggler] = useState<"fill-color" | "closed">("closed");
  const [isOpen, setIsOpen] = useState(false);
  const {
    onRemoveMethod,
    selectedTextObject,
    onHandleTextChange,
    setActiveProperty,
    ...rest
  } = useTShirtEditor();

  const { refs, floatingStyles } = useFloating({
    onOpenChange: setIsOpen,
    open: isOpen,
    placement: "bottom-end",
    strategy: "fixed",
    // transform: false,
  });

  const fonts = [
    {
      label: "Poppins black",
      url: "/fonts/Poppins/Poppins-Black.ttf",
    },
    {
      label: "VT323",
      url: "/fonts/VT323-Regular.ttf",
    },
    {
      label: "Poppins Black Italic",
      url: "/fonts/Poppins/Poppins-BlackItalic.ttf",
    },
    {
      label: "QwitcherGrypen-Bold",
      url: "/fonts/Qwitcher_Grypen/QwitcherGrypen-Bold.ttf",
    },
  ];

  return (
    <section>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add New Text</h3>
        <button onClick={onRemoveMethod}>
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
          {isOpen && (
            <div ref={refs.setFloating} style={floatingStyles} className="z-40">
              <div className="bg-white grid border z-50 rounded-lg shadow-sm px-2 py-2 w-80">
                {fonts.map(({ label, url }, i) => (
                  <div
                    className={twMerge(
                      "cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-150 h-20 flex items-center justify-center",
                      selectedTextObject.fontFamily === label &&
                        "bg-blue-300 text-white"
                    )}
                    key={i}
                    role="button"
                    onClick={() => {
                      onHandleTextChange("fontFamily", { name: label, url });
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
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
