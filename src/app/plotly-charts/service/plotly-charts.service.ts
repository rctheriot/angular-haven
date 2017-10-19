import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { PlotlyInfo } from '../shared/plotlyInfo';
import { PlotlyQuery } from '../shared/plotlyQuery';
import { PlotlyRange } from '../shared/plotlyRange';

@Injectable()
export class PlotlyChartsService {

  capacityId = 0;
  capacityRanges = Array<PlotlyRange>();
  capacityRangeObs = new Subject<PlotlyRange>();

  demandId = 0
  demandRanges = Array<PlotlyRange>();
  demandRangeObs = new Subject<PlotlyRange>();

  supplyId = 0;
  supplyRanges = Array<PlotlyRange>();
  supplyRangeObs = new Subject<PlotlyRange>();

  constructor() { }

  addRange(rangex: [number, number], rangey: [number, number], valueType: string) {
    if (valueType === 'capacity') {
      this.capacityRanges.push(new PlotlyRange(++this.capacityId, rangex, rangey));
      return this.capacityId;
    } else if (valueType === 'demand') {
      this.demandRanges.push(new PlotlyRange(++this.demandId, rangex, rangey));
      return this.demandId;
    } else if (valueType === 'supply') {
      this.supplyRanges.push(new PlotlyRange(++this.supplyId, rangex, rangey));
      return this.supplyId;
    }
  }

  removeRange(id: number, valueType: string) {
    if (valueType === 'capacity') {
      this.removeId(id, this.capacityRanges);
    } else if (valueType === 'demand') {
      this.removeId(id, this.demandRanges);
    } else if (valueType === 'supply') {
      this.removeId(id, this.supplyRanges);
    }
  }

  private removeId(id: number, array: PlotlyRange[]) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        array.splice(i, 1);
        break;
      }
    }
  }

  updateRanges(valueType: string) {
    let x = [];
    let y = [];
    if (valueType === 'capacity') {
      this.capacityRanges.forEach(el => { x = x.concat(el.xrange) });
      this.capacityRanges.forEach(el => { y = y.concat(el.yrange) });
      const rangeX: [number, number] = [Math.min(...x), Math.max(...x)];
      const rangeY: [number, number] = [Math.min(...y), Math.max(...y)];
      this.capacityRangeObs.next(new PlotlyRange(null, rangeX, rangeY));

    } else if (valueType === 'demand') {
      this.demandRanges.forEach(el => { x = x.concat(el.xrange) });
      this.demandRanges.forEach(el => { y = y.concat(el.yrange) });
      const rangeX: [number, number] = [Math.min(...x), Math.max(...x)];
      const rangeY: [number, number] = [Math.min(...y), Math.max(...y)];
      this.demandRangeObs.next(new PlotlyRange(null, rangeX, rangeY));

    } else if (valueType === 'supply') {
      this.supplyRanges.forEach(el => { x = x.concat(el.xrange) });
      this.supplyRanges.forEach(el => { y = y.concat(el.yrange) });
      const rangeX: [number, number] = [Math.min(...x), Math.max(...x)];
      const rangeY: [number, number] = [Math.min(...y), Math.max(...y)];
      this.supplyRangeObs.next(new PlotlyRange(null, rangeX, rangeY));
    }
  }

}
