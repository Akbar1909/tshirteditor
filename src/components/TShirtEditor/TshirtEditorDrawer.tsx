import { Drawer } from "vaul";
import { ToolType } from "./TshirtEditor.types";

interface TshirtEditorDrawerProps {
  tool: ToolType;
  open?: boolean;
  onHandleClose: () => void;
  handleTextObjectChanges: (name: string, e: any) => void;
  textObjectValues: Record<string, any>;
}

const TshirtEditorDrawer = ({
  tool,
  onHandleClose,
  open,
  handleTextObjectChanges,
  textObjectValues,
}: TshirtEditorDrawerProps) => {
  return (
    <Drawer.Root open={open} onRelease={onHandleClose}>
      <Drawer.Portal>
        {/* <Drawer.Overlay className="fixed inset-0 bg-black/10" /> */}
        <Drawer.Content className="bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none">
          <Drawer.Handle />
          <div className="p-4 shadow-lg min-h-[100px]">
            {tool === "text" && (
              <article>
                <input
                  type="number"
                  name="fontSize"
                  value={textObjectValues.fontSize}
                  onChange={(e) => handleTextObjectChanges("text", e)}
                />
                <input
                  type="text"
                  name="text"
                  value={textObjectValues.text}
                  onChange={(e) => handleTextObjectChanges("text", e)}
                />
              </article>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default TshirtEditorDrawer;
