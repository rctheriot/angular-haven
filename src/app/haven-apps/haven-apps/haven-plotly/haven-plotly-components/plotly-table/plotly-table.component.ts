import { Component, OnInit, OnDestroy, SimpleChanges, SimpleChange, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyRange } from '../../haven-plotly-shared/haven-range';
import { PlotlyData } from '../../haven-plotly-shared/plotlyData';
import { PlotlyQuery } from '../../haven-plotly-shared/plotlyQuery';

import { HavenPlotlyQueryService } from '../../haven-plotly-services/haven-plotly-query.service';
import { HavenDateSelectorService } from '../../../../../haven-shared/haven-services/haven-date-selector.service';

import { HavenAppInterface } from '../../../../haven-apps-shared/haven-app-interface';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-plotly-table',
  templateUrl: './plotly-table.component.html',
  styleUrls: ['./plotly-table.component.css']
})
export class PlotlyTableComponent implements HavenAppInterface, OnInit, OnDestroy {

  appInfo: any;
  plotlyData: PlotlyData;
  rangeId: number;

  public headerColors = {
    'Fossil': '#de4c4c',
    'BioFuel': '#a6761d',
    'Biomass': '#66a61e',
    'Solar': '#e48814',
    'DGPV': '#e0cf52',
    'Wind': '#7570b3',
    'Offshore Wind': '#1b9e77',
    'Load': '#666666',
  }

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;

  dateSelSub: any;

  displayedColumns = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private havenPlotlyQueryService: HavenPlotlyQueryService,
    private havenDateSelectorService: HavenDateSelectorService) { }

  ngOnInit() {
    this.getData();
    this.dateSelSub = this.havenDateSelectorService.ScenarioProfilesSubs[this.appInfo.query.firestoreQuery.scenario].subscribe((profile) => {
      if (!this.appInfo.windowLock) {
        this.loaded = false;
        this.appInfo.query.firestoreQuery.year = profile.year;
        this.appInfo.query.firestoreQuery.month = profile.month;
        this.appInfo.query.firestoreQuery.day = profile.day;
        this.havenPlotlyQueryService.UpdateWindowName(this.appInfo.winId, this.appInfo.query.firestoreQuery);
        this.getData();
      }
    })
  }

  ngOnDestroy() {
    this.dateSelSub.unsubscribe();
  }

  getData() {
    this.havenPlotlyQueryService.getData(this.appInfo.query).then((data) => {
      this.formatData(data.data);
      this.loaded = true;
      this.changeDetector.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  formatData(data: any) {
    const newdata = [];
    for (const element in data) {
      const newEle = { Time: element }
      for (const innerElement in data[element]) {
        newEle[innerElement] = data[element][innerElement].toFixed(1);
      }
      this.displayedColumns = [];
      for (const name in newEle) {
        this.displayedColumns.push(name);
      }
      newdata.push(newEle);
    }
    this.dataSource.data = newdata;
  }

  resize() {
    if (this.loaded) {

    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}



