import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlotlyChartComponent } from './plotly-chart/plotly-chart.component';
import { PlotlyLineComponent } from './components/plotly-line/plotly-line.component';
import { Plotly3dsurfaceComponent } from './components/plotly-3dsurface/plotly-3dsurface.component';
import { PlotlyBarComponent } from './components/plotly-bar/plotly-bar.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PlotlyChartComponent,
    PlotlyLineComponent,
    Plotly3dsurfaceComponent,
    PlotlyBarComponent,
  ],
  exports: [
    PlotlyChartComponent,
  ],
  providers: []
})
export class PlotlyChartsModule { }
