import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  TShirtAvailableShapeType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";
import { FabricObject, ImageProps, ITextProps, RectProps } from "fabric";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";

export type TShirtEditorContextType = {
  onRemoveMethod: () => void;
  onHandleMethod: ({ name }: { name: TShirtEditorMethodType }) => void;
  onHandleTextChange: (key: keyof ITextProps, value: any) => Promise<void>;
  selectedTextObject: Partial<ITextProps>;
  onAddShape: (name: TShirtAvailableShapeType) => void;
  addImage: (file: File) => void;
  setActiveShapeName: Dispatch<
    SetStateAction<TShirtAvailableShapeType | "idle">
  >;
  activeShapeName: TShirtAvailableShapeType | "idle";
  selectedRectObject: Partial<RectProps>;
  activeProperty: "font-list" | "closed" | "text-object-list" | "image-detail";
  setActiveProperty: Dispatch<
    SetStateAction<"font-list" | "closed" | "text-object-list" | "image-detail">
  >;
  handleRectPropChanges: (key: keyof RectProps, value: any) => void;
  currentMethod: TShirtEditorMethodType;
  setCurrentMethod: Dispatch<SetStateAction<TShirtEditorMethodType>>;
  setObjects: Dispatch<SetStateAction<FabricObject[]>>;
  objects: FabricObject[];
  setActiveObject: (obj: FabricObject) => void;
  cloneObject: () => Promise<void>;
  deleteObject: () => void;
  selectedImageObject: Partial<ImageProps>;
  setSelectedImageObject: Dispatch<SetStateAction<Partial<ImageProps>>>;
  bringObjectToFront: () => void;
  sendObjectToBack: () => void;
  output: {
    image: string;
    group: Group | null;
  }[];
};

export const TShirtEditorContext =
  createContext<null | TShirtEditorContextType>(null);

export const useTShirtEditor = () => {
  const context = useContext(TShirtEditorContext);

  if (!context) {
    throw new Error("Wrap");
  }

  return context;
};
