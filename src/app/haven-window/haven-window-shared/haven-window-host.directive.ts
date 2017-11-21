import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHavenWindowHost]',
})
export class HavenWindowHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
