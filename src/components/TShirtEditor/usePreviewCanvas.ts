import { Canvas } from "fabric";
import { useCallback, useEffect, useState } from "react";

const usePreviewCanvas = (setOutput: any, activeId: number) => {
  const [previewCanvas, setPreviewCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (previewCanvas) {
      return;
    }

    (async () => {
      const tempPreviewCanvas = new Canvas("preview-canvas");

      setPreviewCanvas(tempPreviewCanvas);
    })();

    return () => {
      if (previewCanvas) {
        previewCanvas.dispose();
      }
    };
  }, [previewCanvas]);

  const updatePreview = useCallback(
    (canvas: Canvas) => {
      // Get the data URL of the main canvas

      if (!canvas) {
        return;
      }

      const id = Number(localStorage.getItem("activeId"));

      setOutput((prev) => {
        return {
          ...prev,
          [id]: {
            ...prev[id],
            svg: canvas.toSVG(),
          },
        };
      });
    },
    [setOutput]
  );

  return {
    updatePreview,
  };
};

export default usePreviewCanvas;
