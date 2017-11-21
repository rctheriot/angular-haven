import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HavenMaterialModule } from './haven-material/haven-material.module';
import { HavenButtonDirective } from './haven-directives/haven-button.directive';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HavenButtonDirective,
  ],
  exports: [
    HavenButtonDirective,
    HavenMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HavenSharedModule { }
