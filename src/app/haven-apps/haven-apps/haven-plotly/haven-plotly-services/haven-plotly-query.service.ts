import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'

import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { HavenFirestoreQueryService } from '../../../../haven-shared/haven-services/haven-firestore-query.service';

import { PlotlyData } from '../haven-plotly-shared/plotlyData';
import { PlotlyQuery } from '../haven-plotly-shared/plotlyQuery';

@Injectable()
export class HavenPlotlyQueryService {

  private dbRef;

  public plotlyColors = {
    'Fossil': '#d95f02',
    'BioFuel': '#a6761d',
    'Biomass': '#66a61e',
    'Solar': '#e6ab02',
    'Wind': '#7570b3',
    'Offshore Wind': '#1b9e77',
    'Load': '#666666',
  }

  constructor(private fsQueryService: HavenFirestoreQueryService) { }

  getData(query: PlotlyQuery): Promise<PlotlyData> {
    switch (query.firestoreQuery.type) {
      case 'capacity':
        return this.getCapacity(query);
      case 'load':
        return this.getLoad(query);
      case 'supply':
        return this.getSupply(query);
    }
  }

  private getCapacity(query: PlotlyQuery): Promise<PlotlyData> {
    return this.fsQueryService.getCapacity(query.firestoreQuery).then(capacityData => {
      const plotlyData = new PlotlyData();
      plotlyData.data = capacityData;
      plotlyData.xAxisLabel = 'Time';
      plotlyData.yAxisLabel = 'Capacity MW';
      return Promise.resolve(plotlyData);
    })
  }

  private getLoad(query: PlotlyQuery): Promise<PlotlyData> {
    return this.fsQueryService.getLoad(query.firestoreQuery).then(loadData => {
      const plotlyData = new PlotlyData();
      plotlyData.data = loadData;
      plotlyData.xAxisLabel = 'Time';
      plotlyData.yAxisLabel = 'Load MWh';
      return Promise.resolve(plotlyData);
    })
  }

  private getSupply(query: PlotlyQuery): Promise<PlotlyData> {
    return this.fsQueryService.getSupply(query.firestoreQuery).then(supplyData => {
      const plotlyData = new PlotlyData();
      plotlyData.data = supplyData;
      plotlyData.xAxisLabel = 'Time';
      plotlyData.yAxisLabel = 'Suppy MWh';
      return Promise.resolve(plotlyData);
    })
  }

}
