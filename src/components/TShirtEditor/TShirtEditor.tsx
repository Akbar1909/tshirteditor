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
  Textbox,
  CanvasEvents,
} from "fabric";
import throttle from "lodash.throttle";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  TShirtAvailableShapeType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";
import MyCanvas from "./Canvas";
import Aside from "./Aside";
import ActiveToolProperties from "./ActiveToolProperties";
import { TShirtEditorContext, TShirtEditorContextType } from "./Context";
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
import CurvedText from "./CurvedText";
import ObjectContextMenu from "./ObjectContextMenu";

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
  const [objects, setObjects] = useState<FabricObject[]>([]);
  const verticalLineRef = useRef<Line>(null);
  const alignmentLines = useRef<Line[]>([]);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const objectContextMenuRef = useRef<HTMLDivElement>();
  const [activeShapeName, setActiveShapeName] = useState<
    TShirtAvailableShapeType | "idle"
  >("idle");
  const [isOpenObjectContextMenu, setIsOpenObjectContextMenu] = useState(false);
  const [activeProperty, setActiveProperty] =
    useState<TShirtEditorContextType["activeProperty"]>("closed");
  const [currentMethod, setCurrentMethod] =
    useState<TShirtEditorMethodType>("about-product");
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

      const designArea = new Rect({
        width: image.width, // Width of the design area
        height: image.height, // Height of the design area
        fill: "rgba(0, 0, 0, 0.1)", // Semi-transparent green
        stroke: "gray", // Outline color
        strokeDashArray: [2, 5], // Dotted/dashed border
        selectable: false, // Disable selection for the design area rectangle
      });

      firstRender.current = true;

      tempCanvas.add(image);
      tempCanvas.add(verticalLineRef.current);
      tempCanvas.bringObjectToFront(verticalLineRef.current);
      tempCanvas.centerObject(image);
      tempCanvas.renderAll();

      // Listen to object movement to display alignment lines
      // Throttle the checkAlignment function
      const throttledCheckAlignment = throttle((e: any) => {
        const activeObject = e.target;
        if (activeObject) {
          checkAlignment(tempCanvas!, activeObject);
        }
      }, 50); // Run the checkAlignment function every 50ms

      tempCanvas.on("object:moving", (e) => {
        changeObjectContextMenuPos(e.target, tempCanvas);
        throttledCheckAlignment(e);

        // console.log(e.target.getBoundingRect());
      });

      tempCanvas.on("object:added", openObjectContextMenu);

      tempCanvas.on("object:modified", (e) => {
        changeObjectContextMenuPos(e.target, tempCanvas);
      });

      tempCanvas.on("selection:cleared", () => {
        removeAlignmentLines(tempCanvas);
        tempCanvas.renderAll();
      });

      tempCanvas.on("after:render", (e) => {
        changeObjectContextMenuPos(
          tempCanvas.getActiveObject() as FabricObject,
          tempCanvas
        );
      });

      // tempCanvas.add(designArea);
      // tempCanvas.centerObject(designArea);
      setCanvas(tempCanvas);
    })();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [size]);

  // Function to check alignment between objects
  const checkAlignment = (canvas: Canvas, activeObject: FabricObject) => {
    removeAlignmentLines(canvas); // Clear previous alignment lines
    const threshold = 5; // Pixel tolerance for alignment

    // Check only nearby objects for alignment to improve performance
    canvas.forEachObject((obj) => {
      if (obj !== activeObject) {
        const objRect = obj.getBoundingRect();
        const activeRect = activeObject.getBoundingRect();

        // Check top alignment
        if (Math.abs(activeRect.top - objRect.top) <= threshold) {
          drawAlignmentLine(
            canvas,
            objRect.left - 50,
            objRect.top,
            objRect.left + objRect.width + 50,
            objRect.top
          );
        }

        // Check bottom alignment
        if (
          Math.abs(
            activeRect.top + activeRect.height - (objRect.top + objRect.height)
          ) <= threshold
        ) {
          drawAlignmentLine(
            canvas,
            objRect.left - 50,
            objRect.top + objRect.height,
            objRect.left + objRect.width + 50,
            objRect.top + objRect.height
          );
        }

        // Check left alignment
        if (Math.abs(activeRect.left - objRect.left) <= threshold) {
          drawAlignmentLine(
            canvas,
            objRect.left,
            objRect.top - 50,
            objRect.left,
            objRect.top + objRect.height + 50
          );
        }

        // Check right alignment
        if (
          Math.abs(
            activeRect.left + activeRect.width - (objRect.left + objRect.width)
          ) <= threshold
        ) {
          drawAlignmentLine(
            canvas,
            objRect.left + objRect.width,
            objRect.top - 50,
            objRect.left + objRect.width,
            objRect.top + objRect.height + 50
          );
        }
      }
    });
    // Re-render the canvas
    canvas.renderAll();
  };

  // Function to draw alignment lines
  const drawAlignmentLine = (
    canvas: Canvas,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const line = new Line([x1, y1, x2, y2], {
      stroke: "green",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });

    alignmentLines.current.push(line);
    canvas.add(line);
  };

  // Function to remove alignment lines
  const removeAlignmentLines = (canvas: Canvas) => {
    alignmentLines.current.forEach((line) => {
      canvas.remove(line);
    });

    alignmentLines.current = [];
  };

  const activeMethod = (method: TShirtEditorMethodType) =>
    setCurrentMethod(method);

  const changeObjectContextMenuPos = (target: FabricObject, canvas: Canvas) => {
    if (!target) {
      setIsOpenObjectContextMenu(false);
      return;
    }

    const boundingRect = target.getBoundingRect();

    // Center the div horizontally and position it above the object
    const objectCenterX = boundingRect.left + boundingRect.width / 2; // Center X of the object

    if (objectContextMenuRef.current && canvas) {
      const div = objectContextMenuRef.current;
      const divWidth = div.offsetWidth; // Width of the div
      const divLeft = objectCenterX - divWidth / 2;
      objectContextMenuRef.current.style.left = `${
        divLeft + canvas._offset.left
      }px`;
      objectContextMenuRef.current.style.top = `${
        boundingRect.top - 55 + canvas._offset.top
      }px`;
    }
  };

  const onHandleAnimationComplete = () => {
    if (!objectContextMenuRef.current) {
      return;
    }

    objectContextMenuRef.current.style.left = "-1000px";
  };

  const setCustomControls = (
    obj: FabricObject,
    events?: Record<PropertyKey, any>
  ) => {
    if (!canvas) {
      return;
    }

    return;

    obj.controls.deleteControl = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: "pointer",
      mouseUpHandler: (_eventData, transform) => {
        console.log(transform.target.id);

        setObjects((prev) =>
          prev.filter((obj) => obj.id !== transform.target.id)
        );

        deleteObject(_eventData, transform);
      },
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
      mouseUpHandler: (eventData, transform) => {
        cloneObject(eventData, transform, events, (clonedObject) => {
          setObjects((prev) => [...prev, clonedObject]);
        });
      },
      render: renderIcon(cloneImg()),
      sizeX: 24,
      sizeY: 24,
    });
  };

  const hideObjectContextMenu = () => setIsOpenObjectContextMenu(false);

  const cloneObject = async () => {
    if (!canvas) {
      return;
    }
    const activeObject = canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    const cloned = await activeObject.clone();
  };

  const openObjectContextMenu = () => setIsOpenObjectContextMenu(true);

  const textHandleMousedown = (e, obj: FabricObject) => {
    setActiveProperty("closed");

    activeMethod("add-text");

    openObjectContextMenu();

    changeObjectContextMenuPos(e.target, canvas as Canvas);

    setSelectTextObject((prev) => ({
      ...prev,
      ...obj,
    }));
  };

  const handleTextMoving = (text: R) => {
    if (!canvas || !verticalLineRef.current) {
      return;
    }

    verticalLineRef.current?.set("visible", true);
    const obj = text;
    const canvasCenterX = (canvas?.getWidth() / 2) as number;
    // Calculate the center position of the moving object
    const objCenterX = obj ? obj.getCenterPoint().x : 0;
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

  const handleTextChanged = (e, obj: FabricObject) => {
    setSelectTextObject((prev) => ({ ...prev, text: obj.get("text") }));
  };

  const handleTextDeselected = () => {
    setActiveProperty("text-object-list");
    setIsOpenObjectContextMenu(false);
  };

  const onHandleMethod = ({ name }: { name: TShirtEditorMethodType }) => {
    if (!canvas) {
      return;
    }

    setCurrentMethod(name);

    switch (name) {
      case "add-text":
        {
          const text = new Textbox("Text", {
            fontSize: 60,
            fill: "#ffffff",
            fontWeight: 800,
            charSpacing: 20,
            strokeWidth: 1,
            objectCaching: false,
            stroke: "#ffffff",
            index: objects.length,
            id: uuidv4(),
            width: 300,
            textAlign: "center",
            height: 20,
            diameter: 250,
          });

          setSelectTextObject(text);

          setCustomControls(text, {
            mousedown: textHandleMousedown,
            deselected: handleTextDeselected,
            moving: handleTextMoving,
            mouseup: handleTextMouseUp,
            changed: handleTextChanged,
          });

          setObjects((prev) => [...prev, text]);

          canvas.setActiveObject(text);

          text.on("mousedown", (e) => textHandleMousedown(e, text));

          text.on("deselected", handleTextDeselected);

          text.on("drop", () => {});

          text.on("changed", (e) => handleTextChanged(e, text));

          text.on("moving", (e: any) => handleTextMoving(e, text));

          text.on("mouseup", handleTextMouseUp);

          canvas.add(text);
          canvas.bringObjectToFront(text);
          canvas.centerObject(text);
          canvas.renderAll();
        }
        break;
      // case "image":
      //   canvas.discardActiveObject();
      //   break;
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

    const index = objects.findIndex(
      (obj) => obj.get("id") === activeObject?.get("id")
    );

    if (key === "fill") {
      activeObject.set("prevFill", activeObject?.get("fill"));
    }

    activeObject?.set(key, preparedValue);

    const copyOfObjects = [...objects];
    copyOfObjects[index] = activeObject;

    setObjects(copyOfObjects);

    setSelectTextObject((prev) => {
      return {
        ...prev,
        [key]: preparedValue,
        ...(key === "fill" && { prevFill: activeObject?.get("prevFill") }),
      };
    });

    canvas.requestRenderAll();
  };

  const onRemoveMethod = () => {
    setCurrentMethod("about-product");
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

  const setActiveObject = (obj: FabricObject) => {
    if (!canvas) {
      return;
    }

    canvas.setActiveObject(obj);
    canvas.renderAll();
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
        currentMethod,
        setCurrentMethod,
        objects,
        setObjects,
        setActiveObject,
      }}
    >
      <div className="relative flex h-full">
        <Aside className="w-20" />
        <ActiveToolProperties className="w-[350px]" />
        <div ref={canvasContainerRef} className="flex-1">
          <MyCanvas {...size} />
        </div>

        <ObjectContextMenu
          isOpen={isOpenObjectContextMenu}
          ref={objectContextMenuRef}
          onHandleAnimationComplete={onHandleAnimationComplete}
        />
      </div>
    </TShirtEditorContext.Provider>
  );
};

export default TShirtEditor;
