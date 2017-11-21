import { HavenFirestoreQuery } from '../../../../haven-shared/haven-services/haven-firestore-query';

export class PlotlyQuery {

  firestoreQuery: HavenFirestoreQuery;
  chartType: string;

  constructor(query: HavenFirestoreQuery, chartType: string) {
    this.firestoreQuery = query;
    this.chartType = chartType
  }

}
