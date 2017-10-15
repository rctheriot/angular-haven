export class PlotlyQuery {
  value: string;
  type: string;
  scenario: string;
  scope: string;
  year: number;
  month: number;
  day: number;

  constructor(value: string, type: string, scenario: string, scope: string, year: number, month: number, day: number) {
    this.value = value.toLocaleLowerCase();
    this.type = type.toLocaleLowerCase();
    this.scenario = scenario.toLocaleLowerCase();
    this.scope = scope.toLocaleLowerCase();
    this.year = year;
    this.month = month;
    this.day = day;
  }
}
