import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppMaterialModules } from '../shared/material.module';
import { DirectivesModule } from '../shared/directives.module'

import { PlotlyChartComponent } from './plotly-chart/plotly-chart.component';
import { PlotlyLineComponent } from './components/plotly-line/plotly-line.component';
import { Plotly3dsurfaceComponent } from './components/plotly-3dsurface/plotly-3dsurface.component';
import { PlotlyBarComponent } from './components/plotly-bar/plotly-bar.component';
import { PlotlyHeatmapComponent } from './components/plotly-heatmap/plotly-heatmap.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AppMaterialModules,
    DirectivesModule,
  ],
  declarations: [
    PlotlyChartComponent,
    PlotlyLineComponent,
    Plotly3dsurfaceComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
  ],
  exports: [
    PlotlyChartComponent,
  ],
  providers: []
})
export class PlotlyChartsModule { }
