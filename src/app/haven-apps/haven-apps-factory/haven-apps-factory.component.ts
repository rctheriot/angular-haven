import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';

import { HavenAppsHostDirective } from '../haven-apps-shared/haven-apps-host.directive';
import { HavenWindow } from '../../haven-window/haven-window-shared/haven-window';
import { HavenWindowService } from '../../haven-window/haven-window-services/haven-window.service';
import { HavenApp } from '../haven-apps-shared/haven-app';
import { HavenAppList } from '../haven-apps-shared/haven-app-list';

@Component({
  selector: 'app-haven-apps-factory',
  templateUrl: './haven-apps-factory.component.html',
  styleUrls: ['./haven-apps-factory.component.css']
})
export class HavenAppsFactoryComponent implements OnInit {

  @ViewChild(HavenAppsHostDirective) havenAppsHost: HavenAppsHostDirective;
  @Input()windowId: number;
  componentRef: ComponentRef<any>;

  constructor(private havenWindowService: HavenWindowService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.havenWindowService.getWindow(this.windowId).then(havenWindow => {
      this.addApp(havenWindow);
    })
  }

  addApp(havenWindow: HavenWindow) {
    console.log(havenWindow);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HavenAppList.apps[havenWindow.app.appName]);
    const viewContainerRef = this.havenAppsHost.viewContainerRef;
    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance).appInfo = havenWindow.app.appInfo;
  }

  resize() {
    (this.componentRef.instance).resize();
  }

}
