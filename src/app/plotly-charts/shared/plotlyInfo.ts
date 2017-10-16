import { Subject } from 'rxjs/Subject';
import { PlotlyRange } from '../shared/plotlyRange';

export class PlotlyInfo {
  title: string;
  valueType: string;
  data = [];
  showLegend: boolean;
  xaxisLabel: string;
  yaxisLabel: string;
  rangeObs: Subject<PlotlyRange>;
  layout = {};
}
