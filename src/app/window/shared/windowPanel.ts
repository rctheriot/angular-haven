export class WindowPanel {
  id: number;
  title: string;
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundAlpha: number;
  zindex: number;

  bodyType: string;
  query: any;

  constructor(title: string, bodyType: string, dbquery: any) {
    this.title = title;
    this.left = 200;
    this.top = 200;
    this.width = 500;
    this.height = 500;
    this.backgroundAlpha = 0.5;
    this.zindex = 0;

    this.bodyType = bodyType;
    this.query = dbquery;
  }
}
