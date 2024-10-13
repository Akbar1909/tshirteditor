import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  SelectedTextObjectType,
  TShirtAvailableShapeType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";
import { ITextProps, RectProps } from "fabric";

type TShirtEditorContextType = {
  onRemoveMethod: (method: TShirtEditorMethodType) => void;
  onHandleMethod: ({ name }: { name: TShirtEditorMethodType }) => void;
  onHandleTextChange: (key: keyof ITextProps, value: any) => Promise<void>;
  selectedTextObject: ITextProps;
  onAddShape: (name: TShirtAvailableShapeType) => void;
  addImage: (file: File) => void;
  setActiveShapeName: SetStateAction<
    Dispatch<TShirtAvailableShapeType | "idle">
  >;
  activeShapeName: TShirtAvailableShapeType | "idle";
  selectedRectObject: Partial<RectProps>;
  activeProperty: "font-list" | "closed";
  setActiveProperty: SetStateAction<Dispatch<"font-list" | "closed">>;
  handleRectPropChanges: (key: keyof RectProps, value: any) => void;
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
