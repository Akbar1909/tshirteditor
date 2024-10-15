import React, { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { IoCopyOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { motion } from "framer-motion";

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
          <button className="flex items-center justify-center h-full px-2 border-r duration-150 hover:scale-105 transition-all hover:bg-slate-100">
            <IoCopyOutline fontSize={24} />
          </button>
          <button className="flex items-center justify-center h-full px-2 border-r">
            <IoTrashOutline fontSize={24} />
          </button>
        </motion.div>
      </motion.div>
    );
  }
);

ObjectContextMenu.displayName = "ObjectContextMenu";

export default ObjectContextMenu;
