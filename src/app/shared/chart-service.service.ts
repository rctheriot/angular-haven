import { Injectable } from '@angular/core';
import { Chart } from './chart';
import { CHARTS } from './mock-charts';

@Injectable()
export class ChartServiceService {

  getCharts():  Promise<Chart[]> {
    return Promise.resolve(CHARTS);
  }

}
