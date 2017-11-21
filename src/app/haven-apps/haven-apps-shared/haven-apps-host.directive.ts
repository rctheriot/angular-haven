import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHavenAppsHost]',
})
export class HavenAppsHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
