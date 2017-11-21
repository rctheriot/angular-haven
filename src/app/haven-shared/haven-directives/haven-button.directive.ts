import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[appHavenButton]' })
export class HavenButtonDirective {

    fontColor = 'white';
    fontSize = 18;
    widthPercent = 100;
    letterSpacing = 1;

    constructor(el: ElementRef) {
       el.nativeElement.style.width = this.widthPercent + '%';
       el.nativeElement.style.color = this.fontColor;
       el.nativeElement.style.fontSize = this.fontSize + 'px';
       el.nativeElement.style.letterSpacing = this.letterSpacing + 'px';
    }

}
