import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { HavenSharedModule } from '../haven-shared/haven-shared.module';

import { HavenSidebarPlotlyComponent } from './haven-sidebar-plotly/haven-sidebar-plotly.component'
import { HavenSidebarLeafletComponent } from './haven-sidebar-leaflet/haven-sidebar-leaflet.component';
import { HavenSidebarSessionsComponent } from './haven-sidebar-sessions/haven-sidebar-sessions.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    HavenSharedModule,
  ],
  declarations: [
    HavenSidebarPlotlyComponent,
    HavenSidebarLeafletComponent,
    HavenSidebarSessionsComponent,
  ],
  exports: [
    HavenSidebarPlotlyComponent,
    HavenSidebarLeafletComponent,
    HavenSidebarSessionsComponent,
  ]
})
export class HavenSidebarsModule { }
