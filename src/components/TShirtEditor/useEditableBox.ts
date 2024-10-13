// hooks/useEditableBox.js

import { useRef } from "react";
import { Rect, IText, Group, Canvas } from "fabric";

const useEditableBox = (canvas: Canvas) => {
  const addEditableBox = () => {
    // Create a rectangle object
    const rectangle = new Rect({
      left: 50,
      top: 50,
      fill: "rgba(0, 0, 255, 0.5)",
      width: 200,
      height: 100,
    });

    // Create editable text object
    const editableText = new IText("Editable Text", {
      fontFamily: "Comic Sans",
      fontSize: 14,
      stroke: "#000",
      strokeWidth: 1,
      fill: "#000",
      left: 150,
      top: 60,
    });

    // Handle text editing exit
    editableText.on("editing:exited", function () {
      regroup(); // Regroup after editing
    });

    // Create a group for the rectangle and editable text
    const group = new Group([rectangle, editableText], {
      left: 50,
      top: 50,
    });

    // Add the group to the canvas
    canvas.add(group);

    // Handle double-click to edit text
    group.on(
      "mousedown",
      fabricDblClick(group, () => {
        ungroup(group);
        canvas.setActiveObject(editableText);
        editableText.enterEditing();
        editableText.selectAll();
      })
    );
  };

  // Double-click event handler
  const fabricDblClick = (obj, handler) => {
    return function () {
      if (obj.clicked) {
        handler(obj);
      } else {
        obj.clicked = true;
        setTimeout(() => {
          obj.clicked = false;
        }, 500);
      }
    };
  };

  // Ungroup objects in the group
  const ungroup = (group: Group) => {
    canvas.remove(group);

    canvas.add(...group.removeAll());

    canvas.renderAll();
  };

  // Regroup after editing finishes
  const regroup = () => {
    const items = [];
    canvas.forEachObject((obj) => {
      items.push(obj);
      canvas.remove(obj);
    });
    const grp = new Group(items.reverse(), {});
    canvas.add(grp);
    return grp;
  };

  return { addEditableBox };
};

export default useEditableBox;
