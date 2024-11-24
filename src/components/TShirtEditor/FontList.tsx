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
      {
        label: "EduAUVICWANTArrows-VariableFont_wght",
        url: "/fonts/Edu_AU_VIC_WA_NT_Arrows/EduAUVICWANTArrows-VariableFont_wght.ttf",
      },
      {
        label: "Bokor-Regular",
        url: "/fonts/Bokor/Bokor-Regular.ttf",
      },
      {
        label: "Sevillana-Regular",
        url: "/fonts/Sevillana/Sevillana-Regular.ttf",
      },
      {
        label: "Bungee_Spice",
        url: "/fonts/Bungee_Spice/BungeeSpice-Regular.ttf",
      },
      {
        label: "Bebas_Neue",
        url: "/fonts/Bebas_Neue/BebasNeue-Regular.ttf",
      },
      {
        label: "Inconsolata",
        url: "/fonts/Inconsolata/Inconsolata-VariableFont_wdth,wght.ttf",
      },
      {
        label: "Lacquer",
        url: "/fonts/Lacquer/Lacquer-Regular.ttf",
      },
      {
        label: "Doto",
        url: "/fonts/Doto/Doto-VariableFont_ROND,wght.ttf",
      },
      {
        label: "Protest_Revolution",
        url: "/fonts/Protest_Revolution/ProtestRevolution-Regular.ttf",
      },
      {
        label: "Caveat",
        url: "/fonts/Caveat/static/Caveat-Bold.ttf",
      },
      {
        label: "Sarina",
        url: "/fonts/Sarina/Sarina-Regular.ttf",
      },
      {
        label: "Shadows_Into_Light",
        url: "/fonts/Shadows_Into_Light/ShadowsIntoLight-Regular.ttf",
      },
      {
        label: "Satisfy",
        url: "/fonts/Satisfy/Satisfy-Regular.ttf",
      },
      {
        label: "Merienda",
        url: "/fonts/Merienda/static/Merienda-Bold.ttf",
      },
      {
        label: "Orbitron",
        url: "/fonts/Orbitron/static/Orbitron-Bold.ttf",
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
