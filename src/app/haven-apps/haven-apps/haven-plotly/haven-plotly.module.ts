import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { HavenSharedModule } from '../../../haven-shared/haven-shared.module';


import { PlotlyLineComponent } from './haven-plotly-components/plotly-line/plotly-line.component';
import { Plotly3dsurfaceComponent } from './haven-plotly-components/plotly-3dsurface/plotly-3dsurface.component';
import { PlotlyBarComponent } from './haven-plotly-components/plotly-bar/plotly-bar.component';
import { PlotlyHeatmapComponent } from './haven-plotly-components/plotly-heatmap/plotly-heatmap.component';
import { PlotlyTableComponent } from './haven-plotly-components/plotly-table/plotly-table.component';
import { GardenComponent } from './haven-plotly-components/garden/garden.component';


import { HavenPlotlyQueryService } from './haven-plotly-services/haven-plotly-query.service';
import { HavenPlotlyRangeService } from './haven-plotly-services/haven-plotly-range.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    HavenSharedModule
  ],
  declarations: [
    PlotlyLineComponent,
    Plotly3dsurfaceComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
    PlotlyTableComponent,
    GardenComponent,
  ],
  providers: [
    HavenPlotlyQueryService,
    HavenPlotlyRangeService
  ],
  entryComponents: [
    Plotly3dsurfaceComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
    PlotlyLineComponent,
    PlotlyTableComponent,
    GardenComponent
  ]
})
export class HavenPlotlyModule { }
