import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonDirective } from './directives/button.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ButtonDirective
  ],
  exports: [
    ButtonDirective
  ]
})
export class DirectivesModule { }
