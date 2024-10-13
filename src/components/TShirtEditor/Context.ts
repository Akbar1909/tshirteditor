import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  TShirtAvailableShapeType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";
import { FabricObject, ITextProps, RectProps } from "fabric";

export type TShirtEditorContextType = {
  onRemoveMethod: () => void;
  onHandleMethod: ({ name }: { name: TShirtEditorMethodType }) => void;
  onHandleTextChange: (key: keyof ITextProps, value: any) => Promise<void>;
  selectedTextObject: ITextProps;
  onAddShape: (name: TShirtAvailableShapeType) => void;
  addImage: (file: File) => void;
  setActiveShapeName: Dispatch<
    SetStateAction<TShirtAvailableShapeType | "idle">
  >;
  activeShapeName: TShirtAvailableShapeType | "idle";
  selectedRectObject: Partial<RectProps>;
  activeProperty: "font-list" | "closed" | "text-object-list";
  setActiveProperty: Dispatch<
    SetStateAction<"font-list" | "closed" | "text-object-list">
  >;
  handleRectPropChanges: (key: keyof RectProps, value: any) => void;
  currentMethod: TShirtEditorMethodType;
  setCurrentMethod: Dispatch<SetStateAction<TShirtEditorMethodType>>;
  setObjects: Dispatch<SetStateAction<FabricObject[]>>;
  objects: FabricObject[];
  setActiveObject: (obj: FabricObject) => void;
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
