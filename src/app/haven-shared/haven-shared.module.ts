import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HavenMaterialModule } from './haven-material/haven-material.module';
import { HavenButtonDirective } from './haven-directives/haven-button.directive';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HavenMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HavenButtonDirective,
  ],
  exports: [
    HavenButtonDirective,
    BrowserAnimationsModule,
    HavenMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HavenSharedModule { }
