export class WindowPanel {
  id: number;
  title: string;
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundAlpha: number;
  zindex: number;
  color: string;

  bodyType: string;
  query: any;

  constructor(title: string, bodyType: string, dbquery: any, color: string) {
    this.title = title;
    this.left = 200;
    this.top = 200;
    this.width = 500;
    this.height = 500;
    this.backgroundAlpha = 1.0;
    this.zindex = 0;
    this.color = color;

    this.bodyType = bodyType;
    this.query = dbquery;
  }
}
