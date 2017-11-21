import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HavenLeafletComponent } from './haven-leaflet-component/haven-leaflet.component';

import { HavenLeafletService } from './haven-leaflet-services/haven-leaflet.service';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
  ],
  declarations: [
    HavenLeafletComponent,
  ],
  providers: [
    HavenLeafletService,
  ],
  entryComponents: [
    HavenLeafletComponent
  ]
})
export class HavenLeafletModule { }
