import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ChartServiceService } from '../../shared/chart-service.service';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
  providers: [ChartServiceService]
})
export class WindowComponent implements AfterViewInit {
  static lastClickDiv: any;
  static numWindows = [];

  @ViewChild('dragBar') dragBar;
  @ViewChild('panelDiv') panelDiv;

  @Input() public id: number;
  @Input() public title: string;
  @Input() public type: string;
  @Input() public view: [number, number];

  winMLocX: number;
  winMLocY: number;

  constructor(private chartService: ChartServiceService) { }

  ngAfterViewInit() {

    WindowComponent.numWindows.push(this.panelDiv.nativeElement);

    const mutObs = new MutationObserver(() => this.resize());
    mutObs.observe(this.panelDiv.nativeElement, {attributes: true});

    this.panelDiv.nativeElement.style.width = this.view[0] + 'px';
    this.panelDiv.nativeElement.style.height = this.view[1] + 'px';

    this.dragBar.nativeElement.addEventListener('mousedown', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const winX = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().left, 10);
      const winY = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().top, 10);
      this.winMLocX = mouseX - winX;
      this.winMLocY = mouseY - winY;
      WindowComponent.lastClickDiv = this;
      document.addEventListener('mousemove', this.startDragging);

      WindowComponent.numWindows.push(
        WindowComponent.numWindows.splice(
          WindowComponent.numWindows.indexOf(this.panelDiv.nativeElement), 1)[0]);

      for (let i = 0; i < WindowComponent.numWindows.length; i++) {
        WindowComponent.numWindows[i].style.zIndex = i;
      }

    })

    this.dragBar.nativeElement.addEventListener('mouseup', () => { this.stopDragging(); });
    this.panelDiv.nativeElement.addEventListener('onresize', () => { console.log('resize'); });

  }

  startDragging(e) {
    const container = WindowComponent.lastClickDiv;
    const left = e.clientX - container.winMLocX;
    let top = e.clientY - container.winMLocY;

    if (top < 50) { top = 50; }
    if (top > (window.innerHeight - 100)) { top = window.innerHeight - 100; }

    container.panelDiv.nativeElement.style.left = left + 'px';
    container.panelDiv.nativeElement.style.top = top + 'px';
    window.getSelection().removeAllRanges();
  }

  stopDragging() {
    document.removeEventListener('mousemove', this.startDragging);
  }

  resize() {
    // this.view[0] = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().left, 10);
    // this.view[1] = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().top, 10);
    console.log("resize");
  }
}
