import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  TShirtAvailableShapeType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";
import { ITextProps, RectProps } from "fabric";

type TShirtEditorContextType = {
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
  activeProperty: "font-list" | "closed";
  setActiveProperty: Dispatch<SetStateAction<"font-list" | "closed">>;
  handleRectPropChanges: (key: keyof RectProps, value: any) => void;
  currentMethod: TShirtEditorMethodType;
  setCurrentMethod: Dispatch<SetStateAction<TShirtEditorMethodType>>;
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
