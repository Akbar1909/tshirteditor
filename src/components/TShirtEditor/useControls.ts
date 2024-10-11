import { Canvas } from "fabric";
import { RefObject, useEffect } from "react";

const useControls = (ref: RefObject<Canvas>) => {
  const canvas = ref.current;

  function addDeleteBtn(x, y) {}

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const activeObject = canvas.getActiveObject();
  }, [canvas]);
};

export default useControls;
