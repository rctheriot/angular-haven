export class PlotlyRange {
  id: number;
  xrange: [number, number];
  yrange: [number, number];

  constructor(id: number, xrange: [number, number], yrange: [number, number]) {
    this.id = id;
    this.xrange = xrange;
    this.yrange = yrange;
  }

}
