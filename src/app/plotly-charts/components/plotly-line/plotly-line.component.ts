import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, SimpleChange, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyInfo } from '../../shared/plotlyInfo';
import { PlotlyRange } from '../../shared/plotlyRange';
import { PlotlyChartsService } from '../../service/plotly-charts.service';

@Component({
  selector: 'app-plotly-line',
  templateUrl: './plotly-line.component.html',
  styleUrls: ['./plotly-line.component.css']
})
export class PlotlyLineComponent implements OnInit, OnDestroy, OnChanges {

  @Input() plotlyInfo: PlotlyInfo;
  @Input() size: [number, number];
  @ViewChild('chart') chartDiv: ElementRef;
  private chart: ElementRef
  loaded = false;
  rangeId: number;

  constructor(private changeDetector: ChangeDetectorRef, private chartService: PlotlyChartsService) { }

  ngOnInit() {
    if (this.plotlyInfo.rangeObs) { this.plotlyInfo.rangeObs.subscribe(range => this.updateRange(range)); }
    this.createChart();
  }

  ngOnDestroy() {
    this.chartService.removeRange(this.rangeId, this.plotlyInfo.valueType);
    this.chartService.removeRange(this.rangeId, this.plotlyInfo.valueType);
    this.autoResize();
  }

  createChart() {
    const layout = {
      width: this.size[0],
      height: this.size[1],
      margin: {
        l: 50,
        r: 30,
        b: 40,
        t: 20,
        pad: 0
      },
      xaxis: {
        title: this.plotlyInfo.xaxisLabel,
      },
      yaxis: {
        title: this.plotlyInfo.yaxisLabel,
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      title: false,
      showLegend: this.plotlyInfo.showLegend,
      hovermode: 'closest',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }

    this.loaded = true;
    this.plotlyInfo.layout = layout;
    this.changeDetector.detectChanges();
    this.chart = this.chartDiv.nativeElement;
    Plotly.newPlot(this.chart, this.plotlyInfo.data, this.plotlyInfo.layout);

    this.addRangeToService(this.chartDiv.nativeElement.layout.xaxis.range, this.chartDiv.nativeElement.layout.yaxis.range);
    this.autoResize();

  }
  addRangeToService(xrangeArray: [number, number], yrangeArray: [number, number]) {
    if (this.plotlyInfo.rangeObs) {
      this.chartService.addRange(xrangeArray, yrangeArray, this.plotlyInfo.valueType)
    }
  }

  autoResize() {
    if (this.plotlyInfo.rangeObs) {
      this.chartService.updateRanges(this.plotlyInfo.valueType);
    }
  }

  updateRange(range: PlotlyRange) {
    if (this.loaded) {
      const update = { 'xaxis.range': range.xrange, 'yaxis.range': range.yrange };
      Plotly.relayout(this.chart, update)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const size: SimpleChange = changes.size;
    this.size = size.currentValue;
    if (this.loaded) {
      const update = {
        width: this.size[0],
        height: this.size[1],
      };
      Plotly.relayout(this.chart, update);
    }
  }

}
