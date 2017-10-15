import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppMaterialModules } from '../shared/material.module';

import { SidebarchartsComponent } from './sidebarcharts/sidebarcharts.component';
import { SidebaraccountComponent } from './sidebaraccount/sidebaraccount.component';
import { SidebarmapsComponent } from './sidebarmaps/sidebarmaps.component';

import { DirectivesModule } from '../shared/directives.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AppMaterialModules,
    DirectivesModule,
  ],
  declarations: [
    SidebarchartsComponent,
    SidebaraccountComponent,
    SidebarmapsComponent,
  ],
  exports: [
    SidebarchartsComponent,
    SidebaraccountComponent,
    SidebarmapsComponent,
  ]
})
export class SidebarsModule { }
