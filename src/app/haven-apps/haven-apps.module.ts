import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenLeafletModule } from './haven-apps/haven-leaflet/haven-leaflet.module';
import { HavenPlotlyModule } from './haven-apps/haven-plotly/haven-plotly.module';

import { HavenAppsHostDirective } from './haven-apps-shared/haven-apps-host.directive';
import { HavenAppsFactoryComponent } from './haven-apps-factory/haven-apps-factory.component';

@NgModule({
  imports: [
    CommonModule,
    HavenLeafletModule,
    HavenPlotlyModule,
  ],
  declarations: [
    HavenAppsFactoryComponent,
    HavenAppsHostDirective,
  ],
  exports: [
    HavenLeafletModule,
    HavenPlotlyModule,
    HavenAppsHostDirective,
    HavenAppsFactoryComponent,
  ],
  providers: [],
})
export class HavenAppsModule { }
