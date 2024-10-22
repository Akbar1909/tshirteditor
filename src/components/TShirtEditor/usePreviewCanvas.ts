import { Canvas, StaticCanvas } from "fabric";
import { useCallback, useEffect, useState } from "react";

const usePreviewCanvas = (setOutput: any, activeIndex: number) => {
  const [previewSvg, setPreviewSvg] = useState("");
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

      const activeIndex = Number(localStorage.getItem("activeIndex"));

      setOutput((prev) => {
        return {
          ...prev,
          [activeIndex]: {
            ...prev[activeIndex],
            svg: canvas.toSVG(),
          },
        };
      });
    },
    [setOutput]
  );

  return {
    updatePreview,
    previewSvg,
  };
};

export default usePreviewCanvas;
