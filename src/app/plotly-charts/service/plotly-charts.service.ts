import { Injectable } from '@angular/core';

import { PlotlyInfo } from '../shared/plotlyInfo';
import { PlotlyQuery } from '../shared/plotlyQuery';

@Injectable()
export class PlotlyChartsService {

  chartTypes = ['line', '3dsurface', 'bar'];

  constructor() { }

  getChartTypes() {
    return this.chartTypes;
  }

}
