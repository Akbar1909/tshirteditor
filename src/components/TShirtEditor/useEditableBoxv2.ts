import { Group, IText, Rect, Canvas, FabricObject } from "fabric";
import { useRef } from "react";

const useEditableBoxv2 = (canvas: Canvas) => {
  const groupedObjects = useRef<FabricObject[]>([]);

  const deleteObject = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects) return;

    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const ungroupObjects = () => {
    if (!canvas) return;
    const group = canvas.getActiveObject() as Group;
    if (!group) return;
    canvas.remove(group);
    canvas.add(...group.removeAll());
    canvas.requestRenderAll();
  };

  const groupObjects = () => {
    if (!canvas) return;
    const objects = groupedObjects.current;
    deleteObject();
    const group = new Group(objects);
    group.on("mousedblclick", ungroupObjects);
    canvas.add(group);
    canvas.requestRenderAll();
  };

  const addEditableBox = () => {
    const rectangle = new Rect({
      width: 200,
      height: 50,
      fill: "red",
    });

    rectangle.on("selected", groupObjects);

    // Create editable text object
    const editableText = new IText("Editable Text", {
      fontFamily: "Comic Sans",
      fontSize: 14,
      stroke: "#000",
      strokeWidth: 1,
      fill: "#000",
    });

    const group = new Group([rectangle, editableText]);

    groupedObjects.current = group.getObjects();

    editableText.on("editing:exited", groupObjects);
    editableText.on("deselected", groupObjects);

    canvas.add(group);
    group.on("mousedblclick", ungroupObjects);

    canvas.centerObject(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  };

  return {
    addEditableBox,
  };
};

export default useEditableBoxv2;
