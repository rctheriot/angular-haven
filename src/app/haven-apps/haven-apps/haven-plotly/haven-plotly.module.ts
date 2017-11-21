import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { PlotlyLineComponent } from './haven-plotly-components/plotly-line/plotly-line.component';
import { Plotly3dsurfaceComponent } from './haven-plotly-components/plotly-3dsurface/plotly-3dsurface.component';
import { PlotlyBarComponent } from './haven-plotly-components/plotly-bar/plotly-bar.component';
import { PlotlyHeatmapComponent } from './haven-plotly-components/plotly-heatmap/plotly-heatmap.component';

import { HavenPlotlyQueryService } from './haven-plotly-services/haven-plotly-query.service';
import { HavenPlotlyRangeService } from './haven-plotly-services/haven-plotly-range.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    PlotlyLineComponent,
    Plotly3dsurfaceComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
  ],
  providers: [
    HavenPlotlyQueryService,
    HavenPlotlyRangeService
  ],
  entryComponents: [
    Plotly3dsurfaceComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
    PlotlyLineComponent
  ]
})
export class HavenPlotlyModule { }
