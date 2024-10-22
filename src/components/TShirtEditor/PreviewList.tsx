import React from "react";
import { useTShirtEditor } from "./Context";
import Image from "next/image";

const PreviewList = () => {
  const { output } = useTShirtEditor();
  return (
    <div className="flex flex-col gap-2">
      {output.map(({ image }, i) => (
        <div key={i} className="shadow-md cursor-pointer rounded-md p-3">
          <Image src={image} alt="text" width={100} height={100} />
        </div>
      ))}
    </div>
  );
};

export default PreviewList;
