import React, { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { CiText } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TShirtEditorMethodType } from "./TshirtEditor.types";
import { useTShirtEditor } from "./Context";

interface AsideProps extends ComponentPropsWithoutRef<"aside"> {}

const Aside = ({ className, ...computedProps }: AsideProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const method = (searchParams.get("method") ||
    "about-product") as TShirtEditorMethodType;

  const { onHandleMethod } = useTShirtEditor();

  const handleMethod = (method: TShirtEditorMethodType) => {
    onHandleMethod({ name: "add-text" });
    const params = new URLSearchParams(searchParams);
    params.set("method", method);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className={twMerge("border-l pt-20", className)} {...computedProps}>
      <div
        role="button"
        onClick={() => handleMethod("add-text")}
        className={twMerge(
          "flex px-2 py-3 group rounded-xl flex-col gap-2 items-center cursor-pointer hover:bg-blue-300  transition-all duration-200",
          method === "add-text" && "bg-blue-200 text-white"
        )}
      >
        <CiText
          fontSize={30}
          className="group-hover:text-white font-bold"
          fontFamily="bold"
        />
        <span className="text-xs font-bold group-hover:text-white">
          Add text
        </span>
      </div>
      <div
        role="button"
        onClick={() => handleMethod("image")}
        className={twMerge(
          "flex px-2 py-3 group rounded-xl flex-col gap-2 items-center cursor-pointer hover:bg-blue-300  transition-all duration-200",
          method === "image" && "bg-blue-200 text-white"
        )}
      >
        <CiImageOn
          fontSize={30}
          className="group-hover:text-white font-bold"
          fontFamily="bold"
        />
        <span className="text-xs font-bold group-hover:text-white">Image</span>
      </div>
    </aside>
  );
};

export default Aside;
