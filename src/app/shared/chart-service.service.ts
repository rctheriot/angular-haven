import { Injectable } from '@angular/core';
import { Chart } from './chart';
import { CHARTS } from './mock-charts';

@Injectable()
export class ChartServiceService {

  numberOfCharts = 4;

  getCharts(): Promise<Chart[]> {
    return Promise.resolve(CHARTS);
  }

  removeChart(cid) {
    for (let i = CHARTS.length - 1; i >= 0; i--) {
      if (CHARTS[i].chartid === cid) {
        CHARTS.splice(i, 1);
      }
    }
  }

  addChart(name: string, type: string) {
   CHARTS.push(
    {
      chartid: ++this.numberOfCharts,
      name,
      type,
      view: [400, 400],
    }
   )
  }

}
