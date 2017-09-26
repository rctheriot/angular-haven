import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MaterialModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdSelectModule } from '@angular/material';

import { SidebarchartsComponent } from './sidebarcharts/sidebarcharts.component';
import { SidebaraccountComponent } from './sidebaraccount/sidebaraccount.component';
import { SidebarmapsComponent } from './sidebarmaps/sidebarmaps.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdSelectModule,
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
