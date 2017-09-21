import { Component, AfterViewInit, Input, ViewChild, Renderer } from '@angular/core';
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
  @ViewChild('child') childComponent;
  @ViewChild('glyphSize') glyphSize;

  @Input() public chartid: number;
  @Input() public title: string;
  @Input() public type: string;
  @Input() public view: [number, number];

  winMLocX: number;
  winMLocY: number;
  backgroundAlpha: number = 0.5;

  winXSize: number;
  winYSize: number;

  saveLeft: number;
  saveTop: number;
  saveWidth: number;
  saveHeight: number;
  maximized = false;

  constructor(private chartService: ChartServiceService, private _renderer: Renderer) {

  }

  ngAfterViewInit() {

    WindowComponent.numWindows.push(this.panelDiv.nativeElement);

    this.panelDiv.nativeElement.style.width = this.view[0] + 'px';
    this.panelDiv.nativeElement.style.height = this.view[1] + 'px';

    if (this.childComponent !== undefined) {
      const mutObs = new MutationObserver(() => this.resize());
      mutObs.observe(this.panelDiv.nativeElement, { attributes: true });
    }

    this.dragBar.nativeElement.addEventListener('mousedown', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const winX = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().left, 10);
      const winY = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().top, 10);
      this.winMLocX = mouseX - winX;
      this.winMLocY = mouseY - winY;
      WindowComponent.lastClickDiv = this;
      document.addEventListener('mousemove', this.startDragging);

      this.bringWindowForward();

    })

    document.addEventListener('mouseup', () => { this.stopDragging(); });
    window.addEventListener('resize', () => { this.windowResize() });
    this.panelDiv.nativeElement.addEventListener('mousedown', () => { this.bringWindowForward(); });

    this.panelDiv.nativeElement.style.width = this.view[0];
    this.panelDiv.nativeElement.style.height = this.view[1];

  }

  bringWindowForward() {
    WindowComponent.numWindows.push(
      WindowComponent.numWindows.splice(
        WindowComponent.numWindows.indexOf(this.panelDiv.nativeElement), 1)[0]);

    for (let i = 0; i < WindowComponent.numWindows.length; i++) {
      WindowComponent.numWindows[i].style.zIndex = i;
    }
  }

  startDragging(e) {
    const container = WindowComponent.lastClickDiv;
    let left = e.clientX - container.winMLocX;
    let top = e.clientY - container.winMLocY;

    if (top < 30) { top = 30; }
    if (top > (window.innerHeight - 70)) { top = window.innerHeight - 70; }
    if (left < 0) { left = 0; }
    if (left > (window.innerWidth - 70)) { left = window.innerWidth - 70; }

    container.panelDiv.nativeElement.style.left = left + 'px';
    container.panelDiv.nativeElement.style.top = top + 'px';
    window.getSelection().removeAllRanges();
  }

  stopDragging() {
    document.removeEventListener('mousemove', this.startDragging);
  }

  resize() {
    if (this.winXSize !== this.panelDiv.nativeElement.getBoundingClientRect().width ||
      this.winYSize !== this.panelDiv.nativeElement.getBoundingClientRect().height) {

      this.winXSize = this.panelDiv.nativeElement.getBoundingClientRect().width;
      this.winYSize = this.panelDiv.nativeElement.getBoundingClientRect().height;
      this.childComponent.resize(this.winXSize, this.winYSize);
    }


  }

  removeChart() {
    this.chartService.removeChart(this.chartid);
  }

  incAlpha() {
    this.backgroundAlpha += 0.05;
    this.backgroundAlpha = Math.min(this.backgroundAlpha, 1.0);
    this._renderer.setElementStyle(this.panelDiv.nativeElement, 'background-color', 'rgba(255, 255, 255,' + this.backgroundAlpha + ')');
  }

  decAlpha() {
    this.backgroundAlpha -= 0.05;
    this.backgroundAlpha = Math.max(this.backgroundAlpha, 0.0);
    this._renderer.setElementStyle(this.panelDiv.nativeElement, 'background-color', 'rgba(255, 255, 255,' + this.backgroundAlpha + ')');
  }


  maximize() {

    if (!this.maximized) {

      this.saveLeft = this.panelDiv.nativeElement.style.left;
      this.saveTop = this.panelDiv.nativeElement.style.top;
      this.saveWidth = this.panelDiv.nativeElement.getBoundingClientRect().width;
      this.saveHeight = this.panelDiv.nativeElement.getBoundingClientRect().height;

      this.panelDiv.nativeElement.style.left = 0 + 'px';
      this.panelDiv.nativeElement.style.top = 30 + 'px';
      this.panelDiv.nativeElement.style.width = window.innerWidth + 'px';
      this.panelDiv.nativeElement.style.height = window.innerHeight - 60 + 'px';
      this._renderer.setElementStyle(this.panelDiv.nativeElement, 'background-color', 'rgba(255, 255, 255,' + 1.0 + ')');
      this.maximized = true;
    
      this.glyphSize.nativeElement.class = 'glyphicon glyphicon-resize-small';

    } else {
      this.panelDiv.nativeElement.style.left = this.saveLeft;
      this.panelDiv.nativeElement.style.top = this.saveTop;
      this.panelDiv.nativeElement.style.width = this.saveWidth + 'px';
      this.panelDiv.nativeElement.style.height = this.saveHeight + 'px';
      this._renderer.setElementStyle(this.panelDiv.nativeElement, 'background-color', 'rgba(255, 255, 255,' + this.backgroundAlpha + ')');
      this.maximized = false;
      this.glyphSize.nativeElement.class = 'glyphicon glyphicon-resize-full';
    }
  }

  windowResize() {

    let winX = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().left, 10);
    let winY = parseInt(this.panelDiv.nativeElement.getBoundingClientRect().top, 10);

    if (winY > (window.innerHeight - 70)) { winY = window.innerHeight - 70; }
    if (winX > (window.innerWidth - 70)) { winX = window.innerWidth - 70; }

    this.panelDiv.nativeElement.style.left = winX + 'px';
    this.panelDiv.nativeElement.style.top = winY + 'px';

    window.getSelection().removeAllRanges();

  }

}
