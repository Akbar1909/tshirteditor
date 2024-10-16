import { useTShirtEditor } from "./Context";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

const TextObjectsList = () => {
  const { objects, setActiveProperty, setActiveObject, onHandleMethod } =
    useTShirtEditor();

  return (
    <div>
      <div className="border-b py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Texts</h3>
      </div>
      <div className="mt-10">
        {objects
          .filter((obj) => obj.type === "textbox")
          .map((obj, i) => (
            <div
              className="border-b py-3 flex items-center justify-between"
              key={i}
            >
              {obj.get("text")}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveObject(obj);
                    setActiveProperty("closed");
                  }}
                >
                  <FaRegEdit fontSize={16} />
                </button>
                <button>
                  <FaRegTrashAlt fontSize={16} />
                </button>
              </div>
            </div>
          ))}

        <div className="w-full flex items-center justify-center py-5">
          <button
            onClick={() => {
              onHandleMethod({ name: "add-text" });
              setActiveProperty("closed");
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextObjectsList;
