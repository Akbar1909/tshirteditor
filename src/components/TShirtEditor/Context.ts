import { createContext, useContext } from "react";
import {
  SelectedTextObjectType,
  TShirtEditorMethodType,
} from "./TshirtEditor.types";

type TShirtEditorContextType = {
  onRemoveMethod: (method: TShirtEditorMethodType) => void;
  onHandleMethod: ({ name }: { name: TShirtEditorMethodType }) => void;
  onHandleTextChange: (
    key: keyof SelectedTextObjectType,
    value: any
  ) => Promise<void>;
  selectedTextObject: SelectedTextObjectType;
  addImage: (file: File) => void;
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
