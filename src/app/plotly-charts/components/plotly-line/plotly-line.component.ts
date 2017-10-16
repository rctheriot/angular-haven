import { Component, OnInit, OnDestroy, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyInfo } from '../../shared/plotlyInfo';
import { PlotlyRange } from '../../shared/plotlyRange';
import { PlotlyChartsService } from '../../service/plotly-charts.service';

@Component({
  selector: 'app-plotly-line',
  templateUrl: './plotly-line.component.html',
  styleUrls: ['./plotly-line.component.css']
})
export class PlotlyLineComponent implements OnInit, OnDestroy {

  @Input() chartInfo: PlotlyInfo;
  @ViewChild('chart') chartDiv: ElementRef;
  private chart: ElementRef
  loaded = false;
  rangeId: number;

  constructor(private changeDetector: ChangeDetectorRef, private chartService: PlotlyChartsService) { }

  ngOnInit() {
    if (this.chartInfo.rangeObs) { this.chartInfo.rangeObs.subscribe(range => this.updateRange(range)); }
    this.createChart();
  }

  ngOnDestroy() {
    this.chartService.removeRange(this.rangeId, this.chartInfo.valueType);
    this.chartService.removeRange(this.rangeId, this.chartInfo.valueType);
    this.autoResize();
  }

  createChart() {
    const layout = {
      margin: {
        l: 50,
        r: 30,
        b: 40,
        t: 20,
        pad: 0
      },
      xaxis: {
        title: this.chartInfo.xaxisLabel,
      },
      yaxis: {
        title: this.chartInfo.yaxisLabel,
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      title: false,
      showLegend: this.chartInfo.showLegend,
      hovermode: 'closest',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }

    this.loaded = true;
    this.changeDetector.detectChanges();
    this.chart = this.chartDiv.nativeElement;
    Plotly.newPlot(this.chart, this.chartInfo.data, layout);
    this.addRangeToService(this.chartDiv.nativeElement.layout.xaxis.range, this.chartDiv.nativeElement.layout.yaxis.range);
    this.autoResize();

  }
  addRangeToService(xrangeArray: [number, number], yrangeArray: [number, number]) {
    if (this.chartInfo.rangeObs) {
      this.chartService.addRange(xrangeArray, yrangeArray, this.chartInfo.valueType)
    }
  }

  autoResize() {
    if (this.chartInfo.rangeObs) {
      this.chartService.updateRanges(this.chartInfo.valueType);
    }
  }

  updateRange(range: PlotlyRange) {
    if (this.loaded) {
      const update = { 'xaxis.range': range.xrange,  'yaxis.range': range.yrange  };
      Plotly.relayout(this.chart, update)
    }
  }

  public resize(width: number, height: number) {
    const update = {
      width: width,
      height: height,
    };

    if (this.loaded) {
      Plotly.relayout(this.chart, update);
    }

  }

}
