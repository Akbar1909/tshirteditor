"use client";
import {
  Canvas,
  FabricImage,
  IText,
  Rect,
  InteractiveFabricObject,
  Line,
  ControlActionHandler,
  Control,
  FabricObject,
} from "fabric";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  SelectedTextObjectType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";
import MyCanvas from "./Canvas";
import Aside from "./Aside";
import ActiveToolProperties from "./ActiveToolProperties";
import { TShirtEditorContext } from "./Context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteImg, deleteObject, loadFont, renderIcon } from "./utils";
import useControls from "./useControls";

const CANVAS_ID = "t-shirt_editor";

Canvas.prototype.getItemsByName = function (name: string) {
  const objectList = [],
    objects = this.getObjects();

  for (let i = 0, len = this.size(); i < len; i++) {
    if (objects[i]?.name && objects[i]?.name === name) {
      objectList.push(objects[i]);
    }
  }

  return objectList;
};

// FabricObject.prototype.controls.deleteControl = new Control({
//   x: 0.5,
//   y: -0.5,
//   offsetY: -16,
//   offsetX: 16,
//   cursorStyle: "pointer",
//   mouseUpHandler: deleteObject,
//   render: renderIcon(deleteImg()),
//   sizeX: 64,
//   sizeY: 64,
// });

InteractiveFabricObject.ownDefaults = {
  ...InteractiveFabricObject.ownDefaults,
  // cornerStyle: "circle",
  cornerSize: 4,
  padding: 4,
  // top: 1,
  transparentCorners: false,
  strokeWidth: 4,
  // borderScaleFactor: 0,
  // borderColor: "gray",
  borderOpacityWhenMoving: 0.5,
  centeredRotation: true,
  lockScalingFlip: true,
  lockSkewingX: true,
  lockSkewingY: true,
};

const TShirtEditor = () => {
  const firstRender = useRef(false);
  const canvasRef = useRef<Canvas>(null);
  const verticalLineRef = useRef<Line>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTextObject, setSelectTextObject] =
    useState<SelectedTextObjectType>({
      text: "",
      textAlign: "",
      textBackgroundColor: "",
      fill: "",
      fontWeight: 0,
      fontSize: 0,
      linethrough: false,
      underline: false,
      overline: false,
      stroke: "",
      charSpacing: 0,
      fontFamily: "",
    });
  const [size, setSize] = useState({ width: 0, height: 0 });

  // useControls(canvasRef);

  useLayoutEffect(() => {
    if (!canvasContainerRef.current) {
      return;
    }

    setSize({
      width: canvasContainerRef.current.clientWidth,
      height: canvasContainerRef.current.clientHeight,
    });
  }, []);

  useEffect(() => {
    if (size.height === 0 || size.width === 0) {
      return;
    }

    (async () => {
      if (firstRender.current) {
        return;
      }

      canvasRef.current = new Canvas(CANVAS_ID, {
        renderOnAddRemove: true,
        preserveObjectStacking: true,
      });

      canvasRef.current.backgroundColor = "white";

      // Get the center of the canvas
      const canvasCenterX = canvasRef.current.getWidth() / 2;
      const canvasHeight = canvasRef.current.getHeight();

      // Create a vertical center line
      verticalLineRef.current = new Line(
        [canvasCenterX, 0, canvasCenterX, canvasHeight],
        {
          stroke: "red",
          name: "vertical-line",
          selectable: false, // Prevent the line from being selected
          evented: false, // Disable interaction with the line
          visible: false, // Initially hide the line
        }
      );

      const image = await FabricImage.fromURL(
        "https://www.transparentpng.com/download/shirt/t0nf0S-t-shirt-transparent-background.png",
        {},
        {
          selectable: false,

          centeredScaling: true,
        }
      );

      image.scaleToHeight(size.width / 1.05);
      image.scaleToWidth(size.height / 1.05);

      firstRender.current = true;

      canvasRef.current.add(image);
      canvasRef.current.add(verticalLineRef.current);
      canvasRef.current.bringObjectToFront(verticalLineRef.current);
      canvasRef.current.centerObject(image);
      canvasRef.current.renderAll();
    })();

    return () => {
      canvasRef.current?.dispose();
    };
  }, [size]);

  const activeMethod = (method: TShirtEditorMethodType) => {
    const params = new URLSearchParams(searchParams);
    params.set("method", method);
    router.push(`${pathname}?${params.toString()}`);
  };

  const onHandleMethod = ({ name }: { name: TShirtEditorMethodType }) => {
    switch (name) {
      case "add-text":
        {
          const text = new IText("", {
            fontSize: 36,
            fill: "white",
            hasControls: true,
            fontWeight: 600,
            charSpacing: 20,
            strokeWidth: 1.8,
            objectCaching: false,
          });

          text.controls.deleteControl = new Control({
            x: 0.5,
            y: -0.5,
            offsetY: -16,
            offsetX: 16,
            cursorStyle: "pointer",
            mouseUpHandler: deleteObject,
            render: renderIcon(deleteImg()),
            sizeX: 64,
            sizeY: 64,
          });
          console.log("");

          text.setControlsVisibility({ deleteControl: true });

          canvasRef.current?.setActiveObject(text);

          text.on("mousedown", (e: any) => {
            const { target } = e;

            activeMethod("add-text");

            setSelectTextObject((prev) => ({
              ...prev,
              text: target.text,
              textAlign: target.textAlign,
              textBackgroundColor: target.textBackgroundColor,
              fill: target?.fill,
              fontWeight: target.fontWeight,
              fontSize: target.fontSize,
              fontFamily: target.fontFamily,
            }));
          });

          text.on("deselected", (e) => {
            onRemoveMethod();
          });

          text.on("drop", () => {});

          text.on("added", () => {
            console.log("added");
          });

          text.on("dragleave", () => {
            console.log("drag leave");
          });

          text.on("moving", (e: any) => {
            verticalLineRef.current?.set("visible", true);

            const obj = text;
            const canvasCenterX = (canvasRef.current?.getWidth() / 2) as number;

            // Calculate the center position of the moving object
            const objCenterX = obj ? obj.getCenterPoint().x : 0;

            console.log({ objCenterX, canvasCenterX });

            const isCenter = Math.abs(objCenterX - canvasCenterX) < 5;

            verticalLineRef.current.set("visible", isCenter);

            canvasRef.current?.renderAndReset();
          });

          text.on("mouseup", function (e) {
            verticalLineRef.current?.set("visible", false);
          });

          canvasRef.current?.add(text);
          canvasRef.current?.bringObjectToFront(text);
          canvasRef.current?.centerObject(text);
          canvasRef.current?.renderAll();
        }
        break;
      case "rect":
        const rect = new Rect({
          width: 100,
          height: 40,
          fill: "red",
          rx: 10,
          ry: 10,
          zIndex: 9,
        });

        rect.on("mousedown", (e) => {});

        canvasRef.current?.add(rect);
        canvasRef.current?.sendObjectBackwards(rect);
        canvasRef.current?.centerObject(rect);
        canvasRef.current?.renderAll();
        break;
      default:
        break;
    }
  };

  const addImage = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageObj = new Image();
      imageObj.src = event.target?.result as string;
      imageObj.onload = async () => {
        const image = await FabricImage.fromObject(imageObj);

        image.scaleToHeight(size.height / 4);
        image.scaleToWidth(size.width / 4);
        canvasRef.current?.add(image);
        canvasRef.current?.centerObject(image);
        canvasRef.current?.renderAll();
      };
    };

    reader.readAsDataURL(file);
  };

  const onHandleTextChange = async (
    key: keyof SelectedTextObjectType,
    value: any
  ) => {
    const activeObject = canvasRef.current?.getActiveObject();

    if (key === "fontFamily") {
      await loadFont(value?.name, value.url);
    }

    const preparedValue = key === "fontFamily" ? value?.name : value;

    activeObject?.set(key, preparedValue);
    canvasRef.current?.requestRenderAll();
    setSelectTextObject((prev) => ({ ...prev, [key]: preparedValue }));
  };

  const onRemoveMethod = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("method");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <TShirtEditorContext.Provider
      value={{
        onRemoveMethod,
        onHandleMethod,
        onHandleTextChange,
        selectedTextObject,
        addImage,
      }}
    >
      <div className="relative flex h-full">
        <Aside className="w-20" />
        <ActiveToolProperties className="w-[350px]" />
        <div ref={canvasContainerRef} className="flex-1">
          <MyCanvas {...size} />
        </div>

        {/* <article className="absolute left-[10%] w-[80%] flex items-center justify-center bottom-3">
        <motion.div
          className={twMerge(
            "flex w-full text-center bg-red-500 rounded-xl items-center justify-between overflow-hidden transition-all duration-200 ease-in"
          )}
          initial={{ width: "100%" }} // Initial state when selectedTool is "none"
          // animate={{ width: selectedTool !== "none" ? 0 : "100%" }} // Animate to 0% when a tool is selected
          transition={{ duration: 0.3, type: "tween" }}
          onAnimationComplete={() => {
            if (selectedTool !== "none") {
              setDrawerIsOpen(true);
            }
          }}
        >
          {tools.map(({ label, name }, i) => (
            <div
              onClick={() => onHandleToolChange({ name })}
              role="button"
              className={twMerge(
                "px-3 py-2 rounded-md flex-1 flex items-center justify-center",
                name === selectedTool && "bg-red-400"
              )}
              key={i}
            >
              {label}
            </div>
          ))}
        </motion.div>
      </article> */}

        {/* <Draggable defaultClassName="fixed top-0 left-0" handle=".handle">
        <div>
          <div className="handle rounded-tl-lg rounded-tr-lg h-6 w-full bg-black/70 cursor-grab"></div>
          <div className="w-52 h-32 rounded-bl-lg rounded-br-lg bg-white shadow-md  px-3 py-2">
            <input
              type="text"
              value={selectedTextObject.text}
              className="border"
              name="text"
              onChange={(e) => handleTextObjectChanges("text", e)}
            />
            <input
              type="color"
              value={selectedTextObject.fill}
              name="fill"
              onChange={(e) => handleTextObjectChanges("text", e)}
            />

            <button
              onClick={handleTextAlign}
              className="w-8 h-8 p-2 flex items-center justify-center bg-purple-600 hover:opacity-40 rounded-lg"
            >
              <FaAlignRight color="white" />
            </button>
          </div>
        </div>
      </Draggable> */}
      </div>
    </TShirtEditorContext.Provider>
  );
};

export default TShirtEditor;
