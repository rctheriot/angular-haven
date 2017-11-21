import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenAppsModule } from '../haven-apps/haven-apps.module';
import { HavenSharedModule } from '../haven-shared/haven-shared.module';

import { HavenWindowComponent } from './haven-window-component/haven-window.component';
import { HavenWindowFactoryComponent } from './haven-window-factory/haven-window-factory.component'

import { HavenWindowHostDirective } from './haven-window-shared/haven-window-host.directive';
import { HavenWindowDragDirective } from './haven-window-directives/haven-window-drag.directive';
import { HavenWindowResizeDirective } from './haven-window-directives/haven-window-resize.directive';

import { HavenWindowService } from './haven-window-services/haven-window.service';


@NgModule({
  imports: [
    CommonModule,
    HavenAppsModule,
    HavenSharedModule,
  ],
  declarations: [
    HavenWindowComponent,
    HavenWindowFactoryComponent,
    HavenWindowHostDirective,
    HavenWindowDragDirective,
    HavenWindowResizeDirective,
  ],
  exports: [
    HavenWindowFactoryComponent,
  ],
  providers: [
    HavenWindowService,
  ],
  entryComponents: [
    HavenWindowComponent
  ]
})
export class HavenWindowModule { }
