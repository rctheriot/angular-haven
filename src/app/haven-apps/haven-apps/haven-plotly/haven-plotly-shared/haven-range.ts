import { Subject } from 'rxjs/Subject';

export class HavenRange {

  currentId = 0;
  rangeArray = Array<PlotlyRange>();
  private rangeObserver = new Subject<PlotlyRange>();
  rangeName = ''

  constructor(rangeName: string) {
    this.rangeName = rangeName;
  }

  getObserver() {
    return this.rangeObserver;
  }

  addRange(rangex: [number, number], rangey: [number, number]) {
    this.rangeArray.push(new PlotlyRange(++this.currentId, rangex, rangey));
    this.updateRange();
    return this.currentId;
  }

  removeId(id: number) {
    for (let i = 0; i < this.rangeArray.length; i++) {
      if (this.rangeArray[i].id === id) {
        this.rangeArray.splice(i, 1);
        this.updateRange();
        break;
      }
    }
  }

  updateRange() {
    let x = [];
    let y = [];
    this.rangeArray.forEach(el => { x = x.concat(el.xrange) });
    this.rangeArray.forEach(el => { y = y.concat(el.yrange) });
    const rangeX: [number, number] = [Math.min(...x), Math.max(...x)];
    const rangeY: [number, number] = [Math.min(...y), Math.max(...y)];
    if (rangeX[0] > 0 ) { rangeX[0] = 0; }
    if (rangeY[0] > 0 ) { rangeY[0] = 0; }
    this.rangeObserver.next(new PlotlyRange(null, rangeX, rangeY));
  }

}

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

