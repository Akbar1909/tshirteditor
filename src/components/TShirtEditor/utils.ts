/* eslint-disable @typescript-eslint/no-explicit-any */
import { util } from "fabric";
export const loadFont = (fontName: string, fontUrl: string) => {
  return new Promise((resolve, reject) => {
    const font = new FontFace(fontName, `url(${fontUrl})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        resolve("");
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function renderIcon(icon: any) {
  return function (
    ctx: any,
    left: any,
    top: any,
    _styleOverride,
    fabricObject
  ) {
    const size = this.cornerSize || 40;

    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

export function deleteObject(_eventData, transform) {
  const canvas = transform.target.canvas;
  canvas.remove(transform.target);
  canvas.requestRenderAll();
}

export function cloneObject(
  _eventData,
  transform,
  events?: Record<PropertyKey, any>
) {
  const canvas = transform.target.canvas;
  transform.target.clone().then((cloned) => {
    cloned.left += 10;
    cloned.top += 10;
    Object.entries(events || {}).forEach(([key, func]) => {
      cloned.on(key, (e) => func(e, cloned));
    });
    cloned.controls.deleteControl = transform.target.controls.deleteControl;
    cloned.controls.cloneControl = transform.target.controls.cloneControl;
    canvas.add(cloned);
  });
}

export const deleteIcon =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20x%3D%220px%22%20y%3D%220px%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20fill%3D%22%23f37e98%22%20d%3D%22M25%2C30l3.645%2C47.383C28.845%2C79.988%2C31.017%2C82%2C33.63%2C82h32.74c2.613%2C0%2C4.785-2.012%2C4.985-4.617L75%2C30%22%3E%3C%2Fpath%3E%3Cpath%20fill%3D%22%23f15b6c%22%20d%3D%22M65%2038v35c0%201.65-1.35%203-3%203s-3-1.35-3-3V38c0-1.65%201.35-3%203-3S65%2036.35%2065%2038zM53%2038v35c0%201.65-1.35%203-3%203s-3-1.35-3-3V38c0-1.65%201.35-3%203-3S53%2036.35%2053%2038zM41%2038v35c0%201.65-1.35%203-3%203s-3-1.35-3-3V38c0-1.65%201.35-3%203-3S41%2036.35%2041%2038zM77%2024h-4l-1.835-3.058C70.442%2019.737%2069.14%2019%2067.735%2019h-35.47c-1.405%200-2.707.737-3.43%201.942L27%2024h-4c-1.657%200-3%201.343-3%203s1.343%203%203%203h54c1.657%200%203-1.343%203-3S78.657%2024%2077%2024z%22%3E%3C%2Fpath%3E%3Cpath%20fill%3D%22%231f212b%22%20d%3D%22M66.37%2083H33.63c-3.116%200-5.744-2.434-5.982-5.54l-3.645-47.383%201.994-.154%203.645%2047.384C29.801%2079.378%2031.553%2081%2033.63%2081H66.37c2.077%200%203.829-1.622%203.988-3.692l3.645-47.385%201.994.154-3.645%2047.384C72.113%2080.566%2069.485%2083%2066.37%2083zM56%2020c-.552%200-1-.447-1-1v-3c0-.552-.449-1-1-1h-8c-.551%200-1%20.448-1%201v3c0%20.553-.448%201-1%201s-1-.447-1-1v-3c0-1.654%201.346-3%203-3h8c1.654%200%203%201.346%203%203v3C57%2019.553%2056.552%2020%2056%2020z%22%3E%3C%2Fpath%3E%3Cpath%20fill%3D%22%231f212b%22%20d%3D%22M77%2C31H23c-2.206%2C0-4-1.794-4-4s1.794-4%2C4-4h3.434l1.543-2.572C28.875%2C18.931%2C30.518%2C18%2C32.265%2C18h35.471c1.747%2C0%2C3.389%2C0.931%2C4.287%2C2.428L73.566%2C23H77c2.206%2C0%2C4%2C1.794%2C4%2C4S79.206%2C31%2C77%2C31z%20M23%2C25c-1.103%2C0-2%2C0.897-2%2C2s0.897%2C2%2C2%2C2h54c1.103%2C0%2C2-0.897%2C2-2s-0.897-2-2-2h-4c-0.351%2C0-0.677-0.185-0.857-0.485l-1.835-3.058C69.769%2C20.559%2C68.783%2C20%2C67.735%2C20H32.265c-1.048%2C0-2.033%2C0.559-2.572%2C1.457l-1.835%2C3.058C27.677%2C24.815%2C27.351%2C25%2C27%2C25H23z%22%3E%3C%2Fpath%3E%3Cpath%20fill%3D%22%231f212b%22%20d%3D%22M61.5%2025h-36c-.276%200-.5-.224-.5-.5s.224-.5.5-.5h36c.276%200%20.5.224.5.5S61.776%2025%2061.5%2025zM73.5%2025h-5c-.276%200-.5-.224-.5-.5s.224-.5.5-.5h5c.276%200%20.5.224.5.5S73.776%2025%2073.5%2025zM66.5%2025h-2c-.276%200-.5-.224-.5-.5s.224-.5.5-.5h2c.276%200%20.5.224.5.5S66.776%2025%2066.5%2025zM50%2076c-1.654%200-3-1.346-3-3V38c0-1.654%201.346-3%203-3s3%201.346%203%203v25.5c0%20.276-.224.5-.5.5S52%2063.776%2052%2063.5V38c0-1.103-.897-2-2-2s-2%20.897-2%202v35c0%201.103.897%202%202%202s2-.897%202-2v-3.5c0-.276.224-.5.5-.5s.5.224.5.5V73C53%2074.654%2051.654%2076%2050%2076zM62%2076c-1.654%200-3-1.346-3-3V47.5c0-.276.224-.5.5-.5s.5.224.5.5V73c0%201.103.897%202%202%202s2-.897%202-2V38c0-1.103-.897-2-2-2s-2%20.897-2%202v1.5c0%20.276-.224.5-.5.5S59%2039.776%2059%2039.5V38c0-1.654%201.346-3%203-3s3%201.346%203%203v35C65%2074.654%2063.654%2076%2062%2076z%22%3E%3C%2Fpath%3E%3Cpath%20fill%3D%22%231f212b%22%20d%3D%22M59.5%2045c-.276%200-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5s.5.224.5.5v2C60%2044.776%2059.776%2045%2059.5%2045zM38%2076c-1.654%200-3-1.346-3-3V38c0-1.654%201.346-3%203-3s3%201.346%203%203v35C41%2074.654%2039.654%2076%2038%2076zM38%2036c-1.103%200-2%20.897-2%202v35c0%201.103.897%202%202%202s2-.897%202-2V38C40%2036.897%2039.103%2036%2038%2036z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E";

export const cloneIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABTklEQVR4nO3asUrDUBTG8aAVHO3e0c1XcHBwdRLEyUUo1ODm6JCxm+DmG4ijnaSDD1A6SLNJN6cWRLoJwl+EiBBBk/Scm5vb88E3hssv5+YGQqLI0qAA68A5MAJmwKtyTzUQa8AdbhNrQI4cI9Qgt6FAHnOLXAP7yu24gMjfLRfBIA2dCLAJnABXwM2SjWuBANvAs/DJlTiFZG/9J2GEPKYAZA/dJK4gXWWIDKYAJMZN+qFAlsN4BqmO8RBSDeMppDzGY8hXLkOBpAbBJqKS1LYWK7y15kC7Yvs+QWaFF/u9dmKQfGwiP3kHhhU75e/Y8bvSx683kIPsA8N3d0pCFrnry3QgBikAbcZ75L8YpIETWYTyjGgmNUjIEzmrETKRhBzWCBlKQraAt5ogPTFIhjkGPhwjHoCWKCTD7AL3wIvizzZzYAxcABviCEskn08EubEJae26DQAAAABJRU5ErkJggg==";

export const deleteImg = () => {
  const image = document.createElement("img");
  image.src = deleteIcon;
  return image;
};

export const cloneImg = () => {
  const image = document.createElement("img");
  image.src = cloneIcon;
  return image;
};
