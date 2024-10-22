import { Canvas, StaticCanvas } from "fabric";
import { useCallback, useEffect, useState } from "react";

const usePreviewCanvas = () => {
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

      setPreviewSvg(canvas.toSVG());
    },
    [previewCanvas]
  );

  return {
    updatePreview,
    previewSvg,
  };
};

export default usePreviewCanvas;
