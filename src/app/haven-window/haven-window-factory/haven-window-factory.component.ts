import { Component, OnInit, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';

import { HavenWindowHostDirective } from '../haven-window-shared/haven-window-host.directive';

import { HavenWindowService } from '../haven-window-services/haven-window.service';
import { HavenWindowComponent } from '../haven-window-component/haven-window.component';
import { HavenWindow } from '../haven-window-shared/haven-window';

@Component({
  selector: 'app-haven-window-factory',
  templateUrl: './haven-window-factory.component.html',
  styleUrls: ['./haven-window-factory.component.css']
})
export class HavenWindowFactoryComponent implements OnInit {

  @ViewChild(HavenWindowHostDirective) havenWindowHost: HavenWindowHostDirective;
  havenWindowComponentList: {} = {};

  constructor(private havenWindowService: HavenWindowService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.havenWindowService.HavenWindowAdd.subscribe(havenWindow => { this.addWindow(havenWindow); });
    this.havenWindowService.HavenWindowRemove.subscribe(havenWindow => { this.removeWindow(havenWindow); });
  }

  addWindow(havenWindow: HavenWindow) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HavenWindowComponent);
    const viewContainerRef = this.havenWindowHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<HavenWindowComponent>componentRef.instance).havenWindow = havenWindow;
    this.havenWindowComponentList[havenWindow.id] = componentRef;
  }

  removeWindow(havenWindow: HavenWindow) {
    this.havenWindowComponentList[havenWindow.id].destroy();
    delete this.havenWindowComponentList[havenWindow.id];
  }

}
