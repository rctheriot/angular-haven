export class PlotlyQuery {
  value: string;
  type: string;
  scenario: string;
  scope: string;
  year: number;
  month: number;
  day: number;

  constructor(value: string, type: string, scenario: string, scope: string, year: number, month: number, day: number) {
    this.value = value;
    this.type = type;
    this.scenario = scenario;
    this.scope = scope;
    this.year = year;
    this.month = month;
    this.day = day;
  }
}
