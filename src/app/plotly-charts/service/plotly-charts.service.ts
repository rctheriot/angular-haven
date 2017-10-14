import { Injectable } from '@angular/core';

import { PlotlyInfo } from '../shared/plotlyInfo';
import { PlotlyQuery } from '../shared/plotlyQuery';

@Injectable()
export class PlotlyChartsService {

  capacityXRange: [number, number];
  capacityYRange: [number, number];

  constructor() {
    this.capacityXRange = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    this.capacityYRange = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
   }

  getCapacityXRange(range: [number, number]) {
    let min = Math.min(range[0], this.capacityXRange[0]);
    let max = Math.max(range[1], this.capacityXRange[1]);
    min -= ((max - min) * 0.05);
    max += ((max - min) * 0.05);
    this.capacityXRange = [min, max];
    return this.capacityXRange;
  }
  getCapacityYRange(range: [number, number]) {
    let min = Math.min(range[0], this.capacityYRange[0]);
    let max = Math.max(range[1], this.capacityYRange[1]);
    min -= ((max - min) * 0.05);
    max += ((max - min) * 0.05);
    this.capacityYRange = [min, max];
    return this.capacityYRange;
  }


}
