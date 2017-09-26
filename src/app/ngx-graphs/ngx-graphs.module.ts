import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxgraphComponent } from './ngxgraph/ngxgraph.component';
import { NgxlineComponent } from './components/ngxline/ngxline.component';
import { NgxguageComponent } from './components/ngxguage/ngxguage.component';
import { NgxradarComponent } from './components/ngxradar/ngxradar.component';
import { NgxvbarComponent } from './components/ngxvbar/ngxvbar.component';
import { NgxheatmapComponent } from './components/ngxheatmap/ngxheatmap.component';


@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule,
  ],
  declarations: [
    NgxgraphComponent,
    NgxlineComponent,
    NgxguageComponent,
    NgxradarComponent,
    NgxvbarComponent,
    NgxheatmapComponent
  ],
  exports: [
    NgxgraphComponent,
  ]
})
export class NgxGraphsModule { }
