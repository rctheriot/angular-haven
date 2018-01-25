export class HavenFirestoreQuery {
    dataset: string
    year: any;
    month: any;
    day: any;
    scope: string;
    scenario: string;
    type: string;
    load: string;
    consolidate: boolean;

    constructor(year: number, month: number, day: number, scope: string, scenario: string, type: string, load: string, consolidate: boolean) {
      this.year = year;
      this.month = month;
      this.day = day;
      this.scope = scope;
      this.scenario = scenario;
      this.type = type;
      this.load = load;
      this.consolidate = consolidate;
    }
}
