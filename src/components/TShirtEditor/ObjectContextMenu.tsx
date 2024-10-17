import React, {
  ComponentPropsWithRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { IoCopyOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { IoPlaySkipForwardOutline } from "react-icons/io5";
import { LiaStepBackwardSolid } from "react-icons/lia";
import { motion } from "framer-motion";
import { useTShirtEditor } from "./Context";
import { TbStackBackward } from "react-icons/tb";
import { TbStackForward } from "react-icons/tb";

type elementRef = ComponentPropsWithRef<"div">["ref"];

interface ObjectContextMenuProps {
  isOpen: boolean;
  onHandleAnimationComplete: () => void;
}

const ObjectContextMenu = forwardRef(
  (
    { isOpen, onHandleAnimationComplete }: ObjectContextMenuProps,
    elementRef: elementRef
  ) => {
    const { cloneObject, deleteObject, bringObjectToFront, sendObjectToBack } =
      useTShirtEditor();
    const [confirmation, setConfirmation] = useState<
      "idle" | "delete-confirmation"
    >("idle");

    useEffect(() => {
      if (!isOpen) {
        setConfirmation("idle");
      }
    }, [isOpen]);

    return (
      <motion.div
        className={twMerge("absolute  w-52 h-8")}
        ref={elementRef}
        animate={{
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.7, ease: "linear" }}
      >
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          className="flex items-center overflow-hidden h-full bg-white border rounded-md"
          animate={{
            width: isOpen ? "13rem" : "0", // w-52 in tailwind is 13rem
            opacity: isOpen ? 1 : 0, // Fade in/out,
          }}
          transition={{ duration: 0.7, ease: "backInOut" }}
          onAnimationComplete={(definition) => {
            if (definition.opacity !== 1) {
              onHandleAnimationComplete();
            }
          }}
        >
          <motion.button
            onClick={cloneObject}
            className={twMerge(
              "flex items-center justify-center h-full px-2 border-r duration-150 hover:scale-105 transition-all hover:bg-slate-100",
              confirmation === "delete-confirmation" &&
                "w-0 overflow-hidden px-0 border-none"
            )}
          >
            <IoCopyOutline fontSize={24} />
          </motion.button>

          <motion.div
            className={twMerge(
              "w-0 overflow-hidden",
              confirmation === "delete-confirmation" &&
                "w-18 flex items-center h-full"
            )}
          >
            <button
              onClick={() => deleteObject()}
              className="px-2 h-full bg-green-600 text-white"
            >
              Ha
            </button>
            <button
              onClick={() => setConfirmation("idle")}
              className="px-2 h-full bg-red-600 text-white"
            >
              Yo'q
            </button>
          </motion.div>
          <motion.button
            onClick={() => {
              setConfirmation("delete-confirmation");
            }}
            className={twMerge(
              "flex items-center justify-center h-full px-2 border-r",
              confirmation === "delete-confirmation" &&
                "w-0 overflow-hidden px-0 border-none"
            )}
          >
            <IoTrashOutline fontSize={24} />
          </motion.button>
          <motion.button
            onClick={() => {
              bringObjectToFront();
            }}
            className={twMerge(
              "flex items-center justify-center h-full px-2 border-r"
            )}
          >
            <TbStackForward fontSize={24} />
          </motion.button>
          <motion.button
            onClick={() => {
              sendObjectToBack();
            }}
            className={twMerge(
              "flex items-center justify-center h-full px-2 border-r"
            )}
          >
            <TbStackBackward fontSize={24} />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }
);

ObjectContextMenu.displayName = "ObjectContextMenu";

export default ObjectContextMenu;
