import React, { useEffect, useMemo } from "react";
import { useTShirtEditor } from "./Context";
import { IoMdClose } from "react-icons/io";

const FontList = () => {
  const { onHandleTextChange, onRemoveMethod, setActiveProperty } =
    useTShirtEditor();
  const fonts = useMemo(
    () => [
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
    ],
    []
  );

  // Function to dynamically load fonts
  const loadFont = (label: any, url: any) => {
    const style = document.createElement("style");
    style.innerHTML = `
          @font-face {
            font-family: '${label}';
            src: url('${url}') format('truetype');
            font-display: swap; /* Ensure text remains visible during loading */
          }
        `;
    document.head.appendChild(style);
  };

  // Load fonts in batches when the component mounts
  useEffect(() => {
    const batchSize = 10; // Load 10 fonts at a time
    const loadFontsInBatches = () => {
      for (let i = 0; i < fonts.length; i += batchSize) {
        const batch = fonts.slice(i, i + batchSize);
        batch.forEach(({ label, url }) => loadFont(label, url));
      }
    };

    loadFontsInBatches();
  }, [fonts]);

  return (
    <>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fonts</h3>
        <button onClick={() => setActiveProperty("closed")}>
          <IoMdClose fontSize={20} className="cursor-pointer" />
        </button>
      </div>
      <section className="mt-8">
        {fonts.map(({ label, url }, i) => (
          <div
            key={i}
            role="button"
            onClick={() => {
              onHandleTextChange("fontFamily", { name: label, url });
            }}
            className="cursor-pointer py-2 hover:bg-neutral-100 transition-all duration-200 px-3 rounded-lg"
            style={{
              fontFamily: label,
              fontSize: "20px", // Adjust the font size as needed
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
        ))}
      </section>
    </>
  );
};

export default FontList;
