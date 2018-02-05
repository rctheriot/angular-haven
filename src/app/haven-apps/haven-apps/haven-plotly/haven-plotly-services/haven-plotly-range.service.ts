import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { HavenRange, PlotlyRange } from '../haven-plotly-shared/haven-range';

@Injectable()
export class HavenPlotlyRangeService {

  ranges = Array<HavenRange>();

  constructor() { }


  addRange(rangeName: string, range: PlotlyRange): Number {
    for (let i = 0; i < this.ranges.length; i++) {
      if (this.ranges[i].rangeName === rangeName) {
        return this.ranges[i].addRange(range.xrange, range.yrange);
      }
    }
    const newRange = new HavenRange(rangeName);
    this.ranges.push(newRange);
    return newRange.addRange(range.xrange, range.yrange);

  }

  removeRange(rangeName: string, id: number) {
    for (let i = 0; i < this.ranges.length; i++) {
      if (this.ranges[i].rangeName === rangeName) {
        this.ranges[i].removeId(id);
      }
    }
  }

  getRangeObserver(rangeName: string): Subject<PlotlyRange> {
    for (let i = 0; i < this.ranges.length; i++) {
      if (this.ranges[i].rangeName === rangeName) {
        return this.ranges[i].getObserver();
      }
    }
  }
  updateRange(rangeName: string) {
    for (let i = 0; i < this.ranges.length; i++) {
      if (this.ranges[i].rangeName === rangeName) {
        this.ranges[i].updateRange();
      }
    }
  }

}
