import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HavenSharedModule } from '../../../haven-shared/haven-shared.module';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HavenLeafletComponent } from './haven-leaflet-component/haven-leaflet.component';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    HavenSharedModule,
  ],
  declarations: [
    HavenLeafletComponent,
  ],
  entryComponents: [
    HavenLeafletComponent
  ]
})
export class HavenLeafletModule { }
