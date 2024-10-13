"use client";
import {
  Canvas,
  FabricImage,
  IText,
  Rect,
  InteractiveFabricObject,
  Line,
  Control,
  Circle,
  RectProps,
  FabricObject,
  ITextProps,
  Group,
} from "fabric";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  TShirtAvailableShapeType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";
import MyCanvas from "./Canvas";
import Aside from "./Aside";
import ActiveToolProperties from "./ActiveToolProperties";
import { TShirtEditorContext } from "./Context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  cloneImg,
  cloneObject,
  deleteIcon,
  deleteImg,
  deleteObject,
  loadFont,
  renderIcon,
} from "./utils";
import useEditableBox from "./useEditableBox";
import useEditableBoxv2 from "./useEditableBoxv2";

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

InteractiveFabricObject.ownDefaults = {
  ...InteractiveFabricObject.ownDefaults,
  // cornerStyle: "circle",
  cornerSize: 8,
  // top: 1,

  transparentCorners: false,
  strokeWidth: 6,
  borderScaleFactor: 0,
  borderColor: "gray",
  borderOpacityWhenMoving: 1,
  centeredRotation: true,
  lockSkewingX: true,
  lockSkewingY: true,
  centeredScaling: true,
  padding: 0,
};

interface TshirtEditorPorps {
  imageUrls: string[];
}

const TShirtEditor = ({ imageUrls }: TshirtEditorPorps) => {
  const firstRender = useRef(false);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const verticalLineRef = useRef<Line>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [activeShapeName, setActiveShapeName] = useState<
    TShirtAvailableShapeType | "idle"
  >("idle");
  const [activeProperty, setActiveProperty] = useState<"font-list" | "closed">(
    "closed"
  );
  const [selectedRectObject, setSelectRectObject] = useState<
    Partial<RectProps>
  >({});
  const [selectedTextObject, setSelectTextObject] = useState<
    Partial<ITextProps>
  >({});
  const [size, setSize] = useState({ width: 0, height: 0 });

  const { addEditableBox } = useEditableBoxv2(canvas);

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
      if (firstRender.current || canvas) {
        return;
      }

      const tempCanvas = new Canvas(CANVAS_ID, {
        renderOnAddRemove: true,
        preserveObjectStacking: true,
        backgroundColor: "#f8edeb",
      });

      // Get the center of the canvas
      const canvasCenterX = tempCanvas.getWidth() / 2;
      const canvasHeight = tempCanvas.getHeight();

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
        imageUrls[0],
        {},
        {
          selectable: false,
          centeredScaling: true,
        }
      );

      image.scaleToHeight(size.width);
      image.scaleToWidth(size.height);

      // const designArea = new Rect({
      //   width: 350, // Width of the design area
      //   height: 600, // Height of the design area
      //   fill: "rgba(0, 0, 0, 0.1)", // Semi-transparent green
      //   stroke: "gray", // Outline color
      //   strokeDashArray: [2, 5], // Dotted/dashed border
      //   selectable: false, // Disable selection for the design area rectangle
      // });

      firstRender.current = true;

      tempCanvas.add(image);
      tempCanvas.add(verticalLineRef.current);
      tempCanvas.bringObjectToFront(verticalLineRef.current);
      tempCanvas.centerObject(image);
      tempCanvas.renderAll();
      setCanvas(tempCanvas);
    })();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [size]);

  const activeMethod = (method: TShirtEditorMethodType) => {
    const params = new URLSearchParams(searchParams);
    params.set("method", method);
    router.push(`${pathname}?${params.toString()}`);
  };

  const setCustomControls = (
    obj: FabricObject,
    events?: Record<PropertyKey, any>
  ) => {
    if (!canvas) {
      return;
    }

    obj.controls.deleteControl = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon(deleteImg()),
      sizeX: 24,
      sizeY: 24,
    });

    obj.controls.cloneControl = new Control({
      x: -0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: -24,
      cursorStyle: "pointer",
      mouseUpHandler: (eventData, transform) =>
        cloneObject(eventData, transform, events),
      render: renderIcon(cloneImg()),
      sizeX: 24,
      sizeY: 24,
    });
  };

  const textHandleMousedown = (e) => {
    const { target } = e;

    setActiveProperty("closed");

    activeMethod("add-text");

    setSelectTextObject((prev) => ({
      ...prev,
      ...target,
      text: target.text,
      textAlign: target.textAlign,
      textBackgroundColor: target.textBackgroundColor,
      fill: target?.fill,
      fontWeight: target.fontWeight,
      fontSize: target.fontSize,
      fontFamily: target.fontFamily,
    }));
  };

  const handleTextMoving = (e, text) => {
    if (!canvas || !verticalLineRef.current) {
      return;
    }

    verticalLineRef.current?.set("visible", true);

    const obj = text;
    const canvasCenterX = (canvas?.getWidth() / 2) as number;

    // Calculate the center position of the moving object
    const objCenterX = obj ? obj.getCenterPoint().x : 0;

    console.log({ objCenterX, canvasCenterX });

    const isCenter = Math.abs(objCenterX - canvasCenterX) < 5;

    verticalLineRef.current.set("visible", isCenter);

    canvas?.renderAndReset();
  };

  const handleTextMouseUp = () => {
    if (!verticalLineRef.current) {
      return;
    }
    verticalLineRef.current?.set("visible", false);
  };

  const handleTextChanged = (obj: FabricObject) => {
    setSelectTextObject((prev) => ({ ...prev, text: obj.get("text") }));
  };

  const onHandleMethod = ({ name }: { name: TShirtEditorMethodType }) => {
    if (!canvas) {
      return;
    }

    switch (name) {
      case "add-text":
        {
          const text = new IText("Text", {
            fontSize: 60,
            fill: "#ffffff",
            fontWeight: 800,
            charSpacing: 20,
            strokeWidth: 0,
            objectCaching: false,
            stroke: "#ffffff",
          });

          // text.setControlVisible("ml", false);

          setCustomControls(text, {
            mousedown: textHandleMousedown,
            deselected: onRemoveMethod,
            moving: handleTextMoving,
            mouseup: handleTextMouseUp,
            changed: handleTextChanged,
          });

          canvas.setActiveObject(text);

          text.on("mousedown", textHandleMousedown);

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

          text.on("changed", (e) => handleTextChanged(text));

          text.on("moving", (e: any) => handleTextMoving(e, text));

          text.on("mouseup", handleTextMouseUp);

          canvas.add(text);
          canvas.bringObjectToFront(text);
          canvas.centerObject(text);
          canvas.renderAll();
        }
        break;
      default:
        break;
    }
  };

  const addImage = (file: File) => {
    if (!canvas) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageObj = new Image();
      imageObj.src = event.target?.result as string;
      imageObj.onload = async () => {
        const image = await FabricImage.fromObject(imageObj);

        setCustomControls(image);

        image.scaleToHeight(size.height / 4);
        image.scaleToWidth(size.width / 4);
        canvas.add(image);
        canvas.centerObject(image);
        canvas.renderAll();
      };
    };

    reader.readAsDataURL(file);
  };

  const onHandleTextChange = async (key: keyof ITextProps, value: any) => {
    if (!canvas) {
      return;
    }

    const activeObject = canvas.getActiveObject();

    if (key === "fontFamily") {
      await loadFont(value?.name, value.url);
    }

    const preparedValue = key === "fontFamily" ? value?.name : value;

    activeObject?.set(key, preparedValue);
    canvas.requestRenderAll();
    setSelectTextObject((prev) => ({ ...prev, [key]: preparedValue }));
  };

  const onRemoveMethod = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("method");

    router.push(`${pathname}?${params.toString()}`);
  };

  const onAddShape = (name: TShirtAvailableShapeType) => {
    if (!canvas) {
      return;
    }

    setActiveShapeName(name);

    switch (name) {
      case "rect":
        const props: Partial<RectProps> = {
          width: 100,
          height: 40,
          fill: "#ff0000",
        };
        const rect = new Rect(props);
        setSelectRectObject(props);

        setCustomControls(rect);

        rect.on("mousedown", (e) => {});

        canvas.add(rect);
        canvas.sendObjectBackwards(rect);
        canvas.centerObject(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
        break;
      case "circle":
        const circle = new Circle({
          radius: 40,
          fill: "red",
        });
        canvas.add(circle);
        canvas.sendObjectBackwards(circle);
        canvas.centerObject(circle);
        canvas.renderAll();
        break;
      case "button-text":
        {
          addEditableBox();
        }
        break;
      default:
        break;
    }
  };

  const handleRectPropChanges = (key: keyof RectProps, value: any) => {
    if (!canvas) {
      return;
    }

    const activeObject = canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    activeObject.set(key, value);
    canvas.requestRenderAll();
    setSelectRectObject((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <TShirtEditorContext.Provider
      value={{
        onRemoveMethod,
        onHandleMethod,
        onHandleTextChange,
        selectedTextObject,
        addImage,
        onAddShape,
        setActiveShapeName,
        activeShapeName,
        selectedRectObject,
        handleRectPropChanges,
        activeProperty,
        setActiveProperty,
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
