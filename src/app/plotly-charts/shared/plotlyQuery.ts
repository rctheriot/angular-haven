export class PlotlyQuery {
  valueType: string;
  chartType: string;
  scenario: string;
  scope: string;
  year: number;
  month: number;
  day: number;

  constructor(valueType: string, chartType: string, scenario: string, scope: string, year: number, month: number, day: number) {
    this.valueType = valueType.toLocaleLowerCase();
    this.chartType = chartType.toLocaleLowerCase();
    this.scenario = scenario.toLocaleLowerCase();
    this.scope = scope.toLocaleLowerCase();
    this.year = year;
    this.month = month;
    this.day = day;
  }
}
