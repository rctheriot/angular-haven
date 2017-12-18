import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HavenSharedModule } from '../haven-shared/haven-shared.module';

import { HavenSidebarPlotlyComponent } from './haven-sidebar-plotly/haven-sidebar-plotly.component'
import { HavenSidebarSessionsComponent } from './haven-sidebar-sessions/haven-sidebar-sessions.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HavenSharedModule,
  ],
  declarations: [
    HavenSidebarPlotlyComponent,
    HavenSidebarSessionsComponent,
  ],
  exports: [
    HavenSidebarPlotlyComponent,
    HavenSidebarSessionsComponent,
  ]
})
export class HavenSidebarsModule { }
