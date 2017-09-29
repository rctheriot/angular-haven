import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxgraphComponent } from './ngxgraph/ngxgraph.component';
import { NgxlineComponent } from './components/ngxline/ngxline.component';
import { NgxguageComponent } from './components/ngxguage/ngxguage.component';
import { NgxradarComponent } from './components/ngxradar/ngxradar.component';
import { NgxvbarComponent } from './components/ngxvbar/ngxvbar.component';
import { NgxheatmapComponent } from './components/ngxheatmap/ngxheatmap.component';
import { NgxareaComponent } from './components/ngxarea/ngxarea.component';
import { NgxstackhorzbarComponent } from './components/ngxstackhorzbar/ngxstackhorzbar.component';
import { NgxstackvertbarComponent } from './components/ngxstackvertbar/ngxstackvertbar.component';


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
    NgxheatmapComponent,
    NgxareaComponent,
    NgxstackhorzbarComponent,
    NgxstackvertbarComponent
  ],
  exports: [
    NgxgraphComponent,
  ]
})
export class NgxGraphsModule { }
